import os
from fastapi import FastAPI, Depends
from fastapi.responses import StreamingResponse
from google import genai
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials  # type: ignore

app = FastAPI()

clerk_config = ClerkConfig(jwks_url=os.environ.get("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

@app.get("/api", response_class=StreamingResponse)
def idea(creds: HTTPAuthorizationCredentials = Depends(clerk_guard)):
    user_id = creds.decoded["sub"]


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


    return StreamingResponse(
        event_stream(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )