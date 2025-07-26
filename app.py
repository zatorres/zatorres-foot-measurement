from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tempfile
import os
from sklearn.cluster import KMeans

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

def analyze_colors(img, contour):
    """Analyze color distribution to identify skin vs paper"""
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.drawContours(mask, [contour], -1, 255, -1)
    
    # Get colors within the contour
    masked_img = cv2.bitwise_and(img, img, mask=mask)
    pixels = masked_img[mask == 255]
    
    if len(pixels) == 0:
        return 0
    
    # Convert to HSV for better skin detection
    hsv_pixels = cv2.cvtColor(pixels.reshape(-1, 1, 3), cv2.COLOR_BGR2HSV)
    
    # Skin color ranges in HSV
    skin_lower = np.array([0, 20, 70])
    skin_upper = np.array([20, 255, 255])
    
    # Count skin-colored pixels
    skin_mask = cv2.inRange(hsv_pixels, skin_lower, skin_upper)
    skin_ratio = np.sum(skin_mask > 0) / len(pixels)
    
    return skin_ratio

def detect_foot_edges(contour, img):
    """Analyze edge patterns to identify foot-like features"""
    mask = np.zeros(img.shape[:2], dtype=np.uint8)
    cv2.drawContours(mask, [contour], -1, 255, -1)
    
    # Get the region around the contour
    x, y, w, h = cv2.boundingRect(contour)
    roi = img[y:y+h, x:x+w]
    roi_mask = mask[y:y+h, x:x+w]
    
    if roi.size == 0:
        return 0
    
    # Apply edge detection
    gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray_roi, 50, 150)
    
    # Look for horizontal lines (typical of foot outline)
    horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 1))
    horizontal_lines = cv2.morphologyEx(edges, cv2.MORPH_OPEN, horizontal_kernel)
    
    # Calculate horizontal line density
    line_density = np.sum(horizontal_lines > 0) / (w * h)
    
    return line_density

def calculate_foot_confidence(contour, img, paper_area):
    """Comprehensive confidence scoring for foot detection"""
    area = cv2.contourArea(contour)
    x, y, w, h = cv2.boundingRect(contour)
    
    # Basic size validation
    if area < paper_area * 0.05 or area > paper_area * 0.8:
        return 0
    
    # Aspect ratio analysis (feet are longer than wide)
    aspect_ratio = w / h if h > 0 else 0
    if not (0.15 <= aspect_ratio <= 0.6):
        return 0
    
    # Size validation (typical foot sizes)
    foot_length_px = h
    if not (150 <= foot_length_px <= 400):  # reasonable foot size in pixels
        return 0
    
    # Color analysis (skin detection)
    skin_ratio = analyze_colors(img, contour)
    color_score = min(skin_ratio * 2, 1.0)  # Boost skin detection
    
    # Edge pattern analysis
    edge_score = detect_foot_edges(contour, img)
    edge_score = min(edge_score * 10, 1.0)  # Normalize edge score
    
    # Shape complexity (feet have moderate complexity)
    perimeter = cv2.arcLength(contour, True)
    shape_complexity = perimeter / np.sqrt(area) if area > 0 else 0
    complexity_score = 1.0 if 3 <= shape_complexity <= 8 else 0.5
    
    # Position analysis (foot should be roughly centered on paper)
    paper_center_x = img.shape[1] / 2
    paper_center_y = img.shape[0] / 2
    contour_center_x = x + w/2
    contour_center_y = y + h/2
    
    distance_from_center = np.sqrt((contour_center_x - paper_center_x)**2 + 
                                  (contour_center_y - paper_center_y)**2)
    max_distance = np.sqrt(img.shape[0]**2 + img.shape[1]**2) / 2
    position_score = 1.0 - (distance_from_center / max_distance)
    
    # Combined confidence score
    confidence = (color_score * 0.3 + 
                 edge_score * 0.2 + 
                 complexity_score * 0.2 + 
                 position_score * 0.3)
    
    return confidence

def detect_foot_length(img, paper_contour, px_per_mm):
    """Advanced foot detection with multiple validation layers"""
    
    # Create mask for paper area
    mask = np.zeros_like(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY))
    cv2.drawContours(mask, [paper_contour], -1, 255, -1)
    
    # Find contours inside paper area
    masked = cv2.bitwise_and(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 
                             cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 
                             mask=mask)
    
    contours, _ = cv2.findContours(masked, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Analyze all potential foot candidates
    paper_area = cv2.contourArea(paper_contour)
    candidates = []
    
    for cnt in contours:
        confidence = calculate_foot_confidence(cnt, img, paper_area)
        if confidence > 0.3:  # Minimum confidence threshold
            candidates.append((cnt, confidence))
    
    if not candidates:
        return None, "Could not detect a foot-like shape. Please ensure: 1) Foot is clearly visible, 2) Good lighting, 3) Foot is on the paper, 4) No shadows covering the foot"
    
    # Sort by confidence and pick the best
    candidates.sort(key=lambda x: x[1], reverse=True)
    best_contour, confidence = candidates[0]
    
    # Get measurements using bounding rectangle (works at any angle)
    x, y, w, h = cv2.boundingRect(best_contour)
    
    # Convert to mm
    foot_length_mm = h / px_per_mm
    foot_width_mm = w / px_per_mm
    
    # Validate measurements
    if foot_length_mm < 150 or foot_length_mm > 350:
        return None, f"Detected foot length ({foot_length_mm}mm) seems unrealistic. Please check the photo quality and ensure the entire foot is visible."
    
    if foot_width_mm < 50 or foot_width_mm > 150:
        return None, f"Detected foot width ({foot_width_mm}mm) seems unrealistic. Please ensure the foot is fully visible on the paper."
    
    return {
        'length_mm': round(foot_length_mm, 1),
        'width_mm': round(foot_width_mm, 1),
        'confidence': round(confidence, 2),
        'contour': best_contour
    }, None

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

    # Convert to grayscale and blur
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)

    # Edge detection
    edged = cv2.Canny(blurred, 50, 150)

    # Find contours
    contours, _ = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    paper_contour = None
    max_area = 0
    
    for cnt in contours:
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
        area = cv2.contourArea(cnt)
        if len(approx) == 4 and area > max_area:
            paper_contour = approx
            max_area = area

    if paper_contour is None:
        os.remove(img_path)
        return jsonify({'error': 'Could not detect paper in the image. Please ensure: 1) Entire paper is visible, 2) Good lighting, 3) Paper edges are clear, 4) Camera is parallel to paper'}), 400

    # Get paper bounding box and scale
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

    # Detect foot using advanced algorithm
    foot_data, error = detect_foot_length(img, paper_contour, px_per_mm)
    
    if error:
        os.remove(img_path)
        return jsonify({'error': error}), 400

    os.remove(img_path)
    
    # Determine confidence level
    confidence_level = 'high' if foot_data['confidence'] > 0.7 else 'medium' if foot_data['confidence'] > 0.5 else 'low'
    
    return jsonify({
        'foot_length_mm': foot_data['length_mm'],
        'foot_width_mm': foot_data['width_mm'],
        'paper_type': paper_type,
        'detection_confidence': confidence_level,
        'confidence_score': foot_data['confidence'],
        'message': f"Successfully detected foot: {foot_data['length_mm']}mm length, {foot_data['width_mm']}mm width"
    })

if __name__ == '__main__':
    app.run(debug=True) 