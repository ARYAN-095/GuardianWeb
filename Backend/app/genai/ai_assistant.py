from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch


class AIAssistant:
    def __init__(self, model_name="google/flan-t5-small"):  # <- better default
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.tokenizer = T5Tokenizer.from_pretrained(model_name)
        self.model = T5ForConditionalGeneration.from_pretrained(model_name).to(self.device)

    def generate_fix_suggestion(self, anomaly: dict) -> str:
        try:
            required_keys = {"type", "message", "severity"}
            if not required_keys.issubset(anomaly.keys()):
                return "Invalid anomaly format."

            prompt = (
                f"fix: type={anomaly['type']}, "
                f"message={anomaly['message']}, "
                f"severity={anomaly['severity']}"
            )
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids.to(self.device)
            output_ids = self.model.generate(input_ids, max_length=80)
             
            return self.tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
        except Exception as e:
            return f"Unable to generate fix: {str(e)}"

    def summarize_anomalies(self, anomalies: list) -> str:
        try:
            if not anomalies:
                return "No anomalies detected."

            prompt = (
              "summarize the following website health issues in plain English:\n" +
               "\n".join(f"- {a['type']} issue: {a['message']}" for a in anomalies if 'type' in a and 'message' in a)
              )
            input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids.to(self.device)
            output_ids = self.model.generate(input_ids, max_length=150)
             
            return self.tokenizer.decode(output_ids[0], skip_special_tokens=True).strip()
            
        except Exception as e:
            return f"Summary failed: {str(e)}"
