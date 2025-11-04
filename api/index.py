import os
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from google import genai

app = FastAPI()

@app.get("/api", response_class=StreamingResponse)
def idea():
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    prompt = "Come up with one new business idea for AI agents, keep it short and concise."
    response = client.models.generate_content(
        model = "gemini-2.5-flash",
        contents = prompt,
        stream = True,
    )

    def event_stream():
        for chunk in response:
            text = chunk.text
            if text:
                lines = text.split("\n")
                for line in lines:
                    yield f"data: {line}\n"
                yield "\n"


    return StreamingResponse(event_stream(), media_type="text/event_stream")