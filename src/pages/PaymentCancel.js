import React from "react";
import { useSearchParams } from "react-router-dom";

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fff5f5",
      color: "#b91c1c",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>❌ Payment Cancelled</h1>
      <p>Your payment was cancelled for Booking ID: {bookingId}</p>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#b91c1c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
        onClick={() => window.location.href = "/studentBookings"}
      >
        Go Back
      </button>
    </div>
  );
};

export default PaymentCancel;
