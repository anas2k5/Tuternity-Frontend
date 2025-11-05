import React, { useEffect, useState } from "react";
import api from "../api";
import dayjs from "dayjs";
import Navbar from "../components/Navbar";

const TeacherBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/teacher/me");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Error fetching teacher bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const today = dayjs();
  const upcoming = bookings.filter((b) => dayjs(b.date).isAfter(today, "day"));
  const past = bookings.filter((b) => dayjs(b.date).isBefore(today, "day"));

  if (loading) {
    return <p className="text-center text-gray-600 mt-10">Loading bookings...</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md mt-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Bookings</h2>

        {/* --- Upcoming Sessions --- */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-green-700 mb-3">
            Upcoming Sessions
          </h3>
          {upcoming.length === 0 ? (
            <p className="text-gray-500">No upcoming bookings.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b) => (
                <div
                  key={b.id}
                  className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-green-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      👩‍🎓 Student: {b.studentName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">{b.studentEmail}</p>
                    <p className="text-sm text-gray-600">
                      📅 {b.date} | 🕒 {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      b.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Past Sessions --- */}
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-3">
            Past Sessions
          </h3>
          {past.length === 0 ? (
            <p className="text-gray-500">No past bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {past.map((b) => (
                <div
                  key={b.id}
                  className="border border-gray-200 p-4 rounded-lg flex justify-between items-center hover:bg-blue-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      👩‍🎓 Student: {b.studentName || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">{b.studentEmail}</p>
                    <p className="text-sm text-gray-600">
                      📅 {b.date} | 🕒 {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      b.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherBookings;
