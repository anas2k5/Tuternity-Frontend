import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const [latestBooking, setLatestBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLatestBooking = async () => {
    try {
      const profile = getJSON("profile");
      const studentId = profile?.id;
      if (!studentId) {
        setLoading(false);
        return;
      }

      const res = await api.get(`/bookings/student/${studentId}`);
      const bookings = res.data || [];

      if (bookings.length > 0) {
        const sorted = bookings.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setLatestBooking(sorted[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch latest booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBooking();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎓 Welcome to Your Dashboard</h1>

        {loading ? (
          <p>Loading your latest booking...</p>
        ) : latestBooking ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">
              📅 Latest Booking Summary
            </h2>
            <p>
              <strong>Teacher:</strong> {latestBooking.teacherName}
            </p>
            <p>
              <strong>Subject:</strong> {latestBooking.subject}
            </p>
            <p>
              <strong>Date:</strong> {latestBooking.date || "-"}
            </p>
            <p>
              <strong>Time Slot:</strong> {latestBooking.timeSlot || "-"}
            </p>

            <div className="mt-3">
              <span
                className={`inline-block px-3 py-1 text-sm rounded font-medium ${
                  latestBooking.status === "PAID"
                    ? "bg-green-600 text-white"
                    : latestBooking.status === "PENDING"
                    ? "bg-yellow-500 text-white"
                    : latestBooking.status?.includes("CANCELLED")
                    ? "bg-gray-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {latestBooking.status}
              </span>
            </div>

            <div className="mt-4">
              <button
                onClick={() => navigate("/student/bookings")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View All Bookings
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p>You have no recent bookings yet.</p>
            <button
              onClick={() => navigate("/student/teachers")}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Find a Teacher
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
