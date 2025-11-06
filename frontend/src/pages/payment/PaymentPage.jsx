import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 🛒 CART DATA
  const initialCartItems =
    location.state?.cartItems || [
      {
        product: {
          _id: "p1",
          name: "Premium Hoodie",
          price: 15000,
          image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Product1",
        },
        qty: 1,
        size: "L",
      },
      {
        product: {
          _id: "p2",
          name: "Designer Sneakers",
          price: 16791,
          image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Product2",
        },
        qty: 1,
        size: "9",
      },
    ];

  const [cartItems] = useState(initialCartItems);

  // 🏠 ADDRESS + PAYMENT STATE
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    addressLine: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    expiryMonth: "MM",
    expiryYear: "YYYY",
    cvv: "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0
  );
  const shipping = 0;
  const total = (subtotal + shipping).toFixed(2);

  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => String(currentYear + i));
  const paymentMethods = ["Card", "PhonePe", "Paytm", "GPay", "Cash on Delivery"];

  // 📍 Auto-fill city/state from pincode
  const handlePincodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAddress({ ...address, pincode: value });

    if (value.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (data?.[0]?.Status === "Success" && data?.[0]?.PostOffice?.length) {
          const post = data[0].PostOffice[0];
          setAddress((prev) => ({
            ...prev,
            city: post.District,
            state: post.State,
          }));
        } else {
          setAddress((prev) => ({
            ...prev,
            city: "Invalid Pincode",
            state: "",
          }));
        }
      } catch {
        setAddress((prev) => ({
          ...prev,
          city: "Error Fetching",
          state: "",
        }));
      }
    } else {
      setAddress((prev) => ({ ...prev, city: "", state: "" }));
    }
  };

  // 💳 Handle card input formatting & validation
  const handleCardDetailChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      // Remove non-numeric characters
      let cleaned = value.replace(/\D/g, "");

      // Limit to 12 digits
      cleaned = cleaned.slice(0, 12);

      // Add space after every 4 digits
      const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();

      setCardDetails((prev) => ({ ...prev, number: formatted }));
    } else if (name === "cvv") {
      // Only numbers, limit to 3 digits
      const formatted = value.replace(/\D/g, "").slice(0, 3);
      setCardDetails((prev) => ({ ...prev, cvv: formatted }));
    } else {
      setCardDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 🧾 Submit order
  const handleCheckout = async () => {
    if (!address.name || !address.phone || !address.pincode || !address.addressLine) {
      alert("Please fill in all delivery details.");
      return;
    }

    if (paymentMethod === "Card") {
      const { name, number, expiryMonth, expiryYear, cvv } = cardDetails;
      const cleanNumber = number.replace(/\s/g, "");
      if (
        !name ||
        cleanNumber.length !== 12 ||
        expiryMonth === "MM" ||
        expiryYear === "YYYY" ||
        cvv.length !== 3
      ) {
        alert("Please enter valid card details.");
        return;
      }
    }

    try {
      const payload = {
        cartItems: cartItems.map((item) => ({
          product: item.product._id,
          qty: item.qty,
          size: item.size,
        })),
        totalAmount: total,
      };

      const { data } = await api.post("/api/orders", payload, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      console.log("✅ Order Created:", data);

      navigate("/payment-success", {
        state: { total, method: paymentMethod, cartItems },
      });
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      alert("Failed to create order. Try again.");
    }
  };

  // 🎨 STYLES
  const style = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: "#1f2937",
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
    },
    mainContent: {
      width: "100%",
      maxWidth: "1200px",
      backgroundColor: "#374151",
      borderRadius: "16px",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
      padding: "32px",
      display: "flex",
      flexDirection: window.innerWidth >= 768 ? "row" : "column",
      gap: "32px",
    },
    input: {
      width: "100%",
      border: "1px solid #4b5563",
      borderRadius: "8px",
      padding: "10px 12px",
      color: "#f3f4f6",
      backgroundColor: "#4b5563",
      outline: "none",
    },
    inputReadOnly: { backgroundColor: "#6b7280" },
    label: {
      display: "block",
      fontSize: "14px",
      color: "#d1d5db",
      marginBottom: "4px",
      fontWeight: "500",
    },
    buttonPrimary: {
      width: "100%",
      backgroundColor: "#3b82f6",
      color: "#fff",
      padding: "12px",
      borderRadius: "8px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      marginTop: "16px",
    },
  };

  // 🖼️ UI
  return (
    <div style={style.pageContainer}>
      <div style={style.mainContent}>
        {/* 🛍️ Cart Section */}
        <div style={{ flex: 2 }}>
          <h2 style={{ color: "#3b82f6", fontWeight: "700", marginBottom: "16px" }}>
            Shopping Cart
          </h2>
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #4b5563",
                padding: "12px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p style={{ color: "#f3f4f6", fontWeight: "500", margin: 0 }}>
                    {item.product.name}
                  </p>
                  <small style={{ color: "#9ca3af" }}>
                    Qty: {item.qty} | Size: {item.size}
                  </small>
                </div>
              </div>
              <p style={{ color: "#f3f4f6", fontWeight: "600" }}>
                ₹{(item.product.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}
          <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #4b5563",
              paddingTop: "12px",
              color: "#f3f4f6",
            }}
          >
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>Shipping: Free</p>
            <h3>Total: ₹{total}</h3>
          </div>
        </div>

        {/* 🏠 Delivery + Payment */}
        <div
          style={{
            flex: 1,
            backgroundColor: "#1f2937",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              color: "#3b82f6",
              borderBottom: "1px solid #4b5563",
              paddingBottom: "8px",
            }}
          >
            📦 Delivery Details
          </h3>

          {/* Address */}
          <div style={{ marginTop: "12px" }}>
            <label style={style.label}>Full Name</label>
            <input
              type="text"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              style={style.input}
            />
            <label style={style.label}>Mobile Number</label>
            <input
              type="text"
              value={address.phone}
              onChange={(e) =>
                setAddress({
                  ...address,
                  phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                })
              }
              style={style.input}
            />
            <label style={style.label}>Pincode</label>
            <input
              type="text"
              value={address.pincode}
              onChange={handlePincodeChange}
              style={style.input}
            />
            <label style={style.label}>City</label>
            <input
              type="text"
              value={address.city}
              readOnly
              style={{ ...style.input, ...style.inputReadOnly }}
            />
            <label style={style.label}>State</label>
            <input
              type="text"
              value={address.state}
              readOnly
              style={{ ...style.input, ...style.inputReadOnly }}
            />
            <label style={style.label}>Full Address</label>
            <textarea
              rows="2"
              value={address.addressLine}
              onChange={(e) =>
                setAddress({ ...address, addressLine: e.target.value })
              }
              style={style.input}
            />
          </div>

          {/* Payment */}
          <h3
            style={{
              color: "#3b82f6",
              borderBottom: "1px solid #4b5563",
              paddingBottom: "8px",
              marginTop: "16px",
            }}
          >
            💳 Payment Info
          </h3>

          {paymentMethods.map((method) => (
            <label
              key={method}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#f3f4f6",
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === method}
                onChange={() => setPaymentMethod(method)}
              />
              {method}
            </label>
          ))}

          {paymentMethod === "Card" && (
            <div style={{ marginTop: "12px" }}>
              <label style={style.label}>Name on Card</label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleCardDetailChange}
                style={style.input}
              />

              <label style={style.label}>Card Number</label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleCardDetailChange}
                placeholder="1234 5678 9012"
                style={style.input}
              />

              <label style={style.label}>Expiry</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="expiryMonth"
                  value={cardDetails.expiryMonth}
                  onChange={handleCardDetailChange}
                  style={{ ...style.input, flex: 1 }}
                >
                  <option value="MM" disabled>
                    MM
                  </option>
                  {months.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  name="expiryYear"
                  value={cardDetails.expiryYear}
                  onChange={handleCardDetailChange}
                  style={{ ...style.input, flex: 1 }}
                >
                  <option value="YYYY" disabled>
                    YYYY
                  </option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <label style={style.label}>CVV</label>
              <input
                type="password"
                name="cvv"
                value={cardDetails.cvv}
                onChange={handleCardDetailChange}
                placeholder="123"
                style={style.input}
              />
            </div>
          )}

          <button onClick={handleCheckout} style={style.buttonPrimary}>
            Place Order (₹{total})
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
