import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Calendar, CreditCard, XCircle, CheckCircle, Clock } from "lucide-react";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState(null);

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

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      toast.success("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      console.error("❌ Cancellation failed:", err);
      toast.error(
        err.response?.data?.message ||
          "Failed to cancel booking. Please try again."
      );
    }
  };

  const handlePayment = async (bookingId) => {
    setProcessingPaymentId(bookingId);
    try {
      const response = await api.post(
        `/stripe/create-checkout-session/${bookingId}`
      );
      const { url } = response.data;
      if (url) {
        toast("Redirecting to Stripe Checkout...", {
          icon: "💳",
          duration: 2000,
        });
        window.location.href = url;
      } else {
        toast.error("Could not initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("❌ Payment Error:", error);
      toast.error(
        error.response?.data?.error ||
          "Payment failed. This booking might already be paid."
      );
    } finally {
      setProcessingPaymentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white">
      <Navbar />
      <div className="pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">My Bookings</h1>

        {loading ? (
          <p className="text-center text-white/90">Loading bookings...</p>
        ) : error ? (
          <p className="text-red-200 text-center">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-center text-white/90">You have no bookings yet.</p>
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
                <div className="space-y-2">
                  <h2 className="font-bold text-xl text-white">
                    {b.teacherName || "Teacher"}
                  </h2>
                  <p className="text-white/90 text-sm">Subject: {b.subject}</p>
                  <p className="text-white/90 text-sm">Skills: {b.skills}</p>
                  <p className="text-white/90 text-sm flex items-center gap-1">
                    <Calendar size={16} />
                    {b.date} {b.timeSlot && `| ${b.timeSlot}`}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 justify-between">
                  {/* Status Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                      b.status === "PAID"
                        ? "bg-green-500/80 text-white"
                        : b.status === "PENDING"
                        ? "bg-yellow-500/80 text-white"
                        : b.status?.includes("CANCELLED")
                        ? "bg-gray-500/80 text-white"
                        : "bg-blue-500/80 text-white"
                    }`}
                  >
                    {b.status === "PAID" && <CheckCircle size={16} />}
                    {b.status === "PENDING" && <Clock size={16} />}
                    {b.status?.includes("CANCELLED") && <XCircle size={16} />}
                    {b.status || "UNKNOWN"}
                  </span>

                  {/* Pay Now */}
                  {b.status === "PENDING" && (
                    <button
                      onClick={() => handlePayment(b.id)}
                      disabled={processingPaymentId === b.id}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white font-medium transition ${
                        processingPaymentId === b.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      <CreditCard size={16} />
                      {processingPaymentId === b.id
                        ? "Processing..."
                        : "Pay Now"}
                    </button>
                  )}

                  {/* Cancel */}
                  {b.status !== "PAID" &&
                    !b.status?.includes("CANCELLED") && (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                      >
                        <XCircle size={16} /> Cancel
                      </button>
                    )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
