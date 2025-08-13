# app/genai/ai_assistant.py

from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch
from typing import List, Dict

class AIAssistant:
    def __init__(self, model_name="google/flan-t5-base"):  # Using 'base' for better quality
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = T5Tokenizer.from_pretrained(model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(model_name).to(self.device)

    def generate_fix_suggestion(self, anomaly: Dict) -> str:
        """
        Generates a high-quality, actionable recommendation for a single anomaly
        by creating a detailed and explicit prompt for the AI model.
        """
        try:
            # Create a detailed, structured prompt for the AI.
            prompt = (
                "You are a web security expert providing a recommendation. "
                f"An audit found an issue with type '{anomaly.get('type', 'N/A')}' "
                f"and severity '{anomaly.get('severity', 'N/A')}'. "
                f"The issue is: \"{anomaly.get('message', 'N/A')}\". "
                "Provide a single, concise sentence explaining how to fix this."
            )
            
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids.to(self.device)
            # Adjust max_length for a concise recommendation
            output_ids = self.model.generate(input_ids, max_length=100, num_beams=4, early_stopping=True)
            
            return self.tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
        except Exception as e:
            return f"Unable to generate fix: {str(e)}"

    def summarize_anomalies(self, anomalies: List[Dict]) -> str:
        """
        Generates a high-level summary for a list of anomalies using an improved prompt.
        """
        try:
            if not anomalies:
                return "No significant anomalies were detected."

            # Create a clear summary of the issues to feed to the model
            issue_descriptions = ". ".join(
                [f"{a['message']}" for a in anomalies if 'message' in a]
            )
            
            prompt = (
                "Summarize the following website health issues in one clear and helpful sentence: "
                f"\"{issue_descriptions}\""
            )
            
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids.to(self.device)
            output_ids = self.model.generate(input_ids, max_length=150, num_beams=4, early_stopping=True)
            
            return self.tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
        except Exception as e:
            return f"Summary generation failed: {str(e)}"

