

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.travel_controller import router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description="AI-powered travel itinerary generator using Gemini",
)

# EXPLAIN: CORS is required so the browser-based Next.js frontend can call the API.
# For local reliability, we allow `*` by default (see `Settings.CORS_ORIGINS`).
allow_all = "*" in (settings.CORS_ORIGINS or [])
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_all else settings.CORS_ORIGINS,
    allow_credentials=False if allow_all else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# EXPLAIN: Register API routes (controllers).
app.include_router(router)

@app.get("/")
async def health_check():
    # EXPLAIN: Lightweight endpoint for quickly verifying the API is running.
    return {"status": "ok", "message": "AI Travel Planner API is running"}
