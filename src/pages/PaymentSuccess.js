import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  const API = process.env.REACT_APP_API_URL; // ✅ USE ENV

  const [status, setStatus] = useState("loading");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(`${API}/stripe/success/${bookingId}`);
        console.log("✅ Payment verified:", res.data);

        setResponse(res.data);
        setStatus("success");
        toast.success("Payment Successful! 🎉");

        setTimeout(() => navigate("/student/bookings"), 2500);
      } catch (err) {
        console.error("❌ Verification failed:", err);

        setStatus("error");
        const msg =
          err.response?.data?.error ||
          "Payment verification failed. Please check again.";

        toast.error(msg);
        setTimeout(() => navigate("/student/bookings"), 3000);
      }
    };

    if (bookingId) verifyPayment();
    else {
      setStatus("invalid");
      toast.error("Invalid or missing booking ID.");
      setTimeout(() => navigate("/student/bookings"), 2000);
    }
  }, [bookingId, navigate, API]);

  return (
    <div className="min-h-screen bg-landing-light dark:bg-landing-dark transition-colors duration-500">
      <Navbar />

      <div className="pt-24 px-6 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="
          bg-white/70 dark:bg-white/10 
          backdrop-blur-xl border border-white/40 dark:border-white/10
          shadow-xl rounded-3xl p-10 max-w-xl w-full text-center
        "
        >
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={45} className="animate-spin text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Verifying your payment...
              </h2>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={60} className="text-green-500" />
              <h1 className="text-3xl font-extrabold text-green-600">
                Payment Successful!
              </h1>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                {response?.message || "Your payment has been verified."}
              </p>

              <div
                className="
                mt-6 bg-white/80 dark:bg-white/5 
                border border-gray-300 dark:border-white/10
                rounded-2xl py-5 px-7 text-left shadow-lg
              "
              >
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Booking ID:</strong> {response?.bookingId}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  <strong>Payment Status:</strong> {response?.paymentStatus}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  <strong>Booking Status:</strong> {response?.bookingStatus}
                </p>
              </div>

              <p className="mt-5 text-gray-700 dark:text-gray-300 text-sm italic">
                Redirecting to your bookings...
              </p>
            </div>
          )}

          {(status === "error" || status === "invalid") && (
            <div className="flex flex-col items-center gap-3">
              <XCircle size={60} className="text-red-500" />
              <h1 className="text-3xl font-extrabold text-red-600">
                Payment Failed
              </h1>

              <p className="text-gray-700 dark:text-gray-300 mt-2">
                Something went wrong while validating your payment.
              </p>

              <p className="mt-5 text-gray-500 dark:text-gray-400 text-sm">
                Redirecting back to your bookings...
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
