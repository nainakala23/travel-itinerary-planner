const API_BASE = '/api';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async listTrips() {
    const res = await fetch(`${API_BASE}/trips`);
    if (!res.ok) throw new Error('Failed to load trips');
    return res.json();
  },

  async getPresets() {
    const res = await fetch(`${API_BASE}/trips/presets`);
    if (!res.ok) throw new Error('Failed to fetch presets');
    return res.json();
  },

  async getTrip(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}`);
    if (!res.ok) throw new Error('Trip not found');
    return res.json();
  },

  async generateTrip(payload) {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate itinerary');
    }
    return res.json();
  },

  async regenerateDay(tripId, dayNumber, preferencesOverride = '') {
    const res = await fetch(`${API_BASE}/regenerate-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trip_id: tripId,
        day_number: dayNumber,
        preferences_override: preferencesOverride
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to regenerate day plan');
    }
    return res.json();
  },

  async saveTrip(itinerary) {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itinerary)
    });
    if (!res.ok) throw new Error('Failed to save itinerary');
    return res.json();
  },

  async updateTrip(tripId, itinerary) {
    const res = await fetch(`${API_BASE}/trips/${tripId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itinerary)
    });
    if (!res.ok) throw new Error('Failed to update itinerary');
    return res.json();
  },

  async deleteTrip(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete itinerary');
    return res.json();
  }
};

