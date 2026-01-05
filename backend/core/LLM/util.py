from google.genai import types

def content_analyzer_image(prompt: str, image: bytes) -> list:
    if image is None or prompt == "":
        raise ValueError("Image and prompt are required")
    
    content = [
        types.Part(text=prompt),
        types.Part.from_bytes(
            data=image,
            mime_type="image/jpeg"
        )
    ]
    return content