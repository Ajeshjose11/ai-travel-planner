from pydantic import BaseModel
from typing import List, Optional

class ItineraryRequest(BaseModel):
    destination: str
    style: str


# EXPLAIN: We return a structured itinerary (instead of freeform strings) so the
# UI can render a timeline, show images per stop, and stay consistent across
# destinations/styles.
# EXPLAIN: Use plain strings (not strict Literals) so the API doesn't crash if
# the model returns slight variations like "Late afternoon" vs "Late Afternoon".
# The prompt still strongly constrains the allowed values; this just improves
# runtime reliability (no more 500s from response validation).
StopTime = str
StopCategory = str


class StopImage(BaseModel):
    image_url: str
    source: str
    page_url: Optional[str] = None


class DayStop(BaseModel):
    time: StopTime
    place_name: str
    place_query: str
    category: StopCategory
    duration_minutes: int
    details: str
    pro_tip: str
    image: Optional[StopImage] = None


class DayPlan(BaseModel):
    day: int
    title: str
    area_focus: str
    summary: str
    stops: List[DayStop]
    must_try_foods: List[str]
    logistics: List[str]

class ItineraryResponse(BaseModel):
    days: List[DayPlan]

class ErrorResponse(BaseModel):
    error: str
