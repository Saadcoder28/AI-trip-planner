import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Header from "./components/Header";
import Hero   from "./components/Hero";
import TripForm from "./components/TripForm";
import Trips     from "./pages/Trips";
import ViewTrip  from "./pages/ViewTrip";

export default function App() {
  const [user,   setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
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
        <Route
          path="/"
          element={
            <>
              <Hero user={user} />
              {user && (
                <div className="mt-10 max-w-3xl mx-auto">
                  <TripForm user={user} />
                </div>
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
