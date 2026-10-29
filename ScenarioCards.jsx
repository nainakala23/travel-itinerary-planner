import React from 'react';
import { User, Users, Heart, ArrowRight, Sparkles, Clock, Compass, DollarSign } from 'lucide-react';

export default function ScenarioCards({ onSelectScenario, loadingPresetId }) {
  const scenarios = [
    {
      id: 'scenario-1-solo',
      title: 'Scenario 1: Solo Traveler Weekend Getaway',
      tag: 'Individual / Solo',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: User,
      iconBg: 'bg-blue-100 text-blue-600',
      destination: 'Paris',
      duration: '3 Days (Weekend)',
      budget: 'Budget ($)',
      pace: 'Fast-paced & Balanced',
      description: 'Optimized travel time, iconic sights, and curated affordable dining to avoid hours of tedious searching.',
      requestData: {
        destination: 'Paris',
        start_date: '2026-11-06',
        end_date: '2026-11-08',
        traveler_type: 'solo',
        group_size: 1,
        budget_tier: 'budget',
        pace: 'fast-paced',
        interests: ['Sightseeing', 'Food & Dining', 'Photography'],
        total_budget_limit: 650,
        custom_notes: 'Focus on efficient travel times between sights and memorable affordable Parisian bistros.'
      }
    },
    {
      id: 'scenario-2-couple',
      title: 'Scenario 2: Couple Personalized Romantic Vacation',
      tag: 'Romance / Couples',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Heart,
      iconBg: 'bg-rose-100 text-rose-600',
      destination: 'Paris',
      duration: '5 Days',
      budget: 'Luxury ($$$)',
      pace: 'Relaxed & Intimate',
      description: 'Intimate pacing, scenic panoramas, boutique luxury stay, and fine gastronomy with day-wise flexibility.',
      requestData: {
        destination: 'Paris',
        start_date: '2026-11-10',
        end_date: '2026-11-14',
        traveler_type: 'couple',
        group_size: 2,
        budget_tier: 'luxury',
        pace: 'relaxed',
        interests: ['Romance', 'Food & Dining', 'Culture & History', 'Scenic Views'],
        total_budget_limit: 3500,
        custom_notes: 'Relaxed schedule, romantic sunset spots, boutique hotel in Le Marais, Michelin-level dinners.'
      }
    },
    {
      id: 'scenario-3-group',
      title: 'Scenario 3: Small Group Multi-Day Trip',
      tag: 'Small Group',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Users,
      iconBg: 'bg-amber-100 text-amber-600',
      destination: 'Tokyo',
      duration: '6 Days',
      budget: 'Moderate ($$)',
      pace: 'Moderate & Collaborative',
      description: 'Coordinates group logistics, shared interests (adventure, food, culture), and clear cost breakdowns.',
      requestData: {
        destination: 'Tokyo',
        start_date: '2026-11-15',
        end_date: '2026-11-20',
        traveler_type: 'group',
        group_size: 4,
        budget_tier: 'moderate',
        pace: 'moderate',
        interests: ['Adventure', 'Culture & History', 'Street Food', 'Nightlife'],
        total_budget_limit: 4800,
        custom_notes: 'Shared friend trip with group-friendly dining, balanced pacing, and smooth transit logistics.'
      }
    }
  ];

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Explore Targeted Scenarios</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              Instant 1-Click Launch
            </span>
          </h2>
          <p className="text-sm text-slate-500">
            Pre-engineered scenarios highlighting the planner's dynamic automation and prompt engineering.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scenarios.map((sc) => {
          const IconComp = sc.icon;
          const isLoading = loadingPresetId === sc.id;
          return (
            <div 
              key={sc.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl ${sc.iconBg} flex items-center justify-center font-semibold`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${sc.tagColor}`}>
                    {sc.tag}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-base mb-2">
                  {sc.title}
                </h3>

                <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                  {sc.description}
                </p>

                <div className="space-y-1.5 py-3 border-t border-slate-100 text-xs text-slate-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Destination:</span>
                    <span className="font-semibold text-slate-800">{sc.destination}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Duration:</span>
                    <span className="font-semibold text-slate-800">{sc.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Budget & Pace:</span>
                    <span className="font-semibold text-slate-800">{sc.budget} • {sc.pace}</span>
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading}
                onClick={() => onSelectScenario(sc.requestData, sc.id)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-blue-600 active:scale-98 transition-all disabled:opacity-60 shadow-sm group-hover:shadow"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-blue-200" />
                    <span>Synthesizing Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate Scenario</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

