import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
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
      } catch (err) {
        console.error("❌ Verification failed:", err);
        setStatus("error");
      }
    };

    if (bookingId) verifyPayment();
    else setStatus("invalid");
  }, [bookingId]);

  if (status === "loading")
    return (
      <div style={styles.container}>
        <h2>⏳ Verifying your payment...</h2>
      </div>
    );

  if (status === "error" || status === "invalid")
    return (
      <div style={styles.container}>
        <h1 style={{ color: "red" }}>❌ Payment Verification Failed</h1>
        <p>Something went wrong. Please try again later.</p>
      </div>
    );

  return (
    <div style={styles.container}>
      <h1 style={{ color: "green" }}>✅ Payment Successful!</h1>
      <p>{response.message}</p>
      <div style={styles.card}>
        <p>
          <strong>Booking ID:</strong> {response.bookingId}
        </p>
        <p>
          <strong>Payment Status:</strong> {response.paymentStatus}
        </p>
        <p>
          <strong>Booking Status:</strong> {response.bookingStatus}
        </p>
      </div>
     <button
  style={styles.button}
  onClick={() => (window.location.href = "/student")}
>
  Go to Dashboard
</button>
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
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    borderRadius: "6px",
    backgroundColor: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default PaymentSuccess;
