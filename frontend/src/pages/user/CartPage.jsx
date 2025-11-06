import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

const CartPage = () => {
  const { user } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [] }); // ✅ always initialized
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch cart safely
  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get("/api/user/cart", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      // ✅ handle undefined or empty cart
      if (!data || !data.items) {
        setCart({ items: [] });
      } else {
        setCart(data);
      }
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const updateQty = async (productId, qty) => {
    try {
      await api.post(
        "/api/user/cart",
        { productId, qty },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("Failed to update quantity.");
    }
  };

  const removeItem = async (productId) => {
    try {
      await api.delete("/api/user/cart", {
        headers: { Authorization: `Bearer ${user?.token}` },
        data: { productId },
      });
      fetchCart();
    } catch (err) {
      console.error("❌ Remove failed:", err);
      alert("Failed to remove item.");
    }
  };

  if (!user) {
    return (
      <div
        style={{
          backgroundColor: "#1f2937",
          color: "#f9fafb",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: 18,
        }}
      >
        Please login to view your cart.
      </div>
    );
  }

  const items = cart?.items || []; // ✅ safely fallback
  const total = items.reduce(
    (sum, it) => sum + (it.product?.price || 0) * (it.qty || 1),
    0
  );
  const totalItems = items.reduce((sum, it) => sum + (it.qty || 1), 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Cart is empty!");
      return;
    }
    navigate("/payment", { state: { cartItems: items } });
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1f2937, #374151, #3b82f6)",
        color: "#f9fafb",
        minHeight: "100vh",
        padding: 20,
      }}
    >
      <h2 style={{ textAlign: "center", color: "#3b82f6", marginBottom: 30 }}>
        🛒 Your Cart
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && items.length === 0 && (
        <p style={{ textAlign: "center", color: "#cbd5e1" }}>Cart is empty.</p>
      )}

      {/* 🧩 Grid Layout for Cart Items */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: 20,
        }}
      >
        {items.map((it) => (
          <div
            key={it.product?._id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              backgroundColor: "#1f2937",
              borderRadius: 12,
              boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              padding: 16,
              gap: 20,
            }}
          >
            <img
              src={it.product?.image || "/placeholder.jpg"}
              alt={it.product?.name}
              style={{
                width: 180,
                height: 140,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, color: "#3b82f6" }}>
                {it.product?.name || "Unknown Product"}
              </h3>
              <p style={{ color: "#9ca3af", fontSize: 14 }}>
                {it.product?.description || "No description available."}
              </p>
              <p style={{ color: "#22c55e", fontWeight: 700 }}>
                ₹{it.product?.price || 0}
              </p>

              <div style={{ marginBottom: 8 }}>
                Qty:
                <button
                  onClick={() =>
                    updateQty(it.product?._id, Math.max(1, (it.qty || 1) - 1))
                  }
                  style={qtyBtn}
                >
                  -
                </button>
                <span style={{ margin: "0 8px" }}>{it.qty || 1}</span>
                <button
                  onClick={() =>
                    updateQty(it.product?._id, (it.qty || 1) + 1)
                  }
                  style={qtyBtn}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(it.product?._id)}
                style={btnRed}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 💰 Total & Checkout */}
      {items.length > 0 && (
        <div style={{ marginTop: 50, textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#111827",
              padding: 20,
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 18,
              fontWeight: 600,
              boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            <span>
              Subtotal ({totalItems} {totalItems > 1 ? "items" : "item"}):
            </span>
            <span style={{ color: "#3b82f6", fontSize: 20 }}>₹{total}</span>
          </div>
          <button onClick={handleCheckout} style={btnBlue}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

// 🎨 Styles
const qtyBtn = {
  backgroundColor: "#3b82f6",
  border: "none",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: 4,
  cursor: "pointer",
  marginLeft: 6,
  fontWeight: "600",
};

const btnBlue = {
  marginTop: 20,
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "12px 28px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
};

const btnRed = {
  backgroundColor: "#ef4444",
  border: "none",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
};

export default CartPage;
