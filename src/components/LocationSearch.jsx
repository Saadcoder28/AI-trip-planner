import { useState, useEffect, useRef } from "react";


export default function LocationSearch({ onSelect }) {
  const [query, setQuery]               = useState("");
  const [suggestions, setSuggestions]   = useState([]);
  const [showSuggestions, setShowSuggs] = useState(false);
  const inputRef                        = useRef(null);

  /* flag toggles once Maps JS API w/ Places has loaded */
  const [placesLoaded, setPlacesLoaded] = useState(false);

  /* fallback list for “type-ahead” */
  const POPULAR = [
    "Paris, France",
    "Tokyo, Japan",
    "New York, USA",
    "Rome, Italy",
    "London, UK",
    "Barcelona, Spain",
    "Sydney, Australia",
    "Dubai, UAE",
    "Bangkok, Thailand",
    "Rio de Janeiro, Brazil",
    "Amsterdam, Netherlands",
    "Istanbul, Turkey",
    "Prague, Czech Republic",
    "Bali, Indonesia",
    "Cape Town, South Africa",
    "San Francisco, USA",
    "Venice, Italy",
    "Hong Kong",
    "Singapore",
    "Marrakech, Morocco",
    "Kyoto, Japan",
    "Berlin, Germany",
    "Vienna, Austria",
  ];

  /* ————————————————————————————————————————————————————— */
  /* initialise Google Places Autocomplete (if available) */
  /* ————————————————————————————————————————————————————— */
  useEffect(() => {
    const attemptInit = () => {
      if (window.google?.maps?.places) {
        setPlacesLoaded(true);
        initAutocomplete();
      }
    };

    /* try now, then once more after 1 s in case script loads late */
    attemptInit();
    const t = setTimeout(attemptInit, 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["(cities)"],
        fields: ["formatted_address", "geometry", "name", "place_id"],
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return; // skip if no geometry

      /* update field text & propagate selection */
      setQuery(place.formatted_address || place.name);
      onSelect({
        name: place.name,
        formatted_address: place.formatted_address || place.name,
        place_id: place.place_id,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      });
    });
  };

  /* ————————————————————————————————————————————————————— */
  /* fallback suggestion logic (no Google Places)          */
  /* ————————————————————————————————————————————————————— */
  const handleInput = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!placesLoaded && val.length > 1) {
      const filtered = POPULAR.filter((d) =>
        d.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggs(true);
    } else {
      setSuggestions([]);
      setShowSuggs(false);
    }
  };

  const pickSuggestion = (dest) => {
    setQuery(dest);
    setShowSuggs(false);
    onSelect({ name: dest, formatted_address: dest });
  };

  /* ————————————————————————————————————————————————————— */
  /* render                                                */
  /* ————————————————————————————————————————————————————— */
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInput}
        placeholder="Enter destination (e.g., Paris, Tokyo, New York)…"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white shadow-sm \
focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      {/* fallback suggestions */}
      {!placesLoaded && showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-lg border shadow-lg max-h-60 overflow-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => pickSuggestion(s)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
