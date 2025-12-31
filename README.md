# Healthcare Consultation Summary Generator

AI-powered SaaS application that generates consultation summaries, next steps, and patient email drafts from visit notes.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Clerk account
- OpenAI API key

### Installation

# Install frontend dependencies
npm install

# Install backend dependencies
cd api
pip install -r requirements.txt### Environment Variables

Create `.env.local`:nv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
CLERK_JWKS_URL=your_jwks_url
OPENAI_API_KEY=your_openai_key### Run Locally
h
# Frontend (port 3000)
npm run dev

# Backend (port 8000)
cd api
uvicorn server:app --reload## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python
- **Auth:** Clerk
- **AI:** OpenAI GPT

## Deployment

Build Docker image and deploy to AWS App Runner. Health check endpoint: `/health`

---

**Note:** This README is a starting point. Please update it as the project evolves!