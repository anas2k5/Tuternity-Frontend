import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { BookOpen, Clock, User, Mail, Calendar, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold mb-8 flex items-center gap-2"
        >
          <BookOpen size={26} /> My Student Bookings
        </motion.h1>

        {loading ? (
          <p className="text-white/90 italic">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-300">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-white/80 italic">No bookings found.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden"
          >
            <table className="w-full table-auto">
              <thead className="bg-white/20 text-white uppercase text-sm font-semibold">
                <tr>
                  <th className="p-3 text-left"><User size={16} className="inline mr-1" /> Student</th>
                  <th className="p-3 text-left"><Mail size={16} className="inline mr-1" /> Email</th>
                  <th className="p-3 text-left"><Calendar size={16} className="inline mr-1" /> Date</th>
                  <th className="p-3 text-left"><Clock size={16} className="inline mr-1" /> Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <motion.tr
                    key={b.id || i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-t border-white/10 hover:bg-white/10 transition-all"
                  >
                    <td className="p-3">{b.studentName || "-"}</td>
                    <td className="p-3">{b.studentEmail || "-"}</td>
                    <td className="p-3">{b.date || "-"}</td>
                    <td className="p-3">{b.timeSlot || "-"}</td>
                    <td className="p-3 font-semibold">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          b.status === "PAID"
                            ? "bg-green-500/30 text-green-200"
                            : b.status === "COMPLETED"
                            ? "bg-blue-500/30 text-blue-200"
                            : b.status?.includes("CANCELLED")
                            ? "bg-red-500/30 text-red-200"
                            : "bg-gray-400/20 text-gray-200"
                        }`}
                      >
                        {b.status?.replaceAll("_", " ") || "UNKNOWN"}
                      </span>
                    </td>
                    <td className="p-3">
                      {b.status === "PAID" && (
                        <button
                          onClick={() => handleComplete(b.id)}
                          disabled={updating === b.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                            updating === b.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          } transition-all text-white`}
                        >
                          <CheckCircle2 size={14} />
                          {updating === b.id ? "Updating..." : "Mark Completed"}
                        </button>
                      )}

                      {b.status === "PENDING" && (
                        <button
                          onClick={() => handleCancel(b.id)}
                          disabled={updating === b.id}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${
                            updating === b.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          } transition-all text-white`}
                        >
                          <XCircle size={14} />
                          {updating === b.id ? "Cancelling..." : "Cancel"}
                        </button>
                      )}

                      {(b.status?.includes("CANCELLED") ||
                        b.status === "COMPLETED") && (
                        <span className="text-white/60 italic">N/A</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}
