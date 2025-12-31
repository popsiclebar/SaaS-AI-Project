# Healthcare Consultation Summary Generator

AI-powered SaaS application that generates consultation summaries, next steps, and patient email drafts from visit notes.

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Clerk account
- OpenAI API key

### Installation

#### Install frontend dependencies
npm install

#### Environment Variables
- Create `.env.local`
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
- CLERK_SECRET_KEY=your_secret
- CLERK_JWKS_URL=your_jwks_url
- OPENAI_API_KEY=your_openai_key

## Tech Stack
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** FastAPI, Python
- **Auth:** Clerk
- **AI:** OpenAI GPT

## Deployment

Build Docker image and deploy to AWS App Runner. Health check endpoint: `/health`

---

**Note:** This project is a starting point. Please update it as the project evolves!