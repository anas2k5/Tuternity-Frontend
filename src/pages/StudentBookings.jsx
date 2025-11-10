import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CreditCard,
  XCircle,
  CheckCircle,
  Clock,
  Link as LinkIcon,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState(null);
  const [joiningMeeting, setJoiningMeeting] = useState(null); // 🆕 for modal

  // ✅ Fetch student bookings
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const profile = getJSON("profile");
      const studentId = profile?.id;
      if (!studentId) {
        setBookings([]);
        setLoading(false);
        return;
      }
      const res = await api.get(`/bookings/student/${studentId}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load bookings:", err);
      setError("Failed to load bookings. Try again later.");
      toast.error("Unable to load bookings. Please refresh.");
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
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      console.error("❌ Cancellation failed:", err);
      toast.error("Failed to cancel booking.");
    }
  };

  // ✅ Stripe payment
  const handlePayment = async (bookingId) => {
    setProcessingPaymentId(bookingId);
    try {
      const response = await api.post(
        `/stripe/create-checkout-session/${bookingId}`
      );
      const { url } = response.data;
      if (url) {
        toast("Redirecting to Stripe Checkout...", { icon: "💳" });
        window.location.href = url;
      } else toast.error("Could not initiate payment. Please try again.");
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error("Payment failed or already completed.");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  // ✅ Copy meeting link
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied!");
  };

  // ✅ Confirm and join meeting
  const handleJoinMeeting = (link) => {
    setJoiningMeeting(link);
  };

  const confirmJoinMeeting = () => {
    if (joiningMeeting) {
      window.open(joiningMeeting, "_blank", "noopener,noreferrer");
      toast.success("Joining meeting...");
      setJoiningMeeting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-center">
          My Bookings
        </h1>

        {loading ? (
          <p className="text-center text-white/90 italic">
            Loading bookings...
          </p>
        ) : error ? (
          <p className="text-red-200 text-center">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-white/80 italic">
            You have no bookings yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-5 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all"
              >
                {/* Card Header */}
                <div className="space-y-2">
                  <h2 className="font-bold text-xl text-white truncate">
                    {b.teacherName || "Teacher"}
                  </h2>
                  <p className="text-white/90 text-sm">Subject: {b.subject}</p>
                  <p className="text-white/90 text-sm">Skills: {b.skills}</p>
                  <p className="text-white/90 text-sm flex items-center gap-1">
                    <Calendar size={16} />
                    {b.date} {b.timeSlot && `| ${b.timeSlot}`}
                  </p>
                </div>

                {/* Status + Actions */}
                <div className="mt-5 flex flex-col gap-3">
                  {/* Status Badge */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow ${
                        b.status === "PAID"
                          ? "bg-green-500/80 text-white"
                          : b.status === "PENDING"
                          ? "bg-yellow-500/80 text-white"
                          : b.status === "CONFIRMED"
                          ? "bg-blue-500/80 text-white"
                          : b.status === "COMPLETED"
                          ? "bg-purple-500/80 text-white"
                          : b.status?.includes("CANCELLED")
                          ? "bg-gray-500/60 text-white"
                          : "bg-gray-400/40 text-white"
                      }`}
                    >
                      {b.status === "PAID" && <CheckCircle size={16} />}
                      {b.status === "CONFIRMED" && <Clock size={16} />}
                      {b.status === "PENDING" && <Clock size={16} />}
                      {b.status === "COMPLETED" && <CheckCircle size={16} />}
                      {b.status?.includes("CANCELLED") && <XCircle size={16} />}
                      {b.status}
                    </span>
                  </div>

                  {/* Payment + Cancel */}
                  {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                    <div className="flex gap-2 justify-between">
                      <button
                        onClick={() => handlePayment(b.id)}
                        disabled={processingPaymentId === b.id}
                        className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all ${
                          processingPaymentId === b.id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                      >
                        <CreditCard size={16} />{" "}
                        {processingPaymentId === b.id ? "Processing..." : "Pay"}
                      </button>

                      <button
                        onClick={() => handleCancel(b.id)}
                        disabled={processingPaymentId === b.id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm font-medium transition-all"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    </div>
                  )}

                  {/* Meeting Actions */}
                  {b.meetingLink && (
                    <div className="flex gap-3 justify-center items-center pt-2 border-t border-white/10 mt-2">
                      <button
                        onClick={() => handleJoinMeeting(b.meetingLink)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 shadow transition-all"
                      >
                        <LinkIcon size={16} /> Join
                      </button>
                      <button
                        onClick={() => handleCopyLink(b.meetingLink)}
                        className="text-white/80 hover:text-white flex items-center gap-1 text-sm"
                      >
                        <Copy size={14} /> Copy
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 🧩 Modal for Confirming Join Meeting */}
      <AnimatePresence>
        {joiningMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white text-gray-800 rounded-2xl shadow-xl w-96 p-6 relative"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LinkIcon size={18} className="text-blue-600" /> Join Meeting
              </h2>
              <p className="text-gray-600 text-sm mb-5">
                You’re about to join your scheduled meeting. Make sure your
                internet connection and device are ready.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setJoiningMeeting(null)}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmJoinMeeting}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                >
                  <ExternalLink size={14} /> Join Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
