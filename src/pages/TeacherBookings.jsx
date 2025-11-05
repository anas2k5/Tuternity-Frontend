import React, { useEffect, useState } from "react";
import api from "../api"; // ✅ authenticated axios instance

const TeacherBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "/bookings/teacher";

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Fetch teacher’s bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const teacherRes = await api.get("/teachers/me"); // Get logged-in teacher profile
      const teacherId = teacherRes.data.id;

      const response = await api.get(`${API_URL}/${teacherId}`);
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching teacher bookings:", error);
      alert("Failed to load bookings!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cancel a booking (by teacher)
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.delete(`/bookings/teacher/cancel/${bookingId}`);
      alert("Booking cancelled successfully!");
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">No bookings yet.</p>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time Slot</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{b.studentName || "-"}</td>
                <td className="p-3">{b.studentEmail || "-"}</td>
                <td className="p-3">{b.date}</td>
                <td className="p-3">{b.timeSlot}</td>
                <td
                  className={`p-3 font-medium ${
                    b.status === "CONFIRMED"
                      ? "text-green-600"
                      : b.status === "CANCELLED" ||
                        b.status === "CANCELLED_BY_TEACHER"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {b.status.replaceAll("_", " ")}
                </td>
                <td className="p-3">
                  {b.status === "CONFIRMED" ? (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TeacherBookings;
