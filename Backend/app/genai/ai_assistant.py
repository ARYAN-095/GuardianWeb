# app/genai/ai_assistant.py

import httpx
import json
from dotenv import load_dotenv
import os
from typing import List, Dict

# It's a good practice to get the API key from an environment variable.
# For this example, we will leave it blank as it will be handled by the environment.
load_dotenv()

API_KEY = os.environ.get("GEMINI_API_KEY", "") 
if not API_KEY:
    raise ValueError("❌ GEMINI_API_KEY not found. Did you set it in .env?")

class AIAssistant:
    """
    An assistant that uses the powerful, cloud-based Gemini API to generate
    high-quality text for summaries and recommendations.
    """
    def __init__(self, model_name="gemini-2.5-flash-preview-05-20"):
        self.model_name = model_name
        self.api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={API_KEY}"

    async def _generate_response(self, prompt: str) -> str:
        """
        A helper function to send a prompt to the Gemini API and get a response.
        This is now an async function to work well with FastAPI.
        """
        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.api_url, json=payload, timeout=30.0)
                response.raise_for_status()  # Raise an exception for bad status codes (4xx or 5xx)
                
                result = response.json()
                
                # Safely navigate the response structure to get the text
                candidates = result.get("candidates", [])
                if candidates and "content" in candidates[0] and "parts" in candidates[0]["content"]:
                    parts = candidates[0]["content"]["parts"]
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
                
                # If the expected structure is not found, return a diagnostic message
                return f"Unexpected API response format: {json.dumps(result)}"

            except httpx.HTTPStatusError as e:
                return f"API request failed with status {e.response.status_code}: {e.response.text}"
            except Exception as e:
                return f"An unexpected error occurred: {str(e)}"

    async def generate_fix_suggestion(self, anomaly: Dict) -> str:
        """
        Generates a recommendation using a prompt optimized for the Gemini API.
        """
        try:
            prompt = (
                f"You are a web security expert. A website audit found this issue: "
                f"\"{anomaly.get('message', 'N/A')}\". "
                f"Provide a concise, one-sentence recommendation for how to fix it."
            )
            return await self._generate_response(prompt)
        except Exception as e:
            return f"Unable to generate fix: {str(e)}"

    async def summarize_anomalies(self, anomalies: List[Dict]) -> str:
        """
        Generates a summary using a prompt optimized for the Gemini API.
        """
        try:
            if not anomalies:
                return "No significant anomalies were detected."

            issue_list = "\n".join(
                f"- {a['message']}" for a in anomalies if 'message' in a
            )
            
            prompt = (
                "Summarize the following website health issues in one helpful sentence:\n"
                f"{issue_list}"
            )
            
            return await self._generate_response(prompt)
        except Exception as e:
            return f"Summary generation failed: {str(e)}"

