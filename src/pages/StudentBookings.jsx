import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = () => {
    setLoading(true);
    setError("");
    const profile = getJSON("profile");
    const studentId = profile?.id;

    if (!studentId) {
      setBookings([]);
      setLoading(false);
      return;
    }

    api
      .get(`/bookings/student/${studentId}`)
      .then((res) => setBookings(res.data || []))
      .catch(() => setError("Failed to load bookings. Try again later."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      alert("Booking has been successfully cancelled.");
      fetchBookings();
    } catch (err) {
      alert("Cancellation failed: " + (err.response?.data?.message || "Server error."));
    }
  };

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
            {bookings.map((b, i) => (
              <div
                key={b.id || i}
                className="p-4 border rounded shadow flex justify-between items-center"
              >
                <div>
                  <h2 className="font-semibold">{b.teacherName || "Teacher"}</h2>
                  <p>Subject: {b.subject || "-"}</p>
                  <p>Skills: {b.skills || "-"}</p>
                  <p>Slot: {b.date || "-"} {b.timeSlot ? `| ${b.timeSlot}` : ""}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded ${
                      b.status === "CONFIRMED"
                        ? "bg-green-500 text-white"
                        : "bg-gray-500 text-white"
                    }`}
                  >
                    {b.status || "CONFIRMED"}
                  </span>

                  {b.status === "CONFIRMED" && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
