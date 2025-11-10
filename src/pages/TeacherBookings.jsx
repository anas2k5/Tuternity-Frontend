import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  BookOpen,
  Link as LinkIcon,
  Copy,
  Save,
} from "lucide-react";

export default function TeacherBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const profile = getJSON("profile");
      const teacherId = profile?.id;
      if (!teacherId) {
        toast.error("Teacher profile not found.");
        setLoading(false);
        return;
      }
      const res = await api.get(`/bookings/teacher/${teacherId}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      setUpdating(id);
      await api.delete(`/bookings/teacher/cancel/${id}`);
      toast.success("Booking cancelled.");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel.");
    } finally {
      setUpdating(null);
    }
  };

  const handleConfirm = async (id) => {
    try {
      setUpdating(id);
      await api.put(`/bookings/${id}/confirm`);
      toast.success("Booking confirmed.");
      fetchBookings();
    } catch {
      toast.error("Failed to confirm.");
    } finally {
      setUpdating(null);
    }
  };

  const handleSaveLink = async () => {
    if (!meetingLink.trim()) return toast.error("Enter a valid meeting link.");
    try {
      setUpdating(editingBooking?.id);
      await api.put(`/bookings/${editingBooking.id}/meeting-link`, {
        meetingLink,
      });
      toast.success("Meeting link updated!");
      setEditingBooking(null);
      setMeetingLink("");
      fetchBookings();
    } catch {
      toast.error("Failed to save meeting link.");
    } finally {
      setUpdating(null);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-3xl font-extrabold mb-8 flex items-center gap-2"
        >
          <BookOpen size={26} /> My Student Bookings
        </motion.h1>

        {loading ? (
          <p className="text-white/90 italic">Loading...</p>
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
            <table className="w-full table-auto text-sm">
              <thead className="bg-white/20 text-white uppercase font-semibold">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Meeting / Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, i) => (
                  <motion.tr
                    key={b.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-white/10 hover:bg-white/10 transition-all"
                  >
                    <td className="p-3">{b.studentName || "-"}</td>
                    <td className="p-3">{b.studentEmail || "-"}</td>
                    <td className="p-3">{b.date || "-"}</td>
                    <td className="p-3">{b.timeSlot || "-"}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          b.status === "PAID"
                            ? "bg-green-500/30 text-green-200"
                            : b.status === "COMPLETED"
                            ? "bg-blue-500/30 text-blue-200"
                            : b.status === "CONFIRMED"
                            ? "bg-yellow-500/30 text-yellow-200"
                            : b.status?.includes("CANCELLED")
                            ? "bg-red-500/30 text-red-200"
                            : "bg-gray-400/20 text-gray-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-3">
                      {/* Pending */}
                      {b.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirm(b.id)}
                            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleCancel(b.id)}
                            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      {/* Confirmed or Paid */}
                      {(b.status === "CONFIRMED" || b.status === "PAID") && (
                        <div className="flex gap-2 items-center">
                          {b.meetingLink ? (
                            <>
                              <a
                                href={b.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-300 underline flex items-center gap-1 text-sm"
                              >
                                <LinkIcon size={14} /> Join
                              </a>
                              <button
                                onClick={() => handleCopyLink(b.meetingLink)}
                                className="text-white/80 hover:text-white flex items-center gap-1 text-sm"
                              >
                                <Copy size={14} /> Copy
                              </button>
                              <button
                                onClick={() => {
                                  setEditingBooking(b);
                                  setMeetingLink(b.meetingLink || "");
                                }}
                                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg text-sm"
                              >
                                Edit Link
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => {
                                setEditingBooking(b);
                                setMeetingLink("");
                              }}
                              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                            >
                              <LinkIcon size={14} /> Meeting Link
                            </button>
                          )}
                        </div>
                      )}

                      {/* Completed or Cancelled */}
                      {(b.status === "COMPLETED" ||
                        b.status?.includes("CANCELLED")) && (
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

      {/* 🧩 Meeting Link Modal */}
      <Modal
        show={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        title={
          editingBooking?.meetingLink ? "Edit Meeting Link" : "Add Meeting Link"
        }
      >
        <input
          type="text"
          placeholder="Enter meeting link..."
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setEditingBooking(null)}
            className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveLink}
            disabled={updating === editingBooking?.id}
            className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
