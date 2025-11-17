import os
from fastapi import FastAPI, Depends
from fastapi.responses import StreamingResponse
from google import genai
from pydantic import BaseModel 
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials  # type: ignore

app = FastAPI()

clerk_config = ClerkConfig(jwks_url=os.environ.get("CLERK_JWKS_URL"))
clerk_guard = ClerkHTTPBearer(clerk_config)

class Visit(BaseModel):
    patient_name: str
    date_of_visit: str
    notes: str

system_prompt = """
You are provided with notes written by a doctor from a patient's visit.
Your job is to summarize the visit for the doctor and provide an email.
Reply with exactly three sections with the headings:
### Summary of visit for the doctor's records
### Next steps for the doctor
### Draft of email to patient in patient-friendly language
"""

def user_prompt_for(visit: Visit) -> str:
    return f"""Create the summary, next steps and draft email for:
Patient Name: {visit.patient_name}
Date of Visit: {visit.date_of_visit}
Notes: {visit.notes}"""


@app.post("/api", response_class=StreamingResponse)
def consultation_summary(
    visit: Visit,
    creds: HTTPAuthorizationCredentials = Depends(clerk_guard),
    ):
    user_id = creds.decoded["sub"]


    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    user_prompt = user_prompt_for(visit)
    prompt = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt},
    ]


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
            "X-Accel-Buffering": "no",
        },
    )