import { useEffect, useState } from "react";
import api from "../api";
import Navbar from "../components/Navbar";
import { getJSON } from "../utils/storage";
import toast from "react-hot-toast";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPaymentId, setProcessingPaymentId] = useState(null);

  // 🔹 Fetch all student bookings
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

  // 🔹 Cancel booking
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

  // 🔹 Start payment
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

  // 🔹 Page Layout
  return (
    <div>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">My Bookings</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p>You have no bookings yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((b, i) => (
              <div
                key={b.id || i}
                className="p-4 border rounded shadow flex justify-between items-center bg-white hover:shadow-md transition-all"
              >
                <div>
                  <h2 className="font-semibold text-lg">
                    {b.teacherName || "Teacher"}
                  </h2>
                  <p>Subject: {b.subject || "-"}</p>
                  <p>Skills: {b.skills || "-"}</p>
                  <p>
                    Slot: {b.date || "-"} {b.timeSlot ? `| ${b.timeSlot}` : ""}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  {/* 🔹 Booking Status Badge */}
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      b.status === "PAID"
                        ? "bg-green-600 text-white"
                        : b.status === "PENDING"
                        ? "bg-yellow-500 text-white"
                        : b.status?.includes("CANCELLED")
                        ? "bg-gray-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {b.status || "UNKNOWN"}
                  </span>

                  {/* 💳 Pay Now (only if PENDING) */}
                  {b.status === "PENDING" && (
                    <button
                      onClick={() => handlePayment(b.id)}
                      disabled={processingPaymentId === b.id}
                      className={`px-3 py-1 rounded text-white font-medium transition ${
                        processingPaymentId === b.id
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {processingPaymentId === b.id
                        ? "Processing..."
                        : "💳 Pay Now"}
                    </button>
                  )}

                  {/* ❌ Cancel (only if not PAID or CANCELLED) */}
                  {b.status !== "PAID" && !b.status?.includes("CANCELLED") && (
                    <button
                      onClick={() => handleCancel(b.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
