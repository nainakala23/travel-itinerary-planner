import React, { useState } from 'react';
import { 
  Sparkles, Calendar, MapPin, Plus, Compass, Search, 
  Trash2, ArrowRight, DollarSign, Clock, Users, Shield, CheckCircle 
} from 'lucide-react';
import ScenarioCards from './ScenarioCards';

export default function Dashboard({ 
  trips, 
  onSelectTrip, 
  onDeleteTrip, 
  onOpenBuilder, 
  onSelectScenario,
  loadingPresetId 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter(trip => {
    const q = searchQuery.toLowerCase();
    return (
      (trip.destination && trip.destination.toLowerCase().includes(q)) ||
      (trip.title && trip.title.toLowerCase().includes(q)) ||
      (trip.traveler_type && trip.traveler_type.toLowerCase().includes(q))
    );
  });

  // Calculate SaaS dashboard statistics
  const totalTrips = trips.length;
  const totalDaysPlanned = trips.reduce((acc, t) => acc + (t.total_days || (t.days ? t.days.length : 0)), 0);
  const uniqueDestinations = new Set(trips.map(t => t.destination)).size;
  const totalEstCost = trips.reduce((acc, t) => acc + (t.cost_breakdown ? t.cost_breakdown.total : 0), 0);
  const avgCostPerTrip = totalTrips > 0 ? Math.round(totalEstCost / totalTrips) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-300">
      {/* SaaS Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold backdrop-blur-md mb-4 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Driven Travel Itinerary Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Personalized Travel Planning, Simplified by AI.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Generate custom day-by-day itineraries tailored to your budget, travel pace, and party style in seconds. Automated research, logistics optimization, and curated dining at your fingertips.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBuilder}
              className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl text-sm shadow-lg shadow-black/10 hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Launch Smart Trip Builder</span>
            </button>
            <div className="text-xs text-blue-200/90 font-medium pl-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>FastAPI Backend + React Frontend + Supabase Sync</span>
            </div>
          </div>
        </div>
      </div>

      {/* SaaS Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Trips</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalTrips}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for departure</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Days Planned</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalDaysPlanned}</div>
          <div className="text-xs text-slate-500 mt-1">Structured schedule days</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Destinations</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{uniqueDestinations}</div>
          <div className="text-xs text-slate-500 mt-1">Global cities mapped</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg. Trip Budget</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">${avgCostPerTrip.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-1">All-inclusive estimates</div>
        </div>
      </div>

      {/* Target User Scenarios Section */}
      <ScenarioCards 
        onSelectScenario={onSelectScenario} 
        loadingPresetId={loadingPresetId}
      />

      {/* Saved Itineraries Header & Filter */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Your Saved Itineraries</span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                {filteredTrips.length}
              </span>
            </h2>
            <p className="text-sm text-slate-500">
              Manage, customize, and review your synchronized travel plans.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                placeholder="Search destination or trip..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <button
              onClick={onOpenBuilder}
              className="p-2 sm:px-3 sm:py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Trip</span>
            </button>
          </div>
        </div>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              {trips.length === 0 ? "No itineraries generated yet" : "No matching itineraries found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              {trips.length === 0 
                ? "Click any of the scenarios above or use the Smart Trip Builder to create your first customized AI travel plan." 
                : "Try adjusting your search query."}
            </p>
            {trips.length === 0 && (
              <button
                onClick={onOpenBuilder}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build First Trip</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const tripDays = trip.total_days || (trip.days ? trip.days.length : 0);
              const tripCost = trip.cost_breakdown ? trip.cost_breakdown.total : 0;
              return (
                <div 
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        {trip.traveler_type || 'Custom'} Trip
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete itinerary for ${trip.destination}?`)) {
                            onDeleteTrip(trip.id);
                          }
                        }}
                        title="Delete Trip"
                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base mb-1.5 line-clamp-1">
                      {trip.title || `${trip.destination} Itinerary`}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>{trip.destination}</span>
                      <span className="text-slate-300">•</span>
                      <span>{tripDays} Days</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs text-slate-600 mb-4">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dates:</span>
                        <span className="font-medium text-slate-700">{trip.start_date} → {trip.end_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Budget Tier:</span>
                        <span className="font-medium capitalize text-slate-700">{trip.budget_tier}</span>
                      </div>
                      {tripCost > 0 && (
                        <div className="flex justify-between pt-1 border-t border-slate-200 font-bold text-slate-900">
                          <span>Est. Total:</span>
                          <span className="text-emerald-700">${tripCost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                    <span>Open Itinerary View</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

