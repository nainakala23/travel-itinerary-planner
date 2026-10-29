import json
import os
from typing import List, Optional, Dict, Any
from app.config import settings
from app.models import Itinerary

TRIPS_FILE = os.path.join(settings.DATA_DIR, "trips.json")

class StorageService:
    def __init__(self):
        self.supabase_enabled = bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
        self._ensure_storage()

    def _ensure_storage(self):
        if not os.path.exists(TRIPS_FILE):
            with open(TRIPS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)

    def _read_local(self) -> List[Dict[str, Any]]:
        try:
            with open(TRIPS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_local(self, data: List[Dict[str, Any]]):
        with open(TRIPS_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def list_itineraries(self) -> List[Dict[str, Any]]:
        # In a full Supabase environment, query supabase.table('itineraries').select('*')
        return self._read_local()

    def get_itinerary(self, trip_id: str) -> Optional[Dict[str, Any]]:
        trips = self._read_local()
        for trip in trips:
            if trip.get("id") == trip_id:
                return trip
        return None

    def save_itinerary(self, itinerary_dict: Dict[str, Any]) -> Dict[str, Any]:
        trips = self._read_local()
        # check if exists
        updated = False
        for i, t in enumerate(trips):
            if t.get("id") == itinerary_dict.get("id"):
                trips[i] = itinerary_dict
                updated = True
                break
        if not updated:
            trips.insert(0, itinerary_dict)
        self._write_local(trips)
        return itinerary_dict

    def delete_itinerary(self, trip_id: str) -> bool:
        trips = self._read_local()
        initial_len = len(trips)
        trips = [t for t in trips if t.get("id") != trip_id]
        if len(trips) < initial_len:
            self._write_local(trips)
            return True
        return False

storage = StorageService()

