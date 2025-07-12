import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

export default function ViewTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [user, setUser]         = useState(null);
  const [notes, setNotes]       = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved]   = useState(false);

  // auth + fetch
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      if (u) fetchTrip(u.uid);
      else setLoading(false);
    });
    return unsub;
  }, [id]);

  async function fetchTrip(uid) {
    try {
      const ref = doc(db, "users", uid, "trips", id);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setError("Trip not found");
        return;
      }
      const data = snap.data();
      setTrip({
        id: snap.id,
        ...data,
        timestamp: data.timestamp?.toDate() ?? new Date(),
      });
      setNotes(data.notes || "");
    } catch (e) {
      console.error(e);
      setError("Failed to load trip details");
    } finally {
      setLoading(false);
    }
  }

  async function saveNotes() {
    if (!user) return;
    setSavingNotes(true);
    try {
      await updateDoc(doc(db, "users", user.uid, "trips", id), { notes });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2500);
    } catch (e) {
      console.error(e);
      alert("Could not save notes");
    } finally {
      setSavingNotes(false);
    }
  }

  async function deleteTrip() {
    if (!user || !confirm("Delete this trip permanently?")) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "trips", id));
      navigate("/trips");
    } catch (e) {
      console.error(e);
      alert("Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
        <div className="max-w-lg mx-auto mt-20 p-6 bg-white/90 rounded-lg text-center shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">
            {error || "Trip not found"}
          </h2>
          <Link
            to="/trips"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to My Trips
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 mt-8">
        {/* title & back */}
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/trips"
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-blue-600">
              {trip.destination}
            </h1>
          </div>
          <button
            onClick={deleteTrip}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Delete Trip
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Itinerary + Notes */}
          <div className="space-y-6 lg:col-span-2">
            <section className="bg-white/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Trip Itinerary
              </h2>
              <pre className="whitespace-pre-wrap text-sm">
                {trip.itinerary}
              </pre>
            </section>

            <section className="bg-white/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Your Notes
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add personal notes…"
                className="w-full h-40 p-3 rounded-lg bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {savingNotes ? "Saving…" : "Save Notes"}
              </button>
              {notesSaved && (
                <span className="ml-3 text-green-600">✓ Saved</span>
              )}
            </section>
          </div>

          {/* Details + Photos */}
          <div className="space-y-6">
            <section className="bg-white/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">
                Trip Details
              </h2>
              <p>
                <strong>Destination:</strong> {trip.destination}
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {trip.timestamp.toLocaleDateString()}
              </p>
            </section>

            <section className="bg-white/90 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                📸 <span className="ml-2">Destination Photos</span>
              </h2>
              <div className="space-y-3">
                {trip.images?.main && (
                  <img
                    src={trip.images.main}
                    alt="Destination"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://source.unsplash.com/600x400/?travel";
                    }}
                  />
                )}
                {trip.images?.travel && (
                  <img
                    src={trip.images.travel}
                    alt="Extra"
                    className="w-full h-40 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://source.unsplash.com/600x400/?adventure";
                    }}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
