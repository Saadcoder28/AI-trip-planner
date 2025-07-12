import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function Trips() {
  const [trips, setTrips]         = useState([]);
  const [searchQuery, setSearch]  = useState("");
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [user, setUser]           = useState(null);

  // listen for auth & fetch
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (!u) {
        setError("Please log in");
        setLoading(false);
        return;
      }
      setUser(u);
      await fetchTrips(u.uid);
    });
    return unsub;
  }, []);

  async function fetchTrips(uid) {
    try {
      const q = query(
        collection(db, "users", uid, "trips"),
        orderBy("timestamp", "desc")
      );
      const qs = await getDocs(q);
      setTrips(
        qs.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          timestamp: d.data().timestamp?.toDate() ?? new Date(),
        }))
      );
    } catch (e) {
      console.error(e);
      setError("Failed to load trips");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTrip(id) {
    if (!user || !confirm("Delete this trip permanently?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "trips", id));
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      console.error(e);
      alert("Delete failed. See console.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-700">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  const filtered = trips.filter((t) =>
    t.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">
      <div className="max-w-6xl mx-auto p-6 mt-8">
        {/* Title + New-Trip button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">My Trips</h1>
          <Link
            to="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Plan New Trip
          </Link>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination…"
            className="w-full p-3 pl-10 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-3.5 text-gray-400"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 
              10-1.398 1.398l3.85 3.85a1 1 0 
              001.415-1.414l-3.85-3.85zM12 
              6.5a5.5 5.5 0 11-11 0 5.5 5.5 
              0 0111 0z"
            />
          </svg>
        </div>

        {/* Trip cards */}
        {filtered.length === 0 ? (
          <p className="text-center py-20 bg-white rounded-lg shadow-lg">
            {trips.length
              ? "No matches found."
              : "You haven’t created any trips yet."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((trip) => (
              <div
                key={trip.id}
                className="relative bg-white rounded-lg shadow-lg group overflow-hidden"
              >
                <button
                  onClick={() => deleteTrip(trip.id)}
                  className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-red-600 hover:text-white p-1 rounded-full transition"
                  title="Delete trip"
                >
                  🗑
                </button>

                <Link to={`/trip/${trip.id}`} className="block">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        trip.images?.main ||
                        `https://source.unsplash.com/600x400/?${encodeURIComponent(
                          trip.destination
                        )}`
                      }
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-bold">
                      {trip.destination}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Created: {trip.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
