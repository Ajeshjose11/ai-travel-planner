from __future__ import annotations

from pathlib import Path



_PROMPTS_DIR = Path(__file__).resolve().parent


def load_prompt(name: str) -> str:
    """
    Load a prompt template file from `app/prompts/`.

    Expected usage:
      template = load_prompt("itinerary_prompt.txt")
      prompt = template.format(destination="Paris", style="Foodie")
    """
    path = (_PROMPTS_DIR / name).resolve()
    if not path.exists():
        raise FileNotFoundError(f"Prompt file not found: {path}")
    return path.read_text(encoding="utf-8")

