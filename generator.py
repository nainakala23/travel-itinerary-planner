from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models import TripCreateRequest, Itinerary, DayPlan, RegenerateDayRequest
from app.ai_service import ai_service
from app.supabase_client import storage

router = APIRouter(prefix="", tags=["generator"])

@router.post("/generate", response_model=Itinerary)
def generate_itinerary(req: TripCreateRequest):
    itinerary = ai_service.generate_itinerary(req)
    # Automatically save generated trip so user can view/retrieve it
    storage.save_itinerary(itinerary.model_dump())
    return itinerary

@router.post("/regenerate-day", response_model=Itinerary)
def regenerate_day(req: RegenerateDayRequest):
    trip_dict = storage.get_itinerary(req.trip_id)
    if not trip_dict:
        raise HTTPException(status_code=404, detail="Trip not found")

    trip = Itinerary(**trip_dict)
    new_day = ai_service.regenerate_day(trip, req.day_number, req.preferences_override)

    # Replace day in itinerary
    for i, d in enumerate(trip.days):
        if d.day_number == req.day_number:
            trip.days[i] = new_day
            break

    # Recompute costs
    people_count = trip.group_size if trip.group_size > 0 else (2 if trip.traveler_type == "couple" else 1)
    total_acts = sum(
        sum(a.estimated_cost for a in (d.morning + d.afternoon + d.evening)) * people_count
        for d in trip.days
    )
    trip.cost_breakdown.activities = round(total_acts, 2)
    trip.cost_breakdown.total = round(
        trip.cost_breakdown.accommodations + trip.cost_breakdown.dining + trip.cost_breakdown.activities + trip.cost_breakdown.local_transit,
        2
    )

    storage.save_itinerary(trip.model_dump())
    return trip

