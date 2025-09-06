// src/components/Header.jsx
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Header({ user, setUser }) {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8">
        {/* Left - My Trips (moved further left) */}
        <div className="flex-1">
          {user && (
            <Link 
              to="/trips" 
              className={`text-lg font-medium transition ${
                location.pathname === "/trips" ? "text-red-500" : "hover:text-red-400"
              }`}
            >
              My Trips
            </Link>
          )}
        </div>

        {/* Center - Home */}
        <div className="flex-1 text-center">
          <Link 
            to="/" 
            className={`text-lg font-medium transition ${
              location.pathname === "/" ? "text-red-500" : "hover:text-red-400"
            }`}
          >
            Home
          </Link>
        </div>

        {/* Right - Logout (moved further right) */}
        <div className="flex-1 text-right">
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}