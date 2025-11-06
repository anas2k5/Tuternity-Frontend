import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";

export default function TeacherBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);

  // ✅ Fetch all teacher bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError("");

    try {
      const profile = getJSON("profile");
      const teacherId = profile?.id;

      if (!teacherId) {
        toast.error("Teacher profile not found. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await api.get(`/bookings/teacher/${teacherId}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching teacher bookings:", err);
      setError("Failed to load bookings.");
      toast.error("Unable to fetch bookings. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Cancel booking
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      setUpdating(bookingId);
      await api.delete(`/bookings/teacher/${bookingId}`);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      console.error("❌ Error cancelling booking:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setUpdating(null);
    }
  };

  // ✅ Mark as completed
  const handleComplete = async (bookingId) => {
    try {
      setUpdating(bookingId);
      await api.put(`/bookings/${bookingId}/complete`);
      toast.success("Booking marked as completed.");
      fetchBookings();
    } catch (err) {
      console.error("❌ Error marking complete:", err);
      toast.error("Failed to update booking status.");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Student Bookings</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white rounded-lg shadow">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
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
                {bookings.map((b, i) => (
                  <tr
                    key={b.id || i}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="p-3">{b.studentName || "-"}</td>
                    <td className="p-3">{b.studentEmail || "-"}</td>
                    <td className="p-3">{b.date || "-"}</td>
                    <td className="p-3">{b.timeSlot || "-"}</td>
                    <td
                      className={`p-3 font-semibold ${
                        b.status === "PAID"
                          ? "text-green-600"
                          : b.status === "COMPLETED"
                          ? "text-blue-600"
                          : b.status?.includes("CANCELLED")
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {b.status?.replaceAll("_", " ") || "UNKNOWN"}
                    </td>
                    <td className="p-3">
                      {b.status === "PAID" && (
                        <button
                          onClick={() => handleComplete(b.id)}
                          disabled={updating === b.id}
                          className={`px-3 py-1 rounded text-white ${
                            updating === b.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {updating === b.id
                            ? "Updating..."
                            : "Mark as Completed"}
                        </button>
                      )}

                      {b.status === "PENDING" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={updating === b.id}
                          className={`px-3 py-1 rounded text-white ${
                            updating === b.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {updating === b.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}

                      {b.status?.includes("CANCELLED") ||
                      b.status === "COMPLETED" ? (
                        <span className="text-gray-500">N/A</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
