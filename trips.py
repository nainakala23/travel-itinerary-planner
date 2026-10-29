from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models import Itinerary, TripCreateRequest
from app.supabase_client import storage
from app.ai_service import ai_service
import datetime

router = APIRouter(prefix="/trips", tags=["trips"])

@router.get("", response_model=List[Dict[str, Any]])
def list_trips():
    return storage.list_itineraries()

@router.get("/presets")
def get_scenario_presets():
    """
    Returns ready-to-test preset configurations matching the three user scenarios.
    """
    today = datetime.date.today()
    d1 = (today + datetime.timedelta(days=7)).strftime("%Y-%m-%d")
    d2 = (today + datetime.timedelta(days=9)).strftime("%Y-%m-%d")
    d3 = (today + datetime.timedelta(days=13)).strftime("%Y-%m-%d")
    d4 = (today + datetime.timedelta(days=14)).strftime("%Y-%m-%d")

    return [
        {
            "id": "scenario-1-solo",
            "title": "Scenario 1: Solo Traveler Weekend Getaway",
            "tag": "Solo Traveler",
            "destination": "Paris",
            "start_date": d1,
            "end_date": d2,
            "traveler_type": "solo",
            "group_size": 1,
            "budget_tier": "budget",
            "pace": "fast-paced",
            "interests": ["Sightseeing", "Food & Dining", "Photography"],
            "description": "Short weekend trip optimizing transit time, featuring top iconic highlights and affordable local dining.",
            "total_budget_limit": 600.0
        },
        {
            "id": "scenario-2-couple",
            "title": "Scenario 2: Romantic Couple Vacation",
            "tag": "Couple / Romance",
            "destination": "Paris",
            "start_date": d1,
            "end_date": d3,
            "traveler_type": "couple",
            "group_size": 2,
            "budget_tier": "luxury",
            "pace": "relaxed",
            "interests": ["Romance", "Food & Dining", "Culture & History", "Scenic Views"],
            "description": "Intimate vacation with relaxed pacing, scenic viewpoints, curated Michelin-star dining, and luxury stays.",
            "total_budget_limit": 3200.0
        },
        {
            "id": "scenario-3-group",
            "title": "Scenario 3: Small Group Multi-Day Expedition",
            "tag": "Small Group",
            "destination": "Tokyo",
            "start_date": d1,
            "end_date": d4,
            "traveler_type": "group",
            "group_size": 4,
            "budget_tier": "moderate",
            "pace": "moderate",
            "interests": ["Adventure", "Culture & History", "Nightlife", "Street Food"],
            "description": "Friends multi-day trip balancing diverse interests, shared accommodations, and group logistics.",
            "total_budget_limit": 4800.0
        }
    ]

@router.get("/{trip_id}")
def get_trip(trip_id: str):
    trip = storage.get_itinerary(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return trip

@router.post("", response_model=Dict[str, Any])
def save_trip(itinerary: Itinerary):
    saved = storage.save_itinerary(itinerary.model_dump())
    return saved

@router.put("/{trip_id}", response_model=Dict[str, Any])
def update_trip(trip_id: str, itinerary: Itinerary):
    data = itinerary.model_dump()
    data["id"] = trip_id
    saved = storage.save_itinerary(data)
    return saved

@router.delete("/{trip_id}")
def delete_trip(trip_id: str):
    success = storage.delete_itinerary(trip_id)
    if not success:
        raise HTTPException(status_code=404, detail="Itinerary not found")
    return {"status": "success", "deleted_id": trip_id}

