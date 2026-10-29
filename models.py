from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class Activity(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    time_slot: str  # "morning", "afternoon", "evening"
    title: str
    description: str
    location: str
    category: str = "sightseeing"  # sightseeing, dining, culture, adventure, leisure, nightlife, relaxation
    estimated_cost: float = 0.0
    duration_hours: float = 2.0
    travel_tip: Optional[str] = None

class DiningSpot(BaseModel):
    name: str
    cuisine: str
    price_range: str  # "$", "$$", "$$$", "$$$$"
    description: str
    recommended_dish: Optional[str] = None
    meal_type: str = "dinner"  # breakfast, lunch, dinner

class Accommodation(BaseModel):
    name: str
    type: str  # boutique hotel, luxury resort, cozy B&B, budget hostel, apartment
    neighborhood: str
    nightly_rate_est: float
    features: List[str] = []

class DayPlan(BaseModel):
    day_number: int
    date: str
    theme: str
    morning: List[Activity] = []
    afternoon: List[Activity] = []
    evening: List[Activity] = []
    dining_recommendations: List[DiningSpot] = []
    accommodation_suggestion: Optional[Accommodation] = None
    logistics_notes: Optional[str] = None
    estimated_daily_cost: float = 0.0

class CostBreakdown(BaseModel):
    accommodations: float = 0.0
    dining: float = 0.0
    activities: float = 0.0
    local_transit: float = 0.0
    total: float = 0.0
    currency: str = "USD"

class TripCreateRequest(BaseModel):
    destination: str
    start_date: str
    end_date: str
    traveler_type: str = "solo"  # solo, couple, group, family
    group_size: int = 1
    budget_tier: str = "moderate"  # budget, moderate, luxury
    total_budget_limit: Optional[float] = None
    pace: str = "moderate"  # relaxed, moderate, fast-paced
    interests: List[str] = []
    custom_notes: Optional[str] = None

class RegenerateDayRequest(BaseModel):
    trip_id: str
    day_number: int
    preferences_override: Optional[str] = None

class Itinerary(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    destination: str
    start_date: str
    end_date: str
    total_days: int
    traveler_type: str
    group_size: int
    budget_tier: str
    pace: str
    interests: List[str]
    days: List[DayPlan]
    cost_breakdown: CostBreakdown
    status: str = "saved"  # draft, saved, archived
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

