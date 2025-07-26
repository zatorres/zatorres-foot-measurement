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

def detect_paper_robust(img):
    """Improved paper detection that handles floor scenarios better"""
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply multiple preprocessing steps
    # 1. Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # 2. Adaptive thresholding to handle varying lighting
    adaptive_thresh = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    
    # 3. Canny edge detection with different parameters
    edges1 = cv2.Canny(blurred, 30, 100)  # More sensitive
    edges2 = cv2.Canny(blurred, 50, 150)  # Standard
    edges3 = cv2.Canny(blurred, 100, 200)  # Less sensitive
    
    # Combine edge detections
    edges = cv2.bitwise_or(edges1, edges2)
    edges = cv2.bitwise_or(edges, edges3)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Score each potential paper candidate
    paper_candidates = []
    
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < 1000:  # Too small
            continue
            
        # Approximate the contour to a polygon
        peri = cv2.arcLength(cnt, True)
        approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
        
        # Check if it's roughly rectangular (4-6 sides)
        if len(approx) < 4 or len(approx) > 6:
            continue
            
        # Get bounding rectangle
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = w / h if h > 0 else 0
        
        # Paper should have reasonable aspect ratio (A4 is ~0.71, Letter is ~0.77)
        if not (0.5 <= aspect_ratio <= 1.2):
            continue
            
        # Calculate how rectangular the shape is
        rect_area = w * h
        extent = area / rect_area if rect_area > 0 else 0
        
        # Good rectangles have high extent (close to 1.0)
        if extent < 0.7:
            continue
            
        # Calculate score based on multiple factors
        score = (extent * 0.4 +  # How rectangular
                 (area / (img.shape[0] * img.shape[1])) * 0.3 +  # Size relative to image
                 (1.0 - abs(aspect_ratio - 0.71)) * 0.3)  # How close to A4 ratio
        
        paper_candidates.append({
            'contour': approx,
            'score': score,
            'area': area,
            'aspect_ratio': aspect_ratio,
            'extent': extent,
            'bbox': (x, y, w, h)
        })
    
    # Sort by score and return the best
    if paper_candidates:
        paper_candidates.sort(key=lambda x: x['score'], reverse=True)
        return paper_candidates[0]['contour'], paper_candidates[0]
    
    return None, None

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
    
    # Skin color ranges in HSV (more inclusive)
    skin_lower = np.array([0, 10, 60])
    skin_upper = np.array([25, 255, 255])
    
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
    
    # More lenient size validation
    if area < paper_area * 0.02 or area > paper_area * 0.9:
        return 0
    
    # More lenient aspect ratio analysis
    aspect_ratio = w / h if h > 0 else 0
    if not (0.1 <= aspect_ratio <= 0.8):  # More inclusive range
        return 0
    
    # More lenient size validation
    foot_length_px = h
    if not (100 <= foot_length_px <= 500):  # More inclusive range
        return 0
    
    # Color analysis (skin detection)
    skin_ratio = analyze_colors(img, contour)
    color_score = min(skin_ratio * 1.5, 1.0)  # Less strict skin detection
    
    # Edge pattern analysis
    edge_score = detect_foot_edges(contour, img)
    edge_score = min(edge_score * 5, 1.0)  # Less strict edge detection
    
    # Shape complexity (feet have moderate complexity)
    perimeter = cv2.arcLength(contour, True)
    shape_complexity = perimeter / np.sqrt(area) if area > 0 else 0
    complexity_score = 1.0 if 2 <= shape_complexity <= 10 else 0.5  # More inclusive
    
    # Position analysis (foot should be roughly centered on paper)
    paper_center_x = img.shape[1] / 2
    paper_center_y = img.shape[0] / 2
    contour_center_x = x + w/2
    contour_center_y = y + h/2
    
    distance_from_center = np.sqrt((contour_center_x - paper_center_x)**2 + 
                                  (contour_center_y - paper_center_y)**2)
    max_distance = np.sqrt(img.shape[0]**2 + img.shape[1]**2) / 2
    position_score = 1.0 - (distance_from_center / max_distance)
    
    # Combined confidence score (less strict)
    confidence = (color_score * 0.25 + 
                 edge_score * 0.25 + 
                 complexity_score * 0.25 + 
                 position_score * 0.25)
    
    return confidence

def detect_foot_length(img, paper_contour, px_per_mm):
    """Advanced foot detection with debugging and less strict validation"""
    
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
    debug_info = []
    
    for i, cnt in enumerate(contours):
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = w / h if h > 0 else 0
        
        # Basic filtering
        if area < paper_area * 0.01:  # Very small contours
            continue
            
        confidence = calculate_foot_confidence(cnt, img, paper_area)
        
        debug_info.append({
            'contour_id': i,
            'area': area,
            'area_ratio': area / paper_area,
            'aspect_ratio': aspect_ratio,
            'width_px': w,
            'height_px': h,
            'confidence': confidence
        })
        
        if confidence > 0.1:  # Much lower threshold for testing
            candidates.append((cnt, confidence))
    
    if not candidates:
        # Return debug info for troubleshooting
        return None, f"Could not detect a foot-like shape. Debug info: {debug_info[:5]}"  # Show first 5 contours
    
    # Sort by confidence and pick the best
    candidates.sort(key=lambda x: x[1], reverse=True)
    best_contour, confidence = candidates[0]
    
    # Get measurements using bounding rectangle (works at any angle)
    x, y, w, h = cv2.boundingRect(best_contour)
    
    # Convert to mm
    foot_length_mm = h / px_per_mm
    foot_width_mm = w / px_per_mm
    
    # More lenient measurement validation
    if foot_length_mm < 100 or foot_length_mm > 400:
        return None, f"Detected foot length ({foot_length_mm}mm) seems unrealistic. Debug: {debug_info[:3]}"
    
    if foot_width_mm < 30 or foot_width_mm > 200:
        return None, f"Detected foot width ({foot_width_mm}mm) seems unrealistic. Debug: {debug_info[:3]}"
    
    return {
        'length_mm': round(foot_length_mm, 1),
        'width_mm': round(foot_width_mm, 1),
        'confidence': round(confidence, 2),
        'contour': best_contour,
        'debug_info': debug_info[:3]  # Include debug info
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

    # Use improved paper detection
    paper_contour, paper_info = detect_paper_robust(img)
    
    if paper_contour is None:
        os.remove(img_path)
        return jsonify({
            'error': 'Could not detect paper in the image. Please ensure: 1) Paper is clearly visible, 2) Good lighting, 3) Paper edges are distinct from floor, 4) Camera is roughly parallel to paper',
            'paper_detection_debug': 'No paper candidates found'
        }), 400

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
    confidence_level = 'high' if foot_data['confidence'] > 0.6 else 'medium' if foot_data['confidence'] > 0.3 else 'low'
    
    return jsonify({
        'foot_length_mm': foot_data['length_mm'],
        'foot_width_mm': foot_data['width_mm'],
        'paper_type': paper_type,
        'detection_confidence': confidence_level,
        'confidence_score': foot_data['confidence'],
        'paper_detection_score': paper_info['score'] if paper_info else 0,
        'debug_info': foot_data.get('debug_info', []),
        'message': f"Successfully detected foot: {foot_data['length_mm']}mm length, {foot_data['width_mm']}mm width"
    })

if __name__ == '__main__':
    app.run(debug=True) 