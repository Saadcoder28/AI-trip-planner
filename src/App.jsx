// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { LoadScript } from "@react-google-maps/api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TripForm from "./components/TripForm";
import Trips from "./pages/Trips";
import ViewTrip from "./pages/ViewTrip";
import { auth } from "./firebase";

export default function App() {
  const [user, setUser] = useState(undefined);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId;

    // Only validate tokens on initial app load to detect stale sessions
    const checkStaleSession = async () => {
      if (auth.currentUser) {
        try {
          // Try to refresh the token to validate session
          await auth.currentUser.getIdToken(true);
          console.log("Auth session is valid");
          if (mounted) setUser(auth.currentUser);
        } catch (error) {
          console.log("Stale session detected, signing out");
          // Session is stale/expired, sign out the user
          await signOut(auth);
          if (mounted) setUser(null);
        }
      }
    };

    // Check for stale session ONLY on initial load
    checkStaleSession();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (mounted) {
        // Don't validate here - just trust the auth state change
        // This prevents logging out active users
        setUser(currentUser);
        setAuthTimeout(false);
      }
    });

    // Fallback timeout for slow connections
    timeoutId = setTimeout(() => {
      if (mounted && user === undefined) {
        console.log("Auth timeout reached, continuing without auth");
        setAuthTimeout(true);
        setUser(null);
      }
    }, 4000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (window.google?.maps?.places) {
      setMapsLoaded(true);
    }
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  // Show loading only if user is undefined AND timeout hasn't been reached
  if (user === undefined && !authTimeout) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  const renderHomePage = () => (
    <>
      <Hero />
      <div className="w-full max-w-3xl mx-auto -mt-4 px-4">
        {user ? (
          <TripForm
            user={user}
            onSubmit={(destination) => {
              console.log("TripForm onSubmit got:", destination);
            }}
          />
        ) : (
          <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to plan your adventure?</h2>
            <p className="text-gray-300 mb-8 text-lg">Sign in to create personalized AI-powered trip itineraries</p>
            
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className={`inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 ${
                loginLoading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              }`}
            >
              {loginLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            <div className="mt-6 text-sm text-gray-400">
              Sign in to save your trips and access them anywhere
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header user={user} setUser={setUser} />

      {!mapsLoaded ? (
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
          onLoad={() => setMapsLoaded(true)}
          onError={() => setMapsLoaded(true)}
        >
          <Routes>
            <Route path="/" element={renderHomePage()} />
            <Route path="/trips" element={<Trips user={user} />} />
            <Route path="/trip/:id" element={<ViewTrip user={user} />} />
          </Routes>
        </LoadScript>
      ) : (
        <Routes>
          <Route path="/" element={renderHomePage()} />
          <Route path="/trips" element={<Trips user={user} />} />
          <Route path="/trip/:id" element={<ViewTrip user={user} />} />
        </Routes>
      )}
    </div>
  );
}