import os
from fastapi import FastAPI
from fastapi.responses import PlainTextResponse
from google import genai

app = FastAPI()

@app.get("/api", response_class=PlainTextResponse)
def idea():
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    prompt = "Come up with a new business idea for AI agents"
    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt,
    )
    return response.text