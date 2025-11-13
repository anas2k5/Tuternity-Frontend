import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { XCircle, Loader2 } from "lucide-react";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        if (bookingId) {
          await axios.get(
            `http://localhost:8081/api/stripe/cancel/${bookingId}`
          );
        }
        toast.error("Payment Cancelled ❌");
      } catch (error) {
        console.error("Cancel API failed:", error);
        toast.error("Error cancelling payment.");
      } finally {
        setTimeout(() => navigate("/student/bookings"), 3000);
      }
    };

    cancelPayment();
  }, [bookingId, navigate]);

  return (
    <div className="min-h-screen bg-landing-light dark:bg-landing-dark transition-colors duration-500">
      <Navbar />

      <div className="pt-24 px-6 flex justify-center">
        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-white/70 dark:bg-white/10 
            backdrop-blur-xl border border-white/40 dark:border-white/10
            shadow-xl rounded-3xl p-10 max-w-xl w-full text-center
          "
        >
          <div className="flex flex-col items-center gap-3">
            <XCircle size={60} className="text-red-500" />

            <h1 className="text-3xl font-extrabold text-red-600">
              Payment Cancelled
            </h1>

            <p className="text-gray-700 dark:text-gray-300 mt-2">
              Your payment was cancelled
            </p>

            {bookingId && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Booking ID: <strong>{bookingId}</strong>
              </p>
            )}

            <p className="mt-6 text-gray-700 dark:text-gray-300 text-sm italic">
              Redirecting you back to your bookings...
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
