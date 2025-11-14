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
    } catch {
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

  const handleComplete = async (id) => {
    try {
      setUpdating(id);
      await api.put(`/bookings/${id}/complete`);
      toast.success("Marked as completed!");
      fetchBookings();
    } catch {
      toast.error("Failed to update.");
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
      toast.error("Failed to save link.");
    } finally {
      setUpdating(null);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen bg-landing-light dark:bg-landing-dark transition duration-500 text-gray-900 dark:text-gray-100">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto pb-16">
        <motion.h1
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-3xl font-extrabold mb-8 flex items-center gap-2"
        >
          <BookOpen size={26} className="text-purple-500 dark:text-purple-300" />
          My Student Bookings
        </motion.h1>

        {loading && <p className="text-gray-500 dark:text-gray-300 italic">Loading...</p>}

        {!loading && error && <p className="text-red-400">{error}</p>}

        {!loading && bookings.length === 0 && (
          <p className="text-gray-500 dark:text-gray-300 italic">No bookings found.</p>
        )}

        {!loading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden"
          >
            <table className="w-full text-sm">
              <thead className="bg-white/40 dark:bg-white/10 text-gray-700 dark:text-gray-200 font-semibold uppercase">
                <tr>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b, i) => (
                  <motion.tr
                    key={b.id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-t border-gray-200/20 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                  >
                    <td className="p-3">{b.studentName}</td>
                    <td className="p-3">{b.studentEmail}</td>
                    <td className="p-3">{b.date}</td>
                    <td className="p-3">{b.timeSlot}</td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          b.status === "COMPLETED"
                            ? "bg-blue-500/20 text-blue-400"
                            : b.status === "CONFIRMED"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : b.status === "PAID"
                            ? "bg-green-500/20 text-green-400"
                            : b.status.includes("CANCEL")
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-col gap-2">

                        {/* PENDING BUTTONS */}
                        {b.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleConfirm(b.id)}
                              className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-xs text-white"
                            >
                              Confirm
                            </button>

                            <button
                              onClick={() => handleCancel(b.id)}
                              className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-xs text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {/* CONFIRMED / PAID */}
                        {(b.status === "CONFIRMED" || b.status === "PAID") && (
                          <div className="flex flex-col gap-2">

                            {/* --- Meeting Controls --- */}
                            <div className="flex gap-2 items-center">

                              {b.meetingLink ? (
                                <>
                                  {/* JOIN */}
                                  <a
                                    href={b.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-500/20 dark:bg-blue-500/20 text-blue-500 dark:text-blue-300 hover:bg-blue-500/30 transition"
                                  >
                                    <LinkIcon size={14} /> Join
                                  </a>

                                  {/* COPY */}
                                  <button
                                    onClick={() => handleCopyLink(b.meetingLink)}
                                    className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-gray-500/20 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 hover:bg-gray-500/30 transition"
                                  >
                                    <Copy size={14} /> Copy
                                  </button>

                                  {/* EDIT LINK */}
                                  <button
                                    onClick={() => {
                                      setEditingBooking(b);
                                      setMeetingLink(b.meetingLink);
                                    }}
                                    className="px-3 py-1 rounded-full text-xs bg-blue-600 hover:bg-blue-700 text-white"
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
                                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <LinkIcon size={14} /> Add Link
                                </button>
                              )}
                            </div>

                            {/* MARK COMPLETED */}
                            <button
                              onClick={() => handleComplete(b.id)}
                              disabled={updating === b.id}
                              className={`px-3 py-1 rounded-lg text-sm text-white bg-green-600 hover:bg-green-700 ${
                                updating === b.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Mark Completed
                            </button>
                          </div>
                        )}

                        {/* COMPLETED OR CANCELLED */}
                        {(b.status === "COMPLETED" || b.status.includes("CANCEL")) && (
                          <span className="text-gray-400 text-xs italic">
                            No Actions
                          </span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* MEETING LINK MODAL */}
      <Modal
        show={!!editingBooking}
        onClose={() => setEditingBooking(null)}
        title={editingBooking?.meetingLink ? "Edit Meeting Link" : "Add Meeting Link"}
      >
        <input
          type="text"
          value={meetingLink}
          onChange={(e) => setMeetingLink(e.target.value)}
          placeholder="Enter meeting link..."
          className="w-full border rounded-lg px-3 py-2 text-sm mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditingBooking(null)}
            className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveLink}
            className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            <Save size={14} /> Save
          </button>
        </div>
      </Modal>
    </div>
  );
}
