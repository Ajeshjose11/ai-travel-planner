

import os
from dotenv import load_dotenv

# EXPLAIN: Load `.env` from common local/dev locations.
load_dotenv(".env")
load_dotenv("../.env")
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))

class Settings:
    # EXPLAIN: Credentials and runtime options are read from environment variables.
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    # Model names evolve over time. Prefer configuring via env var so deployments
    # can switch models without a code change.
    #
    # As of 2026, `gemini-1.5-flash` is commonly unavailable/retired for many keys,
    # which can trigger 404 errors like:
    #   "models/gemini-1.5-flash is not found for API version v1beta..."
    #
    # A reasonable default for the Gemini API is a current Flash model.
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    # EXPLAIN: Fallback model for reliability (often a "free"/cheaper tier).
    # If the primary model errors (quota, transient failures, retirement), we try this.
    GEMINI_FALLBACK_MODEL: str = os.getenv("GEMINI_FALLBACK_MODEL", "gemini-2.0-flash-lite")
    APP_TITLE: str = "AI Travel Planner"
    APP_VERSION: str = "1.0.0"
    # EXPLAIN: In local dev, CORS issues are the #1 cause of "Failed to fetch".
    # We default to permissive CORS for reliability.
    #
    # You can override with a comma-separated list, e.g.
    #   CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
    # Or allow all:
    #   CORS_ORIGINS=*
    _cors_raw: str = os.getenv("CORS_ORIGINS", "*")
    CORS_ORIGINS: list = ["*"] if _cors_raw.strip() == "*" else [o.strip() for o in _cors_raw.split(",") if o.strip()]

    def __init__(self):
        # EXPLAIN: Log a masked key in dev to confirm env loading without leaking secrets.
        if not self.GOOGLE_API_KEY:
            print("WARNING: GOOGLE_API_KEY not found in environment variables!")
        else:
            masked_key = self.GOOGLE_API_KEY[:4] + "..." + self.GOOGLE_API_KEY[-4:]
            print(f"GOOGLE_API_KEY loaded: {masked_key}")

settings = Settings()
