# test_image_classifier.py
from app.image_classifier import classify_screenshot

# Replace with the actual path to one of your saved screenshots.
image_path = "static/screenshots/your_screenshot_filename.png"
label = classify_screenshot(image_path)
print(f"Predicted label: {label}")
