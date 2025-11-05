import os
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from google import genai

app = FastAPI()

@app.get("/api", response_class=StreamingResponse)
def idea():
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    prompt = "Reply with a new business idea for AI Agents, formatted with headings, sub-headings and bullet points"


    def event_stream():
        for chunk in client.models.generate_content_stream(
            model="gemini-2.5-flash",
            contents=prompt,
        ):
            text = getattr(chunk, "text", None)
            if not text:
                continue
            for line in text.splitlines():
                yield f"data: {line}\n"
            yield "\n"


    return StreamingResponse(event_stream(), media_type="text/event-stream")