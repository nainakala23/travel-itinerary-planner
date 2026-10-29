import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ItineraryView from './components/ItineraryView';
import TripBuilderModal from './components/TripBuilderModal';
import { api } from './services/api';
import { Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'itinerary'
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingPresetId, setLoadingPresetId] = useState(null);
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch saved trips on load
  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    try {
      const data = await api.listTrips();
      setTrips(data || []);
      // If we already have saved trips and no trip selected yet, keep in dashboard
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const handleGenerateTrip = async (formData) => {
    setIsGenerating(true);
    setErrorMessage(null);
    try {
      const generated = await api.generateTrip(formData);
      setSelectedTrip(generated);
      setView('itinerary');
      setIsBuilderOpen(false);
      await loadSavedTrips();
    } catch (err) {
      setErrorMessage(err.message || 'Error synthesizing itinerary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectScenario = async (scenarioData, presetId) => {
    setLoadingPresetId(presetId);
    setErrorMessage(null);
    try {
      const generated = await api.generateTrip(scenarioData);
      setSelectedTrip(generated);
      setView('itinerary');
      await loadSavedTrips();
    } catch (err) {
      setErrorMessage(err.message || 'Error generating scenario itinerary');
    } finally {
      setLoadingPresetId(null);
    }
  };

  const handleSaveTrip = async (itineraryToSave) => {
    try {
      await api.saveTrip(itineraryToSave);
      await loadSavedTrips();
      alert('Itinerary successfully synchronized to Supabase database!');
    } catch (err) {
      alert('Error saving trip: ' + err.message);
    }
  };

  const handleUpdateTrip = async (updatedItinerary) => {
    setSelectedTrip(updatedItinerary);
    try {
      await api.updateTrip(updatedItinerary.id, updatedItinerary);
      await loadSavedTrips();
    } catch (err) {
      console.error('Failed to auto-sync update:', err);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId);
      if (selectedTrip && selectedTrip.id === tripId) {
        setSelectedTrip(null);
        setView('dashboard');
      }
      await loadSavedTrips();
    } catch (err) {
      alert('Error deleting trip: ' + err.message);
    }
  };

  const handleRegenerateDay = async (tripId, dayNumber, preferencesOverride) => {
    setIsRegeneratingDay(true);
    try {
      const updatedTrip = await api.regenerateDay(tripId, dayNumber, preferencesOverride);
      setSelectedTrip(updatedTrip);
      await loadSavedTrips();
    } catch (err) {
      alert('Error regenerating day: ' + err.message);
    } finally {
      setIsRegeneratingDay(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar 
        currentView={view}
        onOpenBuilder={() => setIsBuilderOpen(true)}
        onGoHome={() => setView('dashboard')}
        savedCount={trips.length}
      />

      {/* Error alert toast */}
      {errorMessage && (
        <div className="max-w-7xl mx-auto px-4 mt-4 w-full">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between text-xs font-semibold">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:text-rose-800 underline">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {view === 'dashboard' ? (
          <Dashboard 
            trips={trips}
            onSelectTrip={(t) => {
              setSelectedTrip(t);
              setView('itinerary');
            }}
            onDeleteTrip={handleDeleteTrip}
            onOpenBuilder={() => setIsBuilderOpen(true)}
            onSelectScenario={handleSelectScenario}
            loadingPresetId={loadingPresetId}
          />
        ) : (
          <ItineraryView 
            itinerary={selectedTrip}
            onBack={() => setView('dashboard')}
            onSave={handleSaveTrip}
            onUpdateItinerary={handleUpdateTrip}
            onRegenerateDay={handleRegenerateDay}
            isRegeneratingDay={isRegeneratingDay}
          />
        )}
      </main>

      {/* Smart Trip Builder Modal */}
      <TripBuilderModal 
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onGenerate={handleGenerateTrip}
        isGenerating={isGenerating}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">WanderAI</span>
            <span>• Personalized Travel Itinerary Planner</span>
          </div>
          <div>
            Built with React, FastAPI, Supabase & Generative AI Prompt Engineering
          </div>
        </div>
      </footer>
    </div>
  );
}

