
import json
import re
from typing import Optional

import google.generativeai as genai

from app.core.config import settings
from app.prompts.prompt_loader import load_prompt

genai.configure(api_key=settings.GOOGLE_API_KEY)

def _pick_fallback_model() -> Optional[str]:
    """
    Pick the first available model that supports `generateContent`.
    Returns a model id accepted by `genai.GenerativeModel(...)` or None.
    """
    try:
        for m in genai.list_models():
            # In google-generativeai, models are named like "models/gemini-..."
            # and expose supported_generation_methods.
            if "generateContent" in getattr(m, "supported_generation_methods", []):
                return getattr(m, "name", None)
    except Exception:
        # If listing fails (network/auth), let the caller raise the original error.
        return None
    return None

def _normalize_model_name(model_name: str) -> str:
    """
    Accept either "gemini-..." or "models/gemini-..." and normalize.
    The SDK typically accepts both; we keep it predictable and explicit.
    """
    model_name = (model_name or "").strip()
    if not model_name:
        return settings.GEMINI_MODEL
    return model_name


def _fallback_model_name() -> str:
    """
    Return the configured fallback model (kept in env for easy switching).
    """
    return _normalize_model_name(getattr(settings, "GEMINI_FALLBACK_MODEL", "").strip() or "gemini-2.0-flash-lite")

def generate_itinerary(destination: str, style: str) -> dict:
    """
    Calls the Gemini API to generate a 3-day travel itinerary.
    Returns a parsed dict or raises ValueError on bad JSON.
    """
    # EXPLAIN: Avoid printing secrets. `Settings` already prints a masked key.
    
    try:
        model_name = _normalize_model_name(settings.GEMINI_MODEL)
        fallback_name = _fallback_model_name()
        model = genai.GenerativeModel(model_name)

        # EXPLAIN: Keep the prompt in a separate file for easier debugging and
        # iteration. This also keeps service code small and focused.
        template = load_prompt("itinerary_prompt.txt")
        prompt = template.format(destination=destination, style=style)

        def _call_model(p: str, current_model: str, is_fallback: bool = False):
            try:
                if is_fallback:
                    print(f"DEBUG: Using fallback model: {current_model}")
                else:
                    print(f"DEBUG: Using primary model: {current_model}")
                return genai.GenerativeModel(current_model).generate_content(p)
            except Exception as e:
                return e

        # EXPLAIN: Gemini can occasionally return non-JSON or truncated JSON.
        # We retry once with a stricter "JSON only" reminder if parsing fails.
        response_or_exc = _call_model(prompt, model_name)
        
        if isinstance(response_or_exc, Exception):
            print(f"WARNING: Primary model failed ({model_name}): {str(response_or_exc)}")
            
            # EXPLAIN: If primary fails for any reason (incl. quota), try fallback.
            if fallback_name and fallback_name != model_name:
                print(f"INFO: Switching to fallback model: {fallback_name}")
                response_or_exc2 = _call_model(prompt, fallback_name, is_fallback=True)
                
                if not isinstance(response_or_exc2, Exception):
                    response = response_or_exc2
                    raw_text = (response.text or "").strip()
                    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
                    raw_text = re.sub(r"\s*```$", "", raw_text)
                    return json.loads(raw_text)
                else:
                    print(f"ERROR: Fallback model also failed ({fallback_name}): {str(response_or_exc2)}")
                    raise response_or_exc2

            # If no fallback or fallback also failed, check for 404 (retired model)
            e = response_or_exc
            msg = str(e)
            is_model_404 = ("is not found for API version" in msg) or ("not found" in msg and "models/" in msg)
            if is_model_404:
                fallback_discovered = _pick_fallback_model()
                if fallback_discovered and fallback_discovered != model_name:
                    print(f"WARNING: Model '{model_name}' unavailable. Falling back to discovered '{fallback_discovered}'.")
                    response = genai.GenerativeModel(fallback_discovered).generate_content(prompt)
                else:
                    raise e
            else:
                raise e
        else:
            response = response_or_exc

        raw_text = response.text.strip()

        # Strip markdown code fences if Gemini wraps output anyway
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)

        try:
            parsed = json.loads(raw_text)
        except json.JSONDecodeError:
            stricter = (
                prompt
                + "\n\nFINAL REMINDER: Output MUST be ONLY valid JSON matching the schema. No extra text."
            )
            response2 = model.generate_content(stricter)
            raw_text2 = (response2.text or "").strip()
            raw_text2 = re.sub(r"^```(?:json)?\s*", "", raw_text2)
            raw_text2 = re.sub(r"\s*```$", "", raw_text2)
            parsed = json.loads(raw_text2)

        # EXPLAIN: Minimal style compliance check. If the plan doesn't match the
        # chosen style strongly enough, regenerate once with stricter constraints.
        def _is_style_compliant(data: dict) -> bool:
            days = data.get("days") or []
            if not days:
                return False
            s = (style or "").strip().lower()
            for d in days:
                stops = d.get("stops") or []
                if not stops:
                    return False
                cats = [str(x.get("category") or "").lower() for x in stops]
                if s == "foodie":
                    foodish = sum(c in ("food", "market") for c in cats)
                    if foodish / max(len(cats), 1) < 0.65:
                        return False
                if s == "relaxation":
                    relaxish = sum(c in ("nature", "viewpoint", "neighborhood", "activity", "food") for c in cats)
                    # Relaxation can include cafés/food, but should avoid "museum-heavy" days.
                    museumish = sum(c == "museum" for c in cats)
                    if relaxish / max(len(cats), 1) < 0.70 or museumish > 1:
                        return False
            return True

        if not _is_style_compliant(parsed):
            stricter_style = (
                prompt
                + "\n\nSTRICT STYLE MODE:\n"
                + f'- You MUST optimize the itinerary ONLY for the "{style}" style.\n'
                + '- If style is Foodie: at least 70% of stops MUST be category Food or Market. Avoid museums/landmarks unless they are directly food-related.\n'
                + '- If style is Relaxation: prioritize Nature, scenic cafés, parks, slow pacing. Avoid packed schedules and avoid museum-heavy days.\n'
                + "Return ONLY JSON."
            )
            response3 = model.generate_content(stricter_style)
            raw_text3 = (response3.text or "").strip()
            raw_text3 = re.sub(r"^```(?:json)?\s*", "", raw_text3)
            raw_text3 = re.sub(r"\s*```$", "", raw_text3)
            parsed = json.loads(raw_text3)

        return parsed
    except Exception as e:
        print(f"ERROR in Gemini Service: {str(e)}")
        if "API_KEY_INVALID" in str(e):
            print("CAUSE: The API key provided is not valid for Gemini API.")
        # Provide a more actionable error upstream.
        if "is not found for API version" in str(e):
            raise RuntimeError(
                f"Configured Gemini model '{settings.GEMINI_MODEL}' is not available for this API key. "
                "Set GEMINI_MODEL in your backend .env to a supported model (for example: gemini-2.5-flash)."
            ) from e
        raise
