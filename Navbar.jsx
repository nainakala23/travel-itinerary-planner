import React from 'react';
import { Compass, Sparkles, Plus, Globe, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenBuilder, onGoHome, currentView, savedCount = 0 }) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/35 transition-all">
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                WanderAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                Itinerary Planner
              </span>
            </div>
            <p className="text-xs text-slate-500 -mt-0.5 hidden sm:block">AI-Powered Full-Stack Travel Orchestrator</p>
          </div>
        </div>

        {/* Center / Navigation Status */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={onGoHome}
            className={`transition-colors py-1 px-2 rounded-lg ${currentView === 'dashboard' ? 'text-blue-600 bg-blue-50 font-semibold' : 'hover:text-slate-900'}`}
          >
            Dashboard
          </button>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>FastAPI & Supabase Connected</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBuilder}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-xl text-sm shadow-sm shadow-blue-600/30 hover:shadow-md hover:shadow-blue-600/40 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-blue-200 animate-spin-slow" />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
}

