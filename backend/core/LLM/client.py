from google import genai
from google.genai import types

from src.cfgs import get_default

class LLMClient:
    def __init__(self):
        self.client = genai.Client(api_key=get_default("GOOGLE_API_KEY"))
        self.model = "gemini-2.5-flash"
    
    def generate_content(self, content: list):
        response = self.client.models.generate_content(
            model=self.model, 
            contents=content,
            config= types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        return response