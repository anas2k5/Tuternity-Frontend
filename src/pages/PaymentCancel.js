import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const cancelPayment = async () => {
      try {
        if (bookingId) {
          await axios.get(`http://localhost:8081/api/stripe/cancel/${bookingId}`);
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
    <div style={styles.container}>
      <h1 style={{ color: "#b91c1c" }}>❌ Payment Cancelled</h1>
      <p>Your payment was cancelled for Booking ID: {bookingId}</p>
      <p style={{ marginTop: "15px", color: "#4b5563" }}>
        Redirecting to your bookings page...
      </p>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff5f5",
    color: "#b91c1c",
    fontFamily: "Arial, sans-serif",
  },
};

export default PaymentCancel;
