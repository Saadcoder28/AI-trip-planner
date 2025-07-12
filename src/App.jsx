// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Tripform from "./components/Tripform";  // ← corrected import
import Trips from "./pages/Trips";
import ViewTrip from "./pages/ViewTrip";
import { auth } from "./firebase";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state, then hide the loading screen
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header user={user} setUser={setUser} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              {user && (
                <Tripform               // ← corrected usage
                  onSubmit={(destination) => {
                    console.log("Searching for:", destination);
                  }}
                />
              )}
            </>
          }
        />

        <Route path="/trips" element={<Trips />} />
        <Route path="/trip/:id" element={<ViewTrip />} />
      </Routes>
    </div>
  );
}
