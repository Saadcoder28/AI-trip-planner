import { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import LocationSearch from "./LocationSearch";
import usePlacePhotos from "../hooks/usePlacePhotos";

export default function TripForm({ user, onSubmit }) {
  const [destination, setDestination] = useState(null);
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [days, setDays] = useState("");
  const [style, setStyle] = useState("");
  const [companions, setCompanions] = useState("");

  const navigate = useNavigate();
  const { photoUrls = [] } = usePlacePhotos(destination?.place_id);
  const [imgMain, setImgMain] = useState("");
  const [imgTravel, setImgTravel] = useState("");

  useEffect(() => {
    if (!destination) return;
    const name = destination.formatted_address || destination.name;
    const stamp = Date.now();
    
    if (photoUrls.length > 0) {
      setImgMain(photoUrls[0]);
      setImgTravel(photoUrls[1] || photoUrls[0]);
    } else {
      setImgMain(`https://source.unsplash.com/600x400/?${encodeURIComponent(name)}&t=${stamp}`);
      setImgTravel(`https://source.unsplash.com/600x400/?${encodeURIComponent(name + " travel")}&t=${stamp + 1}`);
    }
  }, [destination, photoUrls]);

  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const fetchItinerary = async (place) => {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Create a detailed ${days || 3}-day itinerary for ${place}.
Style: ${style || "any"}, 
Companions: ${companions || "any"}.
Include top attractions, local food, hidden gems, and travel tips. 
Return plain text only — no markdown, no *, **, #, or - symbols.
Use simple day-by-day structure with line breaks only.`
            }]
          }]
        })
      }
    );
    if (!res.ok) throw new Error(`Gemini API responded ${res.status}`);
    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleanText = rawText.replace(/[#*_`~>-]/g, "");
    return cleanText;
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!destination) return setError("Please choose a destination first.");
    setLoading(true);
    setError("");
    try {
      const text = await fetchItinerary(destination.formatted_address || destination.name);
      setItinerary(text);
      onSubmit?.(destination);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return setError("Log in to save trips.");
    try {
      await addDoc(
        collection(db, "users", user.uid, "trips"),
        {
          destination: destination.formatted_address || destination.name,
          itinerary,
          images: { main: imgMain, travel: imgTravel },
          timestamp: serverTimestamp(),
        }
      );
      setSaved(true);
      setTimeout(() => navigate("/trips"), 1500);
    } catch (err) {
      console.error(err);
      setError("Save failed: " + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Where would you like to go?</h2>
      <form onSubmit={handleGenerate} className="space-y-4">
        <LocationSearch onSelect={setDestination} />

        <input
          type="number"
          min={1}
          value={days}
          onChange={(e) => setDays(e.target.value)}
          placeholder="Number of days"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="Style (e.g. luxury, adventure)"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />
        <input
          type="text"
          value={companions}
          onChange={(e) => setCompanions(e.target.value)}
          placeholder="Traveling with? (e.g. solo, family)"
          className="w-full px-4 py-2 rounded bg-gray-700 text-white"
        />

        <button
          type="submit"
          disabled={loading || !destination}
          className={`w-full py-3 rounded-full font-semibold transition
            ${loading || !destination
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"}`}
        >
          {loading ? "Generating…" : "Get trip ideas"}
        </button>
      </form>

      {loading && <p className="text-white pt-2">Loading your itinerary...</p>}
      {error && <p className="mt-4 text-red-400">{error}</p>}

      {itinerary && (
        <div className="mt-6 space-y-4">
          <div className="text-lg text-white whitespace-pre-wrap">{itinerary}</div>

          <button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          >
            Save trip
          </button>
          {saved && <p className="text-green-400 text-center">✅ Saved! Redirecting…</p>}
          
          <div className="grid md:grid-cols-2 gap-4 pt-4">
            <img 
              src={imgMain} 
              alt="Destination" 
              className="w-full h-40 object-cover rounded-lg shadow"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/600x400/374151/ffffff?text=${encodeURIComponent(destination?.name || 'Destination')}`;
              }}
            />
            <img 
              src={imgTravel} 
              alt="Travel" 
              className="w-full h-40 object-cover rounded-lg shadow"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/600x400/374151/ffffff?text=Travel`;
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}