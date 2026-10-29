# Personalized Travel Itinerary Planner 🌍✈️

A full-stack, AI-powered web application that simplifies travel planning through intelligent automation and personalized recommendations. Built with a **React** frontend, **FastAPI** backend, and **Supabase** database integration, it generates customized day-by-day itineraries based on user preferences, budget, and travel style using prompt engineering and generative AI.

---

## 🌟 Key Features

1. **Modern SaaS-Style Dashboard**:
   - Real-time travel metrics: Saved trips, planned days, unique destinations, and average daily budget.
   - 1-Click Launchers for key scenarios.
   - Search & filter capabilities for saved itineraries.

2. **Smart Trip Builder**:
   - Destination selection with popular city suggestions (Paris, Tokyo, New York, etc.).
   - Interactive date pickers with automatic day count calculation.
   - Traveler profile configuration: **Solo Traveler**, **Couple / Romance**, **Small Group**, or **Family**.
   - Dynamic group size scaling that adjusts accommodation & activity costs accordingly.
   - Pacing options: Relaxed, Moderate, Fast-Paced.
   - Budget tier settings: Budget ($), Moderate ($$), Luxury ($$$) + optional total budget cap.
   - Multi-select interest tags (Sightseeing, Food & Dining, Culture, Nature, Adventure, Romance, Nightlife, etc.).
   - Custom AI prompt engineering input field.

3. **Interactive Day-by-Day Itinerary View**:
   - Daily tabs with personalized daily themes.
   - Time-blocked schedule sections (**Morning**, **Afternoon**, **Evening**).
   - Rich activity cards: time estimate, duration, location, cost, category tag, and curated local travel tips.
   - Inline activity editor and modal to add new activities.
   - Curated local dining recommendations (breakfast, lunch, dinner with signature recommended dish).
   - Accommodation suggestions with neighborhood details, nightly rate, and amenities.
   - Route and logistics guidance for minimal transit friction.

4. **Single-Day AI Regeneration**:
   - Regenerate any specific day without resetting the rest of your itinerary.
   - Custom prompt override modal to steer the AI (e.g. *"Focus on hidden street food and photography"*).

5. **Live Budget Tracker & Cost Breakdown**:
   - Real-time cost allocation across **Accommodations**, **Dining**, **Activities**, and **Local Transit**.
   - Per-person cost calculation for groups and couples.
   - Budget progress bar showing utilization percentage against target spending limits.

6. **Target User Scenarios (Pre-Configured)**:
   - **Scenario 1: Solo Traveler Weekend Getaway** (Fast-paced, high sight density, affordable dining, travel time optimized).
   - **Scenario 2: Romantic Couple Vacation** (Relaxed pacing, scenic panoramas, boutique luxury stays, curated wine/dining).
   - **Scenario 3: Small Group Coordinating a Multi-Day Trip** (Shared friend trip, balanced group interests, logistics coordination).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons.
- **Backend**: FastAPI (Python 3.14), Uvicorn, Pydantic v2, Python-dotenv, HTTPX.
- **Data & Persistence**: Supabase client integration + resilient local persistent JSON store fallback.
- **AI Engine**: Generative AI prompt engineering (Gemini API with built-in domain synthesizer fallback for zero-friction local testing).

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend
Open a terminal in `backend`:
```powershell
cd backend
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### 2. Start the React Frontend
Open a terminal in `frontend`:
```powershell
cd frontend
npm run dev
```
- Web Application: `http://localhost:5173`

Or simply double-click `start-all.bat` on Windows!

---

## 🔑 Environment Configuration (.env)

In `backend/.env`:
```env
# Optional: Provide Gemini API Key for direct Google Generative AI integration
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key_here
```
*(If no API keys are provided, WanderAI uses its built-in knowledge engine and local persistence to run seamlessly out of the box).*

