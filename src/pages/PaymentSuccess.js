import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");
  const [status, setStatus] = useState("loading");
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8081/api/stripe/success/${bookingId}`
        );
        console.log("✅ Payment verified:", res.data);
        setResponse(res.data);
        setStatus("success");
        toast.success("Payment Successful! 🎉");

        // Redirect after 3 seconds
        setTimeout(() => navigate("/student/bookings"), 3000);
      } catch (err) {
        console.error("❌ Verification failed:", err);
        setStatus("error");
        toast.error("Payment verification failed. Please check again.");
      }
    };

    if (bookingId) verifyPayment();
    else {
      setStatus("invalid");
      toast.error("Invalid or missing booking ID.");
      setTimeout(() => navigate("/student/bookings"), 3000);
    }
  }, [bookingId, navigate]);

  if (status === "loading") {
    return (
      <div style={styles.container}>
        <h2>⏳ Verifying your payment...</h2>
      </div>
    );
  }

  if (status === "error" || status === "invalid") {
    return (
      <div style={styles.container}>
        <h1 style={{ color: "red" }}>❌ Payment Verification Failed</h1>
        <p>Something went wrong. Redirecting you shortly...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={{ color: "green" }}>✅ Payment Successful!</h1>
      <p>{response?.message || "Your payment has been verified."}</p>
      <div style={styles.card}>
        <p>
          <strong>Booking ID:</strong> {response?.bookingId}
        </p>
        <p>
          <strong>Payment Status:</strong> {response?.paymentStatus}
        </p>
        <p>
          <strong>Booking Status:</strong> {response?.bookingStatus}
        </p>
      </div>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    color: "#111",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px 40px",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },
};

export default PaymentSuccess;
