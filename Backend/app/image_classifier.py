# app/image_classifier.py
from transformers import ViTForImageClassification, ViTFeatureExtractor
from PIL import Image
import torch

model_name = "google/vit-base-patch16-224"
feature_extractor = ViTFeatureExtractor.from_pretrained(model_name)
model = ViTForImageClassification.from_pretrained(model_name)

def classify_screenshot(image_path: str) -> str:
    # Open the image
    image = Image.open(image_path)
    
    # Ensure image is in RGB mode
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Preprocess the image for the model
    inputs = feature_extractor(images=image, return_tensors="pt")
    
    # Run inference without gradient calculation
    with torch.no_grad():
        outputs = model(**inputs)
    
    logits = outputs.logits
    predicted_class_idx = logits.argmax(-1).item()

    confidence = torch.softmax(logits, dim=1)[0][predicted_class_idx].item()
    label = model.config.id2label[predicted_class_idx]
    
    # Return the human-readable label for the predicted class
    return {"label": label, "confidence": confidence}
