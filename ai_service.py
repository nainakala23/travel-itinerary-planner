import json
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import httpx
from app.config import settings
from app.models import (
    TripCreateRequest, Itinerary, DayPlan, Activity, DiningSpot, Accommodation, CostBreakdown
)

DESTINATION_KNOWLEDGE = {
    "paris": {
        "sights": [
            ("Eiffel Tower & Champ de Mars", "Iconic iron tower with panoramic city vistas", "7th Arrondissement", 35.0, "sightseeing", "Arrive early morning to beat the queues"),
            ("Louvre Museum", "World-renowned museum housing the Mona Lisa and Venus de Milo", "1st Arrondissement", 22.0, "culture", "Pre-book timed entry ticket online"),
            ("Montmartre & Sacré-Cœur", "Charming hilltop artistic district with cobblestone streets", "18th Arrondissement", 0.0, "culture", "Watch out for street portrait artists and take the funicular"),
            ("Musée d'Orsay", "Impressionist masterpiece collection housed in a beaux-arts railway station", "7th Arrondissement", 18.0, "culture", "Check out the giant station clock face view"),
            ("Seine River Cruise", "Relaxing twilight glass-canopy boat ride along iconic bridges", "Pont Neuf", 20.0, "leisure", "Ideal right at dusk for the hourly Eiffel sparkle"),
            ("Le Marais Historic Walk", "Trendy district of aristocratic mansions, boutiques, and bakeries", "4th Arrondissement", 0.0, "sightseeing", "Stop for fresh falafel at L'As du Fallafel"),
            ("Sainte-Chapelle & Conciergerie", "Stunning 13th-century Gothic chapel with radiant stained glass", "Île de la Cité", 15.0, "culture", "Visit on a sunny day for breathtaking light rays")
        ],
        "dining": [
            DiningSpot(name="Le Comptoir du Relais", cuisine="Classic French Bistro", price_range="$$", description="Atmospheric Saint-Germain bistro renowned for seasonal charcuterie & duck confit", recommended_dish="Duck Confit with Crispy Potatoes", meal_type="dinner"),
            DiningSpot(name="Du Pain et des Idées", cuisine="Artisan Parisian Bakery", price_range="$", description="Historic 1875 bakery famous for escargot pastries and crusty sourdough", recommended_dish="Pistachio & Chocolate Escargot Viennoiserie", meal_type="breakfast"),
            DiningSpot(name="Chez Janou", cuisine="Provençal Bistro", price_range="$$", description="Vibrant spot near Place des Vosges serving unlimited chocolate mousse", recommended_dish="Herb-crusted Rack of Lamb & Chocolate Mousse", meal_type="lunch"),
            DiningSpot(name="Le Jules Verne", cuisine="Haute French Gastronomy", price_range="$$$$", description="Michelin-starred dining on the second tier of the Eiffel Tower", recommended_dish="Langoustine & Truffled Foie Gras", meal_type="dinner")
        ],
        "stays": {
            "budget": Accommodation(name="Generator Paris Hostel & Suites", type="Boutique Designer Hostel", neighborhood="Canal Saint-Martin", nightly_rate_est=65.0, features=["Rooftop bar", "Metro nearby", "Private & shared rooms"]),
            "moderate": Accommodation(name="Hôtel Caron de Beaumarchais", type="Boutique 18th-century Hotel", neighborhood="Le Marais", nightly_rate_est=195.0, features=["Antique furnishings", "Courtyard breakfast", "Walkable location"]),
            "luxury": Accommodation(name="Hôtel Plaza Athénée", type="5-Star Luxury Palace", neighborhood="Avenue Montaigne", nightly_rate_est=750.0, features=["Eiffel Tower view balconies", "Haute cuisine", "Dior Spa"])
        }
    },
    "tokyo": {
        "sights": [
            ("Sensō-ji Temple & Asakusa", "Tokyo's oldest and most significant Buddhist temple", "Taito City", 0.0, "culture", "Wander through Nakamise-dori market early"),
            ("Shibuya Sky & Crossing", "World's busiest pedestrian crossing with a 360-degree open-air observation deck", "Shibuya", 22.0, "sightseeing", "Time your visit for the sunset glow over Mt. Fuji"),
            ("Shinjuku Gyoen National Garden", "Sprawling tranquil oasis blending traditional Japanese and English landscape gardens", "Shinjuku", 5.0, "nature", "Take off shoes when entering the historic teahouse"),
            ("Meiji Jingu Shrine & Harajuku", "Serene cedar forest shrine in the heart of the metropolis", "Shibuya", 0.0, "culture", "Write your wish on an ema wooden plaque"),
            ("TeamLab Planets", "Immersive body-interactive digital art museum", "Toyosu", 34.0, "adventure", "Wear pants that can be rolled up above your knees"),
            ("Akihabara Electric Town", "Capital of tech, retro gaming, anime, and manga culture", "Chiyoda City", 0.0, "leisure", "Explore Mandarake and retro arcade buildings"),
            ("Tsukiji Outer Market Food Tour", "Legendary lively market stalls with fresh sushi and tamagoyaki", "Chuo City", 25.0, "dining", "Bring cash for street food vendors")
        ],
        "dining": [
            DiningSpot(name="Ichiran Shibuya", cuisine="Tonkotsu Ramen", price_range="$", description="Individual focus-dining booths with custom flavor intensity", recommended_dish="Classic Tonkotsu Ramen with half-boiled egg", meal_type="lunch"),
            DiningSpot(name="Gonpachi Nishi-Azabu", cuisine="Edo Izakaya & Robata", price_range="$$", description="Atmospheric wooden izakaya that inspired the Kill Bill tavern scene", recommended_dish="Charcoal-grilled Yakitori & Soba Noodles", meal_type="dinner"),
            DiningSpot(name="Daiwa Sushi", cuisine="Omakase Sushi", price_range="$$$", description="Daily auction-fresh fish hand-crafted right before your eyes", recommended_dish="Chef's Seasonal 7-Piece Omakase", meal_type="breakfast"),
            DiningSpot(name="Kagurazaka Ishikawa", cuisine="Kaiseki Ryori", price_range="$$$$", description="3-Michelin-starred serene Japanese seasonal tasting dining", recommended_dish="Charcoal-grilled Sweetfish & Wagyu", meal_type="dinner")
        ],
        "stays": {
            "budget": Accommodation(name="Wise Owl Hostels River Tokyo", type="Modern Capsule & Pods", neighborhood="Sumida", nightly_rate_est=45.0, features=["Cafe & lounge", "Soundproof pods", "Riverside promenade"]),
            "moderate": Accommodation(name="Hotel Gracery Shinjuku", type="Mid-Scale City Hotel", neighborhood="Kabukicho, Shinjuku", nightly_rate_est=170.0, features=["Godzilla terrace", "Direct subway link", "City views"]),
            "luxury": Accommodation(name="Aman Tokyo", type="Ultra-luxury Urban Sanctuary", neighborhood="Otemachi", nightly_rate_est=890.0, features=["Panoramic Tokyo skyline", "Onsen-style hot baths", "Zen minimalist design"])
        }
    },
    "new york": {
        "sights": [
            ("Central Park & Bethesda Terrace", "Iconic 843-acre urban sanctuary with winding paths and lake", "Manhattan", 0.0, "nature", "Rent a CitiBike to cover the reservoir loop"),
            ("The High Line & Chelsea Market", "Elevated park on historic freight rail tracks overlooking the Hudson", "Meatpacking District", 0.0, "sightseeing", "Grab artisanal tacos inside Chelsea Market"),
            ("Metropolitan Museum of Art (The Met)", "World-class collection covering 5,000 years of global art", "Upper East Side", 30.0, "culture", "Don't miss the rooftop garden sculpture commission"),
            ("Summit One Vanderbilt", "Multisensory glass observation deck with skyline reflections", "Midtown Manhattan", 42.0, "sightseeing", "Bring sunglasses; the mirrors are ultra-bright"),
            ("Brooklyn Bridge Walk & DUMBO", "Historic suspension bridge stroll followed by waterfront skyline views", "Lower Manhattan / Brooklyn", 0.0, "sightseeing", "Snap the iconic Manhattan Bridge frame from Washington St"),
            ("Broadway Musical Show", "World-renowned live theater performance in the Theater District", "Times Square", 95.0, "leisure", "Check TKTS booth under the red steps for same-day deals")
        ],
        "dining": [
            DiningSpot(name="Joe's Pizza", cuisine="NY Style Pizza", price_range="$", description="The gold standard of classic New York thin-crust cheese slice", recommended_dish="Classic Pepperoni Slice with Garlic Knots", meal_type="lunch"),
            DiningSpot(name="Gramercy Tavern", cuisine="Contemporary American", price_range="$$$", description="Warm hospitality with seasonal farm-to-table tasting courses", recommended_dish="Roasted Duck Breast with Seasonal Glaze", meal_type="dinner"),
            DiningSpot(name="Russ & Daughters Cafe", cuisine="Traditional Jewish Appetizing", price_range="$$", description="Lower East Side heritage bagels, smoked salmon, and babka", recommended_dish="Classic Board with Gaspe Nova & Cream Cheese", meal_type="breakfast"),
            DiningSpot(name="Le Bernardin", cuisine="French Seafood Fine Dining", price_range="$$$$", description="Renowned 3-Michelin star sanctuary for immaculate seafood", recommended_dish="Barely Cooked Wild Salmon & Black Truffle", meal_type="dinner")
        ],
        "stays": {
            "budget": Accommodation(name="Pod 39 Hotel", type="Smart Micro-Hotel", neighborhood="Murray Hill", nightly_rate_est=110.0, features=["Rooftop lounge", "Compact stylish rooms", "Close to Grand Central"]),
            "moderate": Accommodation(name="Arlo SoHo", type="Boutique Design Hotel", neighborhood="SoHo / Hudson Square", nightly_rate_est=240.0, features=["Courtyard patio", "Bicycles available", "Near premier boutiques"]),
            "luxury": Accommodation(name="The Carlyle, A Rosewood Hotel", type="Historic Upper East Side Luxury", neighborhood="Upper East Side", nightly_rate_est=820.0, features=["Bemelmans Bar with live jazz", "Butler service", "Central Park steps"])
        }
    }
}

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    def _calculate_cost_multipliers(self, budget_tier: str, traveler_type: str, group_size: int):
        multiplier = {"budget": 0.65, "moderate": 1.0, "luxury": 2.5}.get(budget_tier, 1.0)
        size = group_size if group_size > 0 else (2 if traveler_type == "couple" else 1)
        return multiplier, size

    def generate_itinerary(self, req: TripCreateRequest) -> Itinerary:
        """
        Main itinerary generation entrypoint.
        If Gemini API key is configured, attempts LLM synthesis.
        Otherwise (or on failure), applies the intelligent fallback engine.
        """
        # Calculate date range and days count
        try:
            d1 = datetime.strptime(req.start_date, "%Y-%m-%d")
            d2 = datetime.strptime(req.end_date, "%Y-%m-%d")
            days_count = max(1, (d2 - d1).days + 1)
        except Exception:
            days_count = 3
            d1 = datetime.utcnow()

        # If API key is available, attempt real AI generation
        if self.api_key:
            try:
                ai_result = self._call_gemini_api(req, days_count, d1)
                if ai_result:
                    return ai_result
            except Exception as e:
                print(f"[AIService] Gemini API error: {e}. Falling back to dynamic synthesis.")

        # High-fidelity synthesis engine
        return self._synthesize_itinerary(req, days_count, d1)

    def _call_gemini_api(self, req: TripCreateRequest, days_count: int, start_dt: datetime) -> Optional[Itinerary]:
        # Formulate structured prompt
        prompt = f"""
You are an expert AI Travel Planner. Generate a comprehensive {days_count}-day travel itinerary for {req.destination}.
Traveler details:
- Traveler Type: {req.traveler_type} (Group Size: {req.group_size})
- Budget Tier: {req.budget_tier} (Target Budget: {req.total_budget_limit or 'Standard'})
- Travel Pace: {req.pace}
- Interests: {', '.join(req.interests) if req.interests else 'General Exploration'}
- Custom Notes: {req.custom_notes or 'None'}

Return ONLY valid JSON matching this schema:
{{
  "title": "Creative Trip Title",
  "days": [
    {{
      "day_number": 1,
      "date": "YYYY-MM-DD",
      "theme": "Theme of the day",
      "morning": [
        {{ "id": "act1", "time_slot": "morning", "title": "...", "description": "...", "location": "...", "category": "sightseeing", "estimated_cost": 20.0, "duration_hours": 2.5, "travel_tip": "..." }}
      ],
      "afternoon": [...],
      "evening": [...],
      "dining_recommendations": [
        {{ "name": "...", "cuisine": "...", "price_range": "$$", "description": "...", "recommended_dish": "...", "meal_type": "lunch" }}
      ],
      "accommodation_suggestion": {{
        "name": "...", "type": "...", "neighborhood": "...", "nightly_rate_est": 150.0, "features": ["..."]
      }},
      "logistics_notes": "Transit tips and walking distances"
    }}
  ],
  "cost_breakdown": {{
    "accommodations": 450.0,
    "dining": 300.0,
    "activities": 220.0,
    "local_transit": 80.0,
    "total": 1050.0,
    "currency": "USD"
  }}
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.4, "responseMimeType": "application/json"}
        }

        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                parsed = json.loads(raw_text)

                # Convert to Itinerary model
                days_list = []
                for d in parsed.get("days", []):
                    m_acts = [Activity(**a) for a in d.get("morning", [])]
                    a_acts = [Activity(**a) for a in d.get("afternoon", [])]
                    e_acts = [Activity(**a) for a in d.get("evening", [])]
                    dinings = [DiningSpot(**dn) for dn in d.get("dining_recommendations", [])]
                    acc = Accommodation(**d["accommodation_suggestion"]) if d.get("accommodation_suggestion") else None
                    day_cost = sum(a.estimated_cost for a in (m_acts + a_acts + e_acts))
                    days_list.append(DayPlan(
                        day_number=d["day_number"],
                        date=d.get("date", (start_dt + timedelta(days=d["day_number"]-1)).strftime("%Y-%m-%d")),
                        theme=d.get("theme", f"Day {d['day_number']} Adventure"),
                        morning=m_acts,
                        afternoon=a_acts,
                        evening=e_acts,
                        dining_recommendations=dinings,
                        accommodation_suggestion=acc,
                        logistics_notes=d.get("logistics_notes", "Walkable route with convenient public transit links"),
                        estimated_daily_cost=round(day_cost, 2)
                    ))

                cb = CostBreakdown(**parsed.get("cost_breakdown", {}))
                return Itinerary(
                    title=parsed.get("title", f"Personalized {req.destination.title()} Itinerary"),
                    destination=req.destination.title(),
                    start_date=req.start_date,
                    end_date=req.end_date,
                    total_days=days_count,
                    traveler_type=req.traveler_type,
                    group_size=req.group_size,
                    budget_tier=req.budget_tier,
                    pace=req.pace,
                    interests=req.interests,
                    days=days_list,
                    cost_breakdown=cb
                )
        return None

    def _synthesize_itinerary(self, req: TripCreateRequest, days_count: int, start_dt: datetime) -> Itinerary:
        dest_key = req.destination.strip().lower()
        matched_dest = None
        for k in DESTINATION_KNOWLEDGE:
            if k in dest_key or dest_key in k:
                matched_dest = DESTINATION_KNOWLEDGE[k]
                break

        cost_mult, people_count = self._calculate_cost_multipliers(req.budget_tier, req.traveler_type, req.group_size)

        # Title customized to traveler type scenario
        if req.traveler_type == "solo":
            title = f"Solo Explorer: {req.destination.title()} Weekend Getaway"
        elif req.traveler_type == "couple":
            title = f"Romantic Escape: {req.destination.title()} for Two"
        elif req.traveler_type == "group":
            title = f"Friends Multi-Day Expedition: {req.destination.title()}"
        else:
            title = f"Curated {req.destination.title()} Discovery Journey"

        days_list = []
        total_activity_cost = 0.0
        total_dining_cost = 0.0

        # Accommodations
        if matched_dest:
            acc_template = matched_dest["stays"].get(req.budget_tier, matched_dest["stays"]["moderate"])
        else:
            acc_template = Accommodation(
                name=f"The {req.destination.title()} Grand Boutique Hotel",
                type="Boutique City Stay" if req.budget_tier != "luxury" else "5-Star Luxury Resort",
                neighborhood="Central Historic District",
                nightly_rate_est=round(160.0 * cost_mult, 2),
                features=["Complimentary breakfast", "Central location", "Fast Wi-Fi"]
            )

        daily_lodging = round(acc_template.nightly_rate_est * (1 if people_count <= 2 else (people_count / 2)), 2)

        for day_idx in range(days_count):
            current_date = (start_dt + timedelta(days=day_idx)).strftime("%Y-%m-%d")
            day_num = day_idx + 1

            # Determine day theme based on scenario and day number
            if req.traveler_type == "couple":
                themes = [
                    "Arrival, Sunset Stroll & Candlelight Dinner",
                    "Scenic Panoramas, Hidden Courtyards & Wine Tasting",
                    "Intimate Cultural Highlights & Rooftop Skyline Views",
                    "Artisan Markets & Leisurely Couples Spa"
                ]
            elif req.traveler_type == "group":
                themes = [
                    "Group Basecamp Check-in & Lively Street Food Tour",
                    "Iconic Landmarks & Shared High-Energy Adventures",
                    "Cultural Immersion & Team Scenic Walk",
                    "Group Celebratory Dinner & Nightlife Exploration"
                ]
            else:  # Solo / weekend
                themes = [
                    "Quick Highlights & Top Must-See Sightseeing",
                    "Neighborhood Wandering, Local Coffee & Art",
                    "Panoramic Viewpoints & Hidden Gems",
                    "Farewell Local Delights & Souvenir Stroll"
                ]
            day_theme = themes[(day_num - 1) % len(themes)]

            # Sights generation
            morning_acts = []
            afternoon_acts = []
            evening_acts = []

            if matched_dest:
                sights_pool = matched_dest["sights"]
                dining_pool = matched_dest["dining"]
                s1 = sights_pool[(day_idx * 3) % len(sights_pool)]
                s2 = sights_pool[(day_idx * 3 + 1) % len(sights_pool)]
                s3 = sights_pool[(day_idx * 3 + 2) % len(sights_pool)]

                morning_acts.append(Activity(
                    time_slot="morning",
                    title=s1[0],
                    description=s1[1],
                    location=s1[2],
                    category=s1[4],
                    estimated_cost=round(s1[3] * cost_mult, 2),
                    duration_hours=2.0 if req.pace == "fast-paced" else 2.5,
                    travel_tip=s1[5]
                ))

                afternoon_acts.append(Activity(
                    time_slot="afternoon",
                    title=s2[0],
                    description=s2[1],
                    location=s2[2],
                    category=s2[4],
                    estimated_cost=round(s2[3] * cost_mult, 2),
                    duration_hours=2.0 if req.pace == "fast-paced" else 3.0,
                    travel_tip=s2[5]
                ))

                # For relaxed pacing, evening is lighter
                evening_acts.append(Activity(
                    time_slot="evening",
                    title=s3[0],
                    description=s3[1],
                    location=s3[2],
                    category=s3[4],
                    estimated_cost=round(s3[3] * cost_mult, 2),
                    duration_hours=1.5 if req.pace == "relaxed" else 2.5,
                    travel_tip=s3[5]
                ))

                # Dining recommendations
                day_dining = [
                    dining_pool[(day_idx * 2) % len(dining_pool)],
                    dining_pool[(day_idx * 2 + 1) % len(dining_pool)]
                ]
            else:
                # Dynamic generic fallback with high relevance
                interests_str = req.interests[0] if req.interests else "Sightseeing"
                morning_acts.append(Activity(
                    time_slot="morning",
                    title=f"Historic Heart of {req.destination.title()}",
                    description=f"Begin the morning discovering the primary architecture and historical squares of {req.destination.title()}.",
                    location=f"Old Town, {req.destination.title()}",
                    category="culture",
                    estimated_cost=round(15.0 * cost_mult, 2),
                    duration_hours=2.0,
                    travel_tip="Start early before tour groups arrive."
                ))
                afternoon_acts.append(Activity(
                    time_slot="afternoon",
                    title=f"{interests_str} Exploration & Local Quarter",
                    description=f"Tailored activity focusing on {interests_str.lower()} and vibrant local neighborhoods.",
                    location=f"Central District, {req.destination.title()}",
                    category="adventure" if "adventure" in [i.lower() for i in req.interests] else "sightseeing",
                    estimated_cost=round(25.0 * cost_mult, 2),
                    duration_hours=2.5,
                    travel_tip="Keep a digital offline map downloaded for easy navigation."
                ))
                evening_acts.append(Activity(
                    time_slot="evening",
                    title=f"{'Romantic Sunset Viewpoint' if req.traveler_type == 'couple' else 'Scenic Waterfront Walk'}",
                    description="Unwind with panoramic city vistas followed by atmospheric ambient evening strolls.",
                    location=f"Skyline Promenade, {req.destination.title()}",
                    category="leisure",
                    estimated_cost=0.0,
                    duration_hours=2.0,
                    travel_tip="Great spot for memorable photos as the city lights turn on."
                ))

                day_dining = [
                    DiningSpot(
                        name=f"Trattoria & Bistro {req.destination.title()}",
                        cuisine="Regional Specialties",
                        price_range="$$" if req.budget_tier == "moderate" else ("$" if req.budget_tier == "budget" else "$$$$"),
                        description=f"Beloved local eatery renowned for authentic regional dishes and fresh ingredients.",
                        recommended_dish="Chef's Seasonal Catch or Pasta",
                        meal_type="lunch"
                    ),
                    DiningSpot(
                        name=f"The {req.destination.title()} Terrace Lounge",
                        cuisine="Modern Fusion & Tapas",
                        price_range="$$$" if req.budget_tier == "luxury" else "$$",
                        description="Vibrant ambiance with scenic views, perfect for unwinding after a day of discovery.",
                        recommended_dish="Artisanal Sharing Platter",
                        meal_type="dinner"
                    )
                ]

            day_act_cost = sum(a.estimated_cost for a in (morning_acts + afternoon_acts + evening_acts)) * people_count
            est_dining_daily = (45.0 * cost_mult) * people_count

            total_activity_cost += day_act_cost
            total_dining_cost += est_dining_daily

            days_list.append(DayPlan(
                day_number=day_num,
                date=current_date,
                theme=day_theme,
                morning=morning_acts,
                afternoon=afternoon_acts,
                evening=evening_acts,
                dining_recommendations=day_dining,
                accommodation_suggestion=acc_template,
                logistics_notes="Convenient walking route between sights; metro/cab recommended for evening return.",
                estimated_daily_cost=round(day_act_cost + est_dining_daily + daily_lodging, 2)
            ))

        total_lodging_cost = round(daily_lodging * days_count, 2)
        total_transit_cost = round((15.0 * cost_mult * people_count) * days_count, 2)
        overall_total = round(total_lodging_cost + total_dining_cost + total_activity_cost + total_transit_cost, 2)

        cost_bd = CostBreakdown(
            accommodations=total_lodging_cost,
            dining=round(total_dining_cost, 2),
            activities=round(total_activity_cost, 2),
            local_transit=total_transit_cost,
            total=overall_total,
            currency="USD"
        )

        return Itinerary(
            title=title,
            destination=req.destination.title(),
            start_date=req.start_date,
            end_date=req.end_date,
            total_days=days_count,
            traveler_type=req.traveler_type,
            group_size=req.group_size,
            budget_tier=req.budget_tier,
            pace=req.pace,
            interests=req.interests,
            days=days_list,
            cost_breakdown=cost_bd,
            status="saved"
        )

    def regenerate_day(self, trip: Itinerary, day_number: int, preference_override: Optional[str] = None) -> DayPlan:
        """
        Regenerate activities for a single day while retaining overall trip context.
        """
        target_day = None
        for d in trip.days:
            if d.day_number == day_number:
                target_day = d
                break
        if not target_day:
            raise ValueError(f"Day {day_number} not found in trip {trip.id}")

        dest_key = trip.destination.strip().lower()
        matched_dest = None
        for k in DESTINATION_KNOWLEDGE:
            if k in dest_key or dest_key in k:
                matched_dest = DESTINATION_KNOWLEDGE[k]
                break

        cost_mult, people_count = self._calculate_cost_multipliers(trip.budget_tier, trip.traveler_type, trip.group_size)

        # Alter themes and activities
        new_theme = f"Alternative Discovery: {preference_override or 'Hidden Gems & Local Spots'}"

        if matched_dest:
            pool = matched_dest["sights"]
            # pick offset sights
            offset = (day_number * 3 + 2) % len(pool)
            s1 = pool[offset]
            s2 = pool[(offset + 1) % len(pool)]
            s3 = pool[(offset + 2) % len(pool)]

            m = [Activity(time_slot="morning", title=s1[0], description=s1[1], location=s1[2], category=s1[4], estimated_cost=round(s1[3] * cost_mult, 2), duration_hours=2.0, travel_tip=s1[5])]
            a = [Activity(time_slot="afternoon", title=s2[0], description=s2[1], location=s2[2], category=s2[4], estimated_cost=round(s2[3] * cost_mult, 2), duration_hours=2.5, travel_tip=s2[5])]
            e = [Activity(time_slot="evening", title=s3[0], description=s3[1], location=s3[2], category=s3[4], estimated_cost=round(s3[3] * cost_mult, 2), duration_hours=2.0, travel_tip=s3[5])]
        else:
            m = [Activity(time_slot="morning", title=f"Morning Artisan Walk in {trip.destination}", description="Explore boutique ateliers, local coffee roasteries, and quiet historic alleys.", location=f"Art District, {trip.destination}", category="leisure", estimated_cost=round(10.0 * cost_mult, 2), duration_hours=2.0)]
            a = [Activity(time_slot="afternoon", title=f"Curated {preference_override or 'Scenic Experience'}", description="Tailored excursion uncovering hidden local favorites away from main crowds.", location=f"Riverside / Gardens, {trip.destination}", category="sightseeing", estimated_cost=round(20.0 * cost_mult, 2), duration_hours=2.5)]
            e = [Activity(time_slot="evening", title=f"Evening Twilight Gathering & Rooftop Lounge", description="Sip locally inspired drinks while watching the city illumination.", location=f"Panoramic Viewpoint, {trip.destination}", category="leisure", estimated_cost=round(15.0 * cost_mult, 2), duration_hours=2.0)]

        day_act_cost = sum(act.estimated_cost for act in (m + a + e)) * people_count
        est_dining = (45.0 * cost_mult) * people_count
        nightly_lodging = target_day.accommodation_suggestion.nightly_rate_est if target_day.accommodation_suggestion else 150.0

        new_day = DayPlan(
            day_number=day_number,
            date=target_day.date,
            theme=new_theme,
            morning=m,
            afternoon=a,
            evening=e,
            dining_recommendations=target_day.dining_recommendations,
            accommodation_suggestion=target_day.accommodation_suggestion,
            logistics_notes="Refreshed schedule: pedestrian-friendly sequence with minimal transit transfers.",
            estimated_daily_cost=round(day_act_cost + est_dining + nightly_lodging, 2)
        )
        return new_day

ai_service = AIService()

