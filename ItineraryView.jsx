import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, Sparkles, 
  RefreshCw, Edit3, Trash2, Plus, Check, Download, Share2, 
  Navigation, Utensils, Home, Info, AlertCircle
} from 'lucide-react';
import BudgetTracker from './BudgetTracker';

export default function ItineraryView({ 
  itinerary, 
  onBack, 
  onSave, 
  onRegenerateDay, 
  onUpdateItinerary,
  isRegeneratingDay 
}) {
  const [selectedDayNum, setSelectedDayNum] = useState(1);
  const [editingActivity, setEditingActivity] = useState(null); // activity being edited
  const [newActivitySlot, setNewActivitySlot] = useState(null); // "morning" | "afternoon" | "evening"
  const [showRegenModal, setShowRegenModal] = useState(false);
  const [regenPromptOverride, setRegenPromptOverride] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <p className="text-slate-500">No itinerary data available.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl">Back</button>
      </div>
    );
  }

  const activeDay = itinerary.days.find(d => d.day_number === selectedDayNum) || itinerary.days[0];

  const handleTriggerRegen = () => {
    onRegenerateDay(itinerary.id, selectedDayNum, regenPromptOverride);
    setShowRegenModal(false);
    setRegenPromptOverride('');
  };

  const handleDeleteActivity = (slot, activityId) => {
    const updatedDays = itinerary.days.map(d => {
      if (d.day_number !== selectedDayNum) return d;
      return {
        ...d,
        [slot]: d[slot].filter(a => a.id !== activityId)
      };
    });
    recalculateAndUpdate(updatedDays);
  };

  const handleSaveEditedActivity = (e) => {
    e.preventDefault();
    if (!editingActivity) return;

    const { slot, ...activityData } = editingActivity;
    const updatedDays = itinerary.days.map(d => {
      if (d.day_number !== selectedDayNum) return d;
      return {
        ...d,
        [slot]: d[slot].map(a => a.id === activityData.id ? activityData : a)
      };
    });
    recalculateAndUpdate(updatedDays);
    setEditingActivity(null);
  };

  const handleAddNewActivity = (e) => {
    e.preventDefault();
    const form = e.target;
    const newAct = {
      id: Math.random().toString(36).substring(2, 9),
      time_slot: newActivitySlot,
      title: form.title.value,
      description: form.description.value,
      location: form.location.value,
      category: form.category.value,
      estimated_cost: Number(form.estimated_cost.value) || 0,
      duration_hours: Number(form.duration_hours.value) || 2,
      travel_tip: form.travel_tip.value || null
    };

    const updatedDays = itinerary.days.map(d => {
      if (d.day_number !== selectedDayNum) return d;
      return {
        ...d,
        [newActivitySlot]: [...d[newActivitySlot], newAct]
      };
    });
    recalculateAndUpdate(updatedDays);
    setNewActivitySlot(null);
  };

  const recalculateAndUpdate = (updatedDays) => {
    const peopleCount = itinerary.group_size && itinerary.group_size > 0 
      ? itinerary.group_size 
      : (itinerary.traveler_type === 'couple' ? 2 : 1);

    const totalActCost = updatedDays.reduce((acc, d) => {
      const daySum = [...d.morning, ...d.afternoon, ...d.evening].reduce((s, a) => s + (a.estimated_cost || 0), 0);
      return acc + (daySum * peopleCount);
    }, 0);

    const newCostBreakdown = {
      ...itinerary.cost_breakdown,
      activities: Math.round(totalActCost),
      total: Math.round(
        (itinerary.cost_breakdown.accommodations || 0) +
        (itinerary.cost_breakdown.dining || 0) +
        totalActCost +
        (itinerary.cost_breakdown.local_transit || 0)
      )
    };

    onUpdateItinerary({
      ...itinerary,
      days: updatedDays,
      cost_breakdown: newCostBreakdown
    });
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(itinerary, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${itinerary.destination}_itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-2.5">
          {copiedNotification && (
            <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium animate-pulse">
              Link copied!
            </span>
          )}
          <button
            onClick={handleShare}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => onSave(itinerary)}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20"
          >
            <Check className="w-4 h-4 text-blue-200" />
            <span>Save Itinerary</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold uppercase tracking-wider border border-blue-400/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI-Generated Travel Plan
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/10 capitalize">
              {itinerary.traveler_type} Trip ({itinerary.group_size || 1} {itinerary.group_size === 1 ? 'Traveler' : 'Travelers'})
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/10 capitalize">
              {itinerary.budget_tier} Tier • {itinerary.pace} Pace
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {itinerary.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white">{itinerary.destination}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{itinerary.start_date} to {itinerary.end_date}</span>
              <span className="text-slate-400">({itinerary.total_days} Days)</span>
            </div>
            {itinerary.interests && itinerary.interests.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Interests:</span>
                <span className="text-blue-200 font-medium">{itinerary.interests.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Budget Tracker Widget */}
      <BudgetTracker 
        costBreakdown={itinerary.cost_breakdown}
        budgetLimit={itinerary.total_budget_limit}
        travelerType={itinerary.traveler_type}
        groupSize={itinerary.group_size}
      />

      {/* Day Selector Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-sm flex items-center gap-2 overflow-x-auto custom-scrollbar">
        {itinerary.days.map((day) => {
          const isSelected = day.day_number === selectedDayNum;
          return (
            <button
              key={day.day_number}
              onClick={() => setSelectedDayNum(day.day_number)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl transition-all text-left ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 font-bold' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="text-[11px] uppercase tracking-wider opacity-80">
                Day {day.day_number}
              </div>
              <div className="text-xs font-semibold truncate max-w-[140px] mt-0.5">
                {day.theme}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Day Header & Regeneration Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60">
              Day {activeDay.day_number} • {activeDay.date}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            {activeDay.theme}
          </h2>
          {activeDay.logistics_notes && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
              <span>{activeDay.logistics_notes}</span>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRegenModal(true)}
            disabled={isRegeneratingDay}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingDay ? 'animate-spin' : ''}`} />
            <span>Regenerate Day {activeDay.day_number}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Schedule Timeline & Sidebar Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Morning / Afternoon / Evening Timeline (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {['morning', 'afternoon', 'evening'].map((slotKey) => {
            const slotTitle = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);
            const slotColor = slotKey === 'morning' ? 'text-amber-600 bg-amber-50' : (slotKey === 'afternoon' ? 'text-blue-600 bg-blue-50' : 'text-indigo-600 bg-indigo-50');
            const activities = activeDay[slotKey] || [];

            return (
              <div key={slotKey} className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${slotColor}`}>
                      {slotTitle}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {activities.length} {activities.length === 1 ? 'Activity' : 'Activities'}
                    </span>
                  </div>

                  <button
                    onClick={() => setNewActivitySlot(slotKey)}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Activity</span>
                  </button>
                </div>

                {activities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No scheduled activities for this time slot. Click "Add Activity" to insert one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((act) => (
                      <div 
                        key={act.id} 
                        className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {act.title}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 uppercase">
                                {act.category}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                              {act.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {act.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                ~{act.duration_hours} hrs
                              </span>
                              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                                <DollarSign className="w-3 h-3" />
                                {act.estimated_cost === 0 ? 'Free Entry' : `$${act.estimated_cost}`}
                              </span>
                            </div>

                            {act.travel_tip && (
                              <div className="mt-2 text-[11px] text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-lg border border-amber-200/50 flex items-center gap-1.5">
                                <Info className="w-3 h-3 text-amber-600 flex-shrink-0" />
                                <span>Tip: {act.travel_tip}</span>
                              </div>
                            )}
                          </div>

                          {/* Quick Edit/Delete Actions */}
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditingActivity({ ...act, slot: slotKey })}
                              title="Edit Activity"
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(slotKey, act.id)}
                              title="Delete Activity"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Accommodations & Curated Dining */}
        <div className="space-y-6">
          {/* Accommodation Card */}
          {activeDay.accommodation_suggestion && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recommended Lodging</h3>
                  <span className="text-[11px] text-slate-500">{activeDay.accommodation_suggestion.type}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{activeDay.accommodation_suggestion.name}</h4>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {activeDay.accommodation_suggestion.neighborhood}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Est. Nightly</span>
                    <span className="text-sm font-bold text-slate-800">
                      ${activeDay.accommodation_suggestion.nightly_rate_est}
                    </span>
                  </div>
                </div>

                {activeDay.accommodation_suggestion.features && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {activeDay.accommodation_suggestion.features.map((f, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
                        {f}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dining Recommendations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Curated Local Dining</h3>
                <span className="text-[11px] text-slate-500">Hand-selected culinary spots</span>
              </div>
            </div>

            <div className="space-y-3">
              {(activeDay.dining_recommendations || []).map((restaurant, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{restaurant.name}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {restaurant.price_range}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 block mb-1">
                    {restaurant.cuisine} • {restaurant.meal_type ? restaurant.meal_type.toUpperCase() : 'MEAL'}
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {restaurant.description}
                  </p>
                  {restaurant.recommended_dish && (
                    <div className="mt-2 text-[11px] text-emerald-800 font-medium bg-emerald-50/70 px-2 py-0.5 rounded border border-emerald-200/50">
                      Must Try: {restaurant.recommended_dish}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Edit Activity */}
      {editingActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-4">Edit Activity</h3>
            <form onSubmit={handleSaveEditedActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={editingActivity.title}
                  onChange={(e) => setEditingActivity({ ...editingActivity, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea 
                  rows="2"
                  value={editingActivity.description}
                  onChange={(e) => setEditingActivity({ ...editingActivity, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location</label>
                  <input 
                    type="text"
                    value={editingActivity.location}
                    onChange={(e) => setEditingActivity({ ...editingActivity, location: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Cost ($)</label>
                  <input 
                    type="number"
                    value={editingActivity.estimated_cost}
                    onChange={(e) => setEditingActivity({ ...editingActivity, estimated_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Travel Tip</label>
                <input 
                  type="text"
                  value={editingActivity.travel_tip || ''}
                  onChange={(e) => setEditingActivity({ ...editingActivity, travel_tip: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingActivity(null)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Activity */}
      {newActivitySlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900 mb-1 capitalize">
              Add New {newActivitySlot} Activity
            </h3>
            <p className="text-xs text-slate-500 mb-4">Add a custom sight, dining, or leisure stop.</p>
            <form onSubmit={handleAddNewActivity} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Title</label>
                <input 
                  name="title"
                  type="text" 
                  required
                  placeholder="e.g. Visit Louvre Pyramid at Sunset"
                  className="w-full px-3 py-2 border rounded-lg text-slate-800 font-medium"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea 
                  name="description"
                  rows="2"
                  placeholder="Brief summary of the experience"
                  className="w-full px-3 py-2 border rounded-lg text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Location</label>
                  <input 
                    name="location"
                    type="text"
                    required
                    placeholder="Neighborhood or address"
                    className="w-full px-3 py-2 border rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select name="category" className="w-full px-3 py-2 border rounded-lg text-slate-800 bg-white">
                    <option value="sightseeing">Sightseeing</option>
                    <option value="culture">Culture & History</option>
                    <option value="dining">Dining & Food</option>
                    <option value="leisure">Leisure & Relax</option>
                    <option value="adventure">Adventure</option>
                    <option value="nightlife">Nightlife</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Cost ($)</label>
                  <input 
                    name="estimated_cost"
                    type="number"
                    defaultValue="0"
                    className="w-full px-3 py-2 border rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Hours)</label>
                  <input 
                    name="duration_hours"
                    type="number"
                    step="0.5"
                    defaultValue="2"
                    className="w-full px-3 py-2 border rounded-lg text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Travel Tip (Optional)</label>
                <input 
                  name="travel_tip"
                  type="text"
                  placeholder="e.g. Book online in advance"
                  className="w-full px-3 py-2 border rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewActivitySlot(null)}
                  className="px-3 py-1.5 border rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  Add Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Regenerate Specific Day with AI Prompt Override */}
      {showRegenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Regenerate Day {activeDay.day_number} Plan
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              AI will redesign activities for Day {activeDay.day_number} ({activeDay.date}) while preserving the rest of your itinerary.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Custom Focus / Prompt Override (Optional)
              </label>
              <textarea
                rows="3"
                value={regenPromptOverride}
                onChange={(e) => setRegenPromptOverride(e.target.value)}
                placeholder="e.g. 'More outdoor scenic parks instead of museums', or 'Focus on hidden food stalls and photography spots'."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRegenModal(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleTriggerRegen}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1.5 shadow-md shadow-blue-500/25"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Regenerate Day</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

