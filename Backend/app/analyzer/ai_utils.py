# app/analyzer/ai_utils.py

from app.genai.ai_assistant import AIAssistant

assistant = AIAssistant(model_name="google/flan-t5-base")   

def gen_anomaly_summary(anomalies: list) -> str:
    return assistant.summarize_anomalies(anomalies)

def gen_fix_snippet(anomaly: dict) -> str:
    return assistant.generate_fix_suggestion(anomaly)
