import React, { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      alert("Please fill out all details!");
      return;
    }

    try {
      const { data } = await api.post(
        "/api/orders",
        { items: cartItems, address, phone },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (data.success) {
        alert("Order placed successfully!");
        navigate("/payment", { state: { orderId: data.order._id } });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  if (!user)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          color: "#fff",
        }}
      >
        Please log in to proceed to checkout.
      </div>
    );

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1f2937, #374151, #3b82f6)",
        color: "#f9fafb",
        minHeight: "100vh",
        padding: 30,
      }}
    >
      <h2 style={{ textAlign: "center", color: "#3b82f6" }}>Checkout</h2>

      <div
        style={{
          maxWidth: 600,
          margin: "30px auto",
          backgroundColor: "#111827",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
        }}
      >
        <h3>Shipping Details</h3>
        <label>Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter full address"
          rows="3"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            marginTop: 6,
            marginBottom: 16,
          }}
        />

        <label>Phone Number:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter contact number"
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            marginTop: 6,
            marginBottom: 16,
          }}
        />

        <button
          onClick={handlePlaceOrder}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Place Order & Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
