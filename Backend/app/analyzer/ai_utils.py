# app/analyzer/ai_utils.py

import logging
from typing import Dict, List

from app.genai.ai_assistant import AIAssistant

logger = logging.getLogger(__name__)

# Initialize the assistant as before.
assistant = AIAssistant(model_name="google/flan-t5-base") 

def gen_anomaly_summary(anomalies: List[Dict]) -> str:
    """
    Calls the assistant's summarize_anomalies method directly.
    """
    try:
        return assistant.summarize_anomalies(anomalies)
    except Exception as e:
        logger.error(f"Error in gen_anomaly_summary: {e}")
        return "Could not generate AI summary."


def gen_fix_snippet(anomaly: Dict) -> str:
    """
    Calls the assistant's generate_fix_suggestion method directly,
    passing the anomaly dictionary as expected.
    """
    try:
        return assistant.generate_fix_suggestion(anomaly)
    except Exception as e:
        logger.error(f"Error in gen_fix_snippet: {e}")
        # Provide a safe fallback using the rule-based recommendation
        return anomaly.get("recommendation", "Review best practices to address this issue.")
