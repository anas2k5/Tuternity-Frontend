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
  const [joiningMeeting, setJoiningMeeting] = useState(null);

  // NEW: Cancel modal state
  const [cancelBookingId, setCancelBookingId] = useState(null);

  // Fetch all bookings
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

  // ------------------------------
  // CANCEL BOOKING — NO ALERT POPUP
  // ------------------------------
  const handleCancel = (bookingId) => {
    setCancelBookingId(bookingId);
  };

  const confirmCancelBooking = async () => {
    try {
      await api.delete(`/bookings/${cancelBookingId}`);
      toast.success("Booking cancelled successfully.");
      setCancelBookingId(null);
      fetchBookings();
    } catch (err) {
      console.error("❌ Cancellation failed:", err);
      toast.error("Failed to cancel booking.");
    }
  };

  // Stripe payment
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

  // Copy meeting link
  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Meeting link copied!");
  };

  // Join meeting popup
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
    <div className="min-h-screen bg-landing-light dark:bg-landing-dark transition-colors duration-500">
      <Navbar />

      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900 dark:text-white">
          My Bookings
        </h1>

        {/* Loading / Error */}
        {loading ? (
          <p className="text-center text-gray-700 dark:text-gray-300 italic">
            Loading bookings...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300 italic">
            You have no bookings yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((b, i) => (
              <motion.div
                key={b.id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="
                  bg-white/70 dark:bg-white/10 
                  backdrop-blur-xl border border-white/20 
                  dark:border-white/10 
                  shadow-lg rounded-2xl p-5 
                  hover:shadow-2xl hover:scale-[1.01] 
                  transition-all
                "
              >
                {/* Card Header */}
                <div className="space-y-1">
                  <h2 className="font-bold text-xl text-gray-900 dark:text-white truncate">
                    {b.teacherName}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Subject: {b.subject}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Skills: {b.skills}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm flex items-center gap-1">
                    <Calendar size={16} />
                    {b.date} {b.timeSlot && `| ${b.timeSlot}`}
                  </p>
                </div>

                {/* Badge */}
                <div className="mt-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium shadow 
                      ${
                        b.status === "PAID"
                          ? "bg-green-500/80 text-white"
                          : b.status === "PENDING"
                          ? "bg-yellow-500/80 text-white"
                          : b.status === "CONFIRMED"
                          ? "bg-blue-500/80 text-white"
                          : b.status === "COMPLETED"
                          ? "bg-purple-500/80 text-white"
                          : "bg-gray-500/60 text-white"
                      }`}
                  >
                    {b.status === "PAID" && <CheckCircle size={16} />}
                    {b.status === "CONFIRMED" && <Clock size={16} />}
                    {b.status === "PENDING" && <Clock size={16} />}
                    {b.status === "COMPLETED" && <CheckCircle size={16} />}
                    {b.status.includes("CANCELLED") && <XCircle size={16} />}
                    {b.status}
                  </span>
                </div>

                {/* Pay + Cancel Buttons */}
                {(b.status === "PENDING" || b.status === "CONFIRMED") && (
                  <div className="flex gap-3 mt-4">
                    {/* PAY */}
                    <button
                      onClick={() => handlePayment(b.id)}
                      disabled={processingPaymentId === b.id}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                        text-white text-sm transition-all shadow 
                        ${
                          processingPaymentId === b.id
                            ? "bg-gray-400"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                    >
                      <CreditCard size={16} />
                      {processingPaymentId === b.id ? "Processing…" : "Pay"}
                    </button>

                    {/* CANCEL */}
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="
                        flex-1 flex items-center justify-center gap-2 px-4 py-2 
                        rounded-lg bg-red-600 hover:bg-red-700 
                        text-white text-sm transition-all shadow
                      "
                    >
                      <XCircle size={16} /> Cancel
                    </button>
                  </div>
                )}

                {/* Join + Copy */}
                {b.meetingLink && (
                  <div className="mt-5 pt-3 border-t border-gray-300/30 dark:border-white/10 flex gap-3">
                    <button
                      onClick={() => handleJoinMeeting(b.meetingLink)}
                      className="
                        flex-1 bg-blue-600 hover:bg-blue-700 
                        text-white px-4 py-2 rounded-lg 
                        text-sm flex items-center justify-center gap-2 
                        shadow transition-all
                      "
                    >
                      <LinkIcon size={16} /> Join
                    </button>

                    <button
                      onClick={() => handleCopyLink(b.meetingLink)}
                      className="
                        flex-1 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2
                        bg-gray-200 text-gray-900
                        dark:bg-white/10 dark:text-white dark:border dark:border-white/10
                        hover:bg-gray-300 dark:hover:bg-white/20
                        transition-all shadow
                      "
                    >
                      <Copy size={14} /> Copy
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ------------------------------ */}
      {/* JOIN MEETING POPUP */}
      {/* ------------------------------ */}
      <AnimatePresence>
        {joiningMeeting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-6 rounded-2xl w-96 shadow-xl"
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <LinkIcon size={18} className="text-blue-600" /> Join Meeting
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                You're about to join your session. Ready to continue?
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setJoiningMeeting(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmJoinMeeting}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm flex items-center gap-2"
                >
                  <ExternalLink size={14} /> Join Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------ */}
      {/* CANCEL BOOKING CONFIRMATION */}
      {/* ------------------------------ */}
      <AnimatePresence>
        {cancelBookingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white 
                         p-7 rounded-2xl w-[380px] shadow-xl border border-white/20"
            >
              <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                <XCircle size={20} className="text-red-500" />
                Cancel Booking?
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Are you sure you want to cancel this session? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setCancelBookingId(null)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-sm"
                >
                  Keep Booking
                </button>

                <button
                  onClick={confirmCancelBooking}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 
                             text-white text-sm shadow flex items-center gap-2"
                >
                  <XCircle size={15} /> Cancel Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
