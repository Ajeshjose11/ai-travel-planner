

from fastapi import APIRouter, HTTPException

from app.models.itinerary_model import ItineraryRequest, ItineraryResponse, ErrorResponse
from app.services.gemini_service import generate_itinerary

router = APIRouter()

@router.post(
    "/generate-itinerary",
    response_model=ItineraryResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def create_itinerary(request: ItineraryRequest):
    """
    Accepts destination + style, returns a 3-day itinerary from Gemini.
    """
    if not request.destination.strip():
        raise HTTPException(status_code=422, detail="Destination cannot be empty")

    try:
        # EXPLAIN: The service returns a dict that matches `ItineraryResponse`.
        itinerary_data = generate_itinerary(request.destination, request.style)
        return itinerary_data
    except ValueError:
        return {"error": "Invalid JSON from AI"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
