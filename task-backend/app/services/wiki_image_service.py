from __future__ import annotations

import json
import urllib.parse
import urllib.request
from typing import Optional, Dict, Any



WIKIPEDIA_API = "https://en.wikipedia.org/w/api.php"
OPENVERSE_API = "https://api.openverse.engineering/v1/images"


def _http_get_json(url: str, timeout_s: int = 8) -> Dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={
            # Identify ourselves politely; some public APIs are stricter without UA.
            "User-Agent": "MathewVoyages/1.0 (travel-itinerary-demo)",
            "Accept": "application/json",
        },
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=timeout_s) as resp:  # nosec B310
        data = resp.read().decode("utf-8", errors="replace")
    return json.loads(data)


def _search_top_title(query: str) -> Optional[str]:
    if not query or not query.strip():
        return None

    params = {
        "action": "query",
        "format": "json",
        "list": "search",
        "srlimit": "1",
        "srsearch": query.strip(),
    }
    url = f"{WIKIPEDIA_API}?{urllib.parse.urlencode(params)}"
    payload = _http_get_json(url)
    results = (payload.get("query", {}).get("search") or [])
    if not results:
        return None
    return results[0].get("title")


def get_wikipedia_place_image(place_query: str) -> Optional[Dict[str, str]]:
    """
    Return a dict with `image_url`, `source`, `page_url` for a place query.
    If no image is available, returns None.
    """
    title = _search_top_title(place_query)
    if not title:
        return None

    params = {
        "action": "query",
        "format": "json",
        "prop": "pageimages|info",
        "inprop": "url",
        "titles": title,
        "pithumbsize": "900",
        "pilicense": "any",
    }
    url = f"{WIKIPEDIA_API}?{urllib.parse.urlencode(params)}"
    payload = _http_get_json(url)

    pages = (payload.get("query", {}).get("pages") or {})
    # pages is keyed by pageid; pick first.
    page = next(iter(pages.values()), None)
    if not page:
        return None

    thumb = (page.get("thumbnail") or {}).get("source")
    full_url = page.get("fullurl")
    if not thumb:
        return None

    return {
        "image_url": thumb,
        "source": "Wikipedia",
        "page_url": full_url or "",
    }


def _openverse_best_image(place_query: str) -> Optional[Dict[str, str]]:
    """
    Openverse provides a free image search API (CC-licensed results).
    We use it only as a fallback when Wikipedia doesn't have a thumbnail.
    """
    q = (place_query or "").strip()
    if not q:
        return None

    params = {
        "q": q,
        "page_size": "1",
        # Prefer permissive licenses and smaller legal friction for demos.
        "license": "cc0,pdm,by,by-sa",
        "mature": "false",
    }
    url = f"{OPENVERSE_API}?{urllib.parse.urlencode(params)}"
    payload = _http_get_json(url, timeout_s=10)
    results = payload.get("results") or []
    if not results:
        return None

    r0 = results[0] or {}
    thumb = r0.get("thumbnail") or r0.get("url")
    landing = r0.get("foreign_landing_url") or r0.get("url") or ""
    if not thumb:
        return None

    return {
        "image_url": thumb,
        "source": "Openverse",
        "page_url": landing,
    }


def get_place_image(place_query: str) -> Optional[Dict[str, str]]:
    """
    Best-effort real image lookup for a place.
    Order: Wikipedia → Openverse.
    """
    img = get_wikipedia_place_image(place_query)
    if img:
        return img
    return _openverse_best_image(place_query)

