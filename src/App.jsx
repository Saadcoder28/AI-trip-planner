// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route }          from "react-router-dom";
import { onAuthStateChanged }     from "firebase/auth";
import { LoadScript }             from "@react-google-maps/api";
import Header                     from "./components/Header";
import Hero                       from "./components/Hero";
import TripForm                   from "./components/TripForm";  // note the exact casing
import Trips                      from "./pages/Trips";
import ViewTrip                   from "./pages/ViewTrip";
import { auth }                   from "./firebase";

export default function App() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      Loading…
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            {user && (
              <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                libraries={["places"]}
              >
                <TripForm
                  user={user}
                  onSubmit={(destination) => {
                    console.log("TripForm onSubmit got:", destination);
                  }}
                />
              </LoadScript>
            )}
          </>
        }/>

        <Route path="/trips" element={<Trips user={user} />} />
        <Route path="/trip/:id" element={<ViewTrip user={user} />} />
      </Routes>
    </div>
  );
}
