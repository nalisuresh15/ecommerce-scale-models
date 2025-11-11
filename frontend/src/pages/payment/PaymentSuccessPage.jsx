import React from "react";
import { useLocation, Link } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();

  const { total = "0.00", method = "N/A" } = location.state || {};

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f0fdf4",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#ffffff",
          padding: "40px 30px",
          borderRadius: 16,
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          position: "relative",
        }}
      >
        {/* ✅ Animated Checkmark */}
        <svg
          viewBox="0 0 52 52"
          style={{ width: 80, height: 80, margin: "0 auto 20px", display: "block" }}
        >
          <circle
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke="#4ade80"
            strokeWidth="4"
            strokeDasharray="157"
            strokeDashoffset="157"
            style={{ animation: "dash-circle 0.6s forwards ease-out" }}
          />
          <path
            fill="none"
            stroke="#4ade80"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14 27l7 7 16-16"
            strokeDasharray="48"
            strokeDashoffset="48"
            style={{ animation: "dash-check 0.4s 0.6s forwards ease-out" }}
          />
        </svg>

        {/* Success Message */}
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#16a34a", marginBottom: 12 }}>
          Order Confirmed!
        </h1>
        <p style={{ fontSize: 16, color: "#374151", marginBottom: 12 }}>
          Thanks for shopping at <strong>Scale Models</strong>!
        </p>
        <p style={{ fontSize: 15, color: "#4b5563", marginBottom: 6 }}>
          Your payment of <strong>₹{total}</strong> using <strong>{method}</strong> has been processed successfully.
        </p>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          You will also receive an E-MAIL confirmation shortly.
        </p>

        {/* Continue Shopping Button */}
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "12px 28px",
            backgroundColor: "#16a34a",
            color: "#fff",
            borderRadius: 12,
            fontWeight: 600,
            textDecoration: "none",
            transition: "0.3s",
          }}
        >
          Continue Shopping
        </Link>

        {/* Inline Keyframe Animations */}
        <style>
          {`
            @keyframes dash-circle {
              to { stroke-dashoffset: 0; }
            }
            @keyframes dash-check {
              to { stroke-dashoffset: 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
