
# app/analyzer/nlp_utils.py
from transformers import pipeline

# Initialize the summarizer pipeline with a pre-trained model.
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_anomalies(anomalies: list) -> str:
    text = " ".join(anomaly["message"] for anomaly in anomalies if "message" in anomaly)
    if not text:
        return "No significant anomalies found."
    # Adjust max_length if text is short
    input_length = len(text.split())
    max_length = 100 if input_length > 50 else 12  # Example logic
    summary = summarizer(text, max_length=max_length, min_length=5, do_sample=False)
    return summary[0]["summary_text"]

