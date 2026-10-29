import React, { useState } from 'react';
import { 
  X, Sparkles, MapPin, Calendar, Users, DollarSign, Gauge, Heart, 
  Compass, Check, AlertCircle, ArrowRight
} from 'lucide-react';

const POPULAR_DESTINATIONS = ['Paris', 'Tokyo', 'New York', 'Rome', 'Barcelona', 'Kyoto', 'London', 'Reykjavik'];

const INTEREST_TAGS = [
  'Sightseeing', 'Food & Dining', 'Culture & History', 'Romance', 
  'Adventure', 'Nature & Parks', 'Nightlife', 'Photography', 'Shopping'
];

export default function TripBuilderModal({ isOpen, onClose, onGenerate, isGenerating }) {
  if (!isOpen) return null;

  // Defaults
  const today = new Date();
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const fiveDaysLater = new Date(nextWeek.getTime() + 4 * 24 * 60 * 60 * 1000);

  const formatDate = (d) => d.toISOString().split('T')[0];

  const [destination, setDestination] = useState('Paris');
  const [startDate, setStartDate] = useState(formatDate(nextWeek));
  const [endDate, setEndDate] = useState(formatDate(fiveDaysLater));
  const [travelerType, setTravelerType] = useState('couple');
  const [groupSize, setGroupSize] = useState(2);
  const [budgetTier, setBudgetTier] = useState('moderate');
  const [totalBudgetLimit, setTotalBudgetLimit] = useState('');
  const [pace, setPace] = useState('moderate');
  const [selectedInterests, setSelectedInterests] = useState(['Food & Dining', 'Culture & History', 'Sightseeing']);
  const [customNotes, setCustomNotes] = useState('');

  // Calculate duration
  const d1 = new Date(startDate);
  const d2 = new Date(endDate);
  const diffDays = Math.max(1, Math.round((d2 - d1) / (1000 * 60 * 60 * 24)) + 1);

  const handleTravelerTypeSelect = (type) => {
    setTravelerType(type);
    if (type === 'solo') setGroupSize(1);
    else if (type === 'couple') setGroupSize(2);
    else if (type === 'group' && groupSize < 3) setGroupSize(4);
  };

  const toggleInterest = (tag) => {
    if (selectedInterests.includes(tag)) {
      setSelectedInterests(selectedInterests.filter(t => t !== tag));
    } else {
      setSelectedInterests([...selectedInterests, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onGenerate({
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      traveler_type: travelerType,
      group_size: Number(groupSize) || 1,
      budget_tier: budgetTier,
      total_budget_limit: totalBudgetLimit ? Number(totalBudgetLimit) : null,
      pace: pace,
      interests: selectedInterests,
      custom_notes: customNotes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">Smart Trip Builder</h2>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Configure parameters to generate an optimized AI travel itinerary.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              Destination City
            </label>
            <input 
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Paris, Tokyo, New York, Rome"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 placeholder:text-slate-400"
            />
            {/* Quick destination tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <span className="text-[11px] text-slate-400 self-center">Popular:</span>
              {POPULAR_DESTINATIONS.map(d => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDestination(d)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    destination.toLowerCase() === d.toLowerCase()
                      ? 'bg-blue-50 border-blue-400 text-blue-700 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                Start Date
              </label>
              <input 
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  End Date
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                  {diffDays} {diffDays === 1 ? 'Day' : 'Days'} Total
                </span>
              </label>
              <input 
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-900"
              />
            </div>
          </div>

          {/* Traveler Type & Group Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              Traveler Profile
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'solo', label: 'Solo Traveler', desc: '1 person' },
                { id: 'couple', label: 'Couple / Romance', desc: '2 persons' },
                { id: 'group', label: 'Small Group', desc: 'Friends' },
                { id: 'family', label: 'Family', desc: 'All ages' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleTravelerTypeSelect(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    travelerType === item.id 
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>

            {travelerType === 'group' && (
              <div className="mt-3 flex items-center gap-3 bg-amber-50/70 p-3 rounded-xl border border-amber-200/70">
                <span className="text-xs font-semibold text-amber-900">Group Size (People):</span>
                <input 
                  type="number"
                  min="2"
                  max="20"
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-20 px-2 py-1 rounded-lg border border-amber-300 text-center font-bold text-slate-900 text-sm bg-white"
                />
                <span className="text-xs text-amber-700">Cost & activity schedules will adapt to group capacity.</span>
              </div>
            )}
          </div>

          {/* Budget Tier & Limit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Budget Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'budget', label: 'Budget ($)', desc: 'Affordable' },
                  { id: 'moderate', label: 'Moderate ($$)', desc: 'Balanced' },
                  { id: 'luxury', label: 'Luxury ($$$)', desc: 'High-end' }
                ].map(b => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setBudgetTier(b.id)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all ${
                      budgetTier === b.id 
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20' 
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs">{b.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-indigo-600" />
                Travel Pace
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'relaxed', label: 'Relaxed' },
                  { id: 'moderate', label: 'Moderate' },
                  { id: 'fast-paced', label: 'Fast-Paced' }
                ].map(p => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setPace(p.id)}
                    className={`py-2 px-1 text-center rounded-xl border transition-all text-xs font-semibold ${
                      pace === p.id 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20' 
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Total Budget Cap */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                Target Budget Cap (USD, Optional)
              </span>
              <span className="text-[11px] text-slate-400">Leave blank for auto-calculated</span>
            </label>
            <input 
              type="number"
              placeholder="e.g. 1500"
              value={totalBudgetLimit}
              onChange={(e) => setTotalBudgetLimit(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-slate-900"
            />
          </div>

          {/* Interests & Style */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-600" />
              Interests & Travel Style
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map(tag => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm' 
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Engineering / Custom Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              AI Prompt Engineering & Custom Preferences
            </label>
            <textarea 
              rows="2"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. 'Must include local bakeries in the morning, sunset view on day 2, avoid heavy crowds.'"
              className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 active:scale-98 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                  <span>Synthesizing Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate AI Itinerary</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

