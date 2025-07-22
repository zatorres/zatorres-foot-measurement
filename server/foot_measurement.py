from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import tempfile
import os

app = Flask(__name__)
CORS(app)

# Known paper sizes in mm
PAPER_SIZES = {
    'A4': (210, 297),  # width, height in mm
    'Letter': (216, 279)
}

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
        return jsonify({'error': 'Could not detect paper in the image'}), 400

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

    # Mask out the paper area and find the largest contour inside (the foot)
    mask = np.zeros_like(gray)
    cv2.drawContours(mask, [paper_contour], -1, 255, -1)
    masked = cv2.bitwise_and(gray, gray, mask=mask)
    foot_contours, _ = cv2.findContours(masked, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    foot_contour = None
    max_foot_area = 0
    for cnt in foot_contours:
        area = cv2.contourArea(cnt)
        if area > max_foot_area and area < max_area * 0.9:  # Ignore the paper itself
            foot_contour = cnt
            max_foot_area = area

    if foot_contour is None:
        os.remove(img_path)
        return jsonify({'error': 'Could not detect foot in the image'}), 400

    # Get foot length (max distance between two points on the contour)
    foot_pts = foot_contour.reshape(-1, 2)
    max_dist = 0
    for i in range(len(foot_pts)):
        for j in range(i + 1, len(foot_pts)):
            dist = np.linalg.norm(foot_pts[i] - foot_pts[j])
            if dist > max_dist:
                max_dist = dist
    foot_length_mm = max_dist / px_per_mm

    os.remove(img_path)
    return jsonify({
        'foot_length_mm': round(foot_length_mm, 1),
        'paper_type': paper_type
        # TODO: Add girth/side photo support
    })

if __name__ == '__main__':
    app.run(debug=True) 