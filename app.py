from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tempfile
import os

app = Flask(__name__)
CORS(app)

# Health check endpoint for Render
@app.route('/healthz', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'zatorres-foot-measurement'})

# Known paper sizes in mm
PAPER_SIZES = {
    'A4': (210, 297),  # width, height in mm
    'Letter': (216, 279)
}

def simple_paper_detection(img):
    """Simple, reliable paper detection"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Simple edge detection
    edges = cv2.Canny(blurred, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest rectangular contour
    best_contour = None
    max_area = 0
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 1000:  # Too small
            continue
            
        # Approximate to polygon
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
        
        # Look for roughly rectangular shapes (4-6 sides)
        if 4 <= len(approx) <= 6:
            if area > max_area:
                max_area = area
                best_contour = approx
    
    return best_contour

def simple_foot_detection(img, paper_contour):
    """Simple foot detection - find the largest object inside the paper"""
    # Create mask for paper area
    mask = np.zeros_like(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    cv2.drawContours(mask, [paper_contour], -1, 255, -1)
    
    # Find contours inside paper
    masked = cv2.bitwise_and(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 
                             cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 
                             mask=mask)
    
    contours, _ = cv2.findContours(masked, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour (should be the foot)
    paper_area = cv2.contourArea(paper_contour)
    best_foot = None
    max_area = 0
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        # Ignore very small contours and the paper itself
        if area > max_area and area < paper_area * 0.9:
            max_area = area
            best_foot = cnt
    
    return best_foot

@app.route('/api/measure-foot', methods=['POST'])
def measure_foot():
    if 'photo' not in request.files:
        return jsonify({'error': 'No photo uploaded'}), 400
    
    photo = request.files['photo']
    paper_type = request.form.get('paper_type', 'A4')
    paper_width_mm, paper_height_mm = PAPER_SIZES.get(paper_type, PAPER_SIZES['A4'])

    # Save the uploaded photo to a temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
        photo.save(tmp.name)
        img_path = tmp.name

    # Read image
    img = cv2.imread(img_path)
    if img is None:
        os.remove(img_path)
        return jsonify({'error': 'Could not read image'}), 400

    # Simple paper detection
    paper_contour = simple_paper_detection(img)
    
    if paper_contour is None:
        os.remove(img_path)
        return jsonify({'error': 'Could not detect paper. Please ensure the paper is clearly visible and well-lit.'}), 400

    # Get paper scale
    paper_pts = paper_contour.reshape(4, 2)
    # Order points: top-left, top-right, bottom-right, bottom-left
    s = paper_pts.sum(axis=1)
    diff = np.diff(paper_pts, axis=1)
    ordered = np.array([
        paper_pts[np.argmin(s)],
        paper_pts[np.argmin(diff)],
        paper_pts[np.argmax(s)],
        paper_pts[np.argmax(diff)]
    ])
    (tl, tr, br, bl) = ordered
    width_px = np.linalg.norm(tr - tl)
    height_px = np.linalg.norm(bl - tl)
    px_per_mm = width_px / paper_width_mm

    # Simple foot detection
    foot_contour = simple_foot_detection(img, paper_contour)
    
    if foot_contour is None:
        os.remove(img_path)
        return jsonify({'error': 'Could not detect foot on the paper. Please ensure your foot is clearly visible on the paper.'}), 400

    # Get foot measurements using bounding rectangle
    x, y, w, h = cv2.boundingRect(foot_contour)
    
    # Convert to mm
    foot_length_mm = h / px_per_mm
    foot_width_mm = w / px_per_mm
    
    # Basic validation
    if foot_length_mm < 150 or foot_length_mm > 350:
        os.remove(img_path)
        return jsonify({'error': f'Detected foot length ({foot_length_mm}mm) seems unrealistic. Please check the photo.'}), 400
    
    if foot_width_mm < 50 or foot_width_mm > 150:
        os.remove(img_path)
        return jsonify({'error': f'Detected foot width ({foot_width_mm}mm) seems unrealistic. Please check the photo.'}), 400

    os.remove(img_path)
    
    return jsonify({
        'foot_length_mm': round(foot_length_mm, 1),
        'foot_width_mm': round(foot_width_mm, 1),
        'paper_type': paper_type,
        'message': f'Successfully measured: {round(foot_length_mm, 1)}mm length, {round(foot_width_mm, 1)}mm width'
    })

if __name__ == '__main__':
    app.run(debug=True) 