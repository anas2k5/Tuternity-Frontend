// src/pages/StudentBookings.jsx
import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");

    // use safe getter
    const profile = getJSON("profile");
    const studentId = profile?.id;

    if (!studentId) {
      // if no student id, don't attempt to load (maybe user not logged in)
      setBookings([]);
      setLoading(false);
      return;
    }

    api
      .get(`/bookings/student/${studentId}`)
      .then((res) => {
        if (!mounted) return;
        setBookings(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load bookings:", err);
        if (!mounted) return;
        setError("Failed to load bookings. Try again later.");
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 border rounded shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{b.teacher?.user?.name || "Teacher"}</h2>
                  <p>Subject: {b.teacher?.subject || "-"}</p>
                  <p>Skills: {b.teacher?.skills || "-"}</p>
                  <p>
                    Slot: {b.date} | {b.timeSlot}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-3 py-1 rounded ${
                      b.status === "CONFIRMED" ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
