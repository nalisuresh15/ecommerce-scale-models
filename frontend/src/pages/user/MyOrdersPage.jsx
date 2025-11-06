import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api";

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({});
  const [submittedRatings, setSubmittedRatings] = useState({});
  const [message, setMessage] = useState("");
  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchUserRatings();
    }
  }, [user]);

  // ✅ Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/orders/myorders", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch already submitted ratings
  const fetchUserRatings = async () => {
    try {
      const { data } = await api.get("/api/user/my-ratings", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const ratingMap = {};
      data.forEach((r) => {
        ratingMap[r.product] = {
          rating: r.rating,
          comment: r.comment,
        };
      });
      setSubmittedRatings(ratingMap);
    } catch (err) {
      console.error("Error fetching user ratings:", err);
    }
  };

  const handleQuestionRating = (productId, questionKey, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [questionKey]: value,
      },
    }));
  };

  const handleCommentChange = (productId, value) => {
    setRatings((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment: value },
    }));
  };

  // ✅ Submit new rating (only once per product)
  const submitRating = async (productId) => {
    if (submittedRatings[productId]) {
      showToast("You already rated this product.", "error");
      return;
    }

    try {
      const r = ratings[productId] || {};
      const questions = ["buildQuality", "packaging", "valueForMoney"];
      const selectedRatings = questions.map((q) => Number(r[q] || 0));
      const validRatings = selectedRatings.filter((x) => x > 0);

      if (validRatings.length < 3) {
        showToast("⚠️ Please rate all 3 questions before submitting.", "error");
        return;
      }

      const average =
        validRatings.reduce((sum, v) => sum + v, 0) / validRatings.length;

      const { data } = await api.post(
        `/api/products/${productId}/rate`,
        { rating: average, comment: r.comment || "" },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      showToast("⭐ Thanks for your review!", "success");

      setSubmittedRatings((prev) => ({
        ...prev,
        [productId]: { rating: average, comment: r.comment },
      }));

      setRatings((prev) => ({ ...prev, [productId]: {} }));
    } catch (err) {
      console.error("❌ Error rating product:", err);
      showToast("Failed to submit review. Try again!", "error");
    }
  };

  // ✅ Toast helper
  const showToast = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(""), 3000);
  };

  if (!user)
    return <div style={styles.centered}>Please login to view your orders.</div>;

  if (loading)
    return <div style={styles.centered}>Loading your orders...</div>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>🧾 My Orders</h2>

      {message && (
        <div
          style={{
            ...styles.toast,
            backgroundColor:
              message.type === "error" ? "#ef4444" : "#10b981",
          }}
          className="fade-toast"
        >
          {message.text}
        </div>
      )}

      <style>
        {`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-10px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          .fade-toast {
            animation: fadeInOut 3s ease-in-out forwards;
          }
        `}
      </style>

      {orders.length === 0 ? (
        <p style={styles.centered}>No orders yet.</p>
      ) : (
        <div style={styles.grid}>
          {orders.map((order, i) => (
            <div key={i} style={styles.card}>
              <div>
                <h3 style={styles.orderTitle}>Order #{i + 1}</h3>
                <p>ID: {order._id}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              {(order.cartItems || []).map((item, j) => {
                const productId = item.product?._id;
                const imageUrl = item.product?.image?.startsWith("http")
                  ? item.product.image
                  : `${BASE_URL}${item.product?.image || ""}`;
                const qRatings = ratings[productId] || {};
                const existingRating = submittedRatings[productId];

                return (
                  <div key={j} style={styles.productBox}>
                    <img src={imageUrl} alt="car" style={styles.image} />
                    <div style={{ flex: 1 }}>
                      <h4>{item.product?.name}</h4>
                      <p>₹{item.product?.price}</p>
                    </div>

                    {existingRating ? (
                      <div style={styles.alreadyRatedBox}>
                        <p style={{ color: "#facc15" }}>
                          ⭐ Rated: {existingRating.rating.toFixed(1)} / 5
                        </p>
                        <p style={{ color: "#9ca3af" }}>
                          💬 {existingRating.comment}
                        </p>
                      </div>
                    ) : (
                      <div style={{ width: "100%", marginTop: 10 }}>
                        <RatingQuestion
                          label="Build Quality"
                          value={qRatings.buildQuality || 0}
                          onRate={(val) =>
                            handleQuestionRating(productId, "buildQuality", val)
                          }
                        />
                        <RatingQuestion
                          label="Packaging & Delivery"
                          value={qRatings.packaging || 0}
                          onRate={(val) =>
                            handleQuestionRating(productId, "packaging", val)
                          }
                        />
                        <RatingQuestion
                          label="Value for Money"
                          value={qRatings.valueForMoney || 0}
                          onRate={(val) =>
                            handleQuestionRating(productId, "valueForMoney", val)
                          }
                        />
                        <textarea
                          rows={2}
                          placeholder="Write your feedback..."
                          value={qRatings.comment || ""}
                          onChange={(e) =>
                            handleCommentChange(productId, e.target.value)
                          }
                          style={styles.commentBox}
                        />
                        <button
                          onClick={() => submitRating(productId)}
                          style={styles.submitBtn}
                        >
                          Submit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RatingQuestion = ({ label, value, onRate }) => (
  <div style={{ marginBottom: 10 }}>
    <p style={{ marginBottom: 3, color: "#3b82f6", fontWeight: "600" }}>
      {label}:
    </p>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => onRate(star)}
        style={{
          cursor: "pointer",
          color: value >= star ? "#facc15" : "#9ca3af",
          fontSize: 18,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

const styles = {
  page: {
    background: "#1f2937",
    color: "#fff",
    minHeight: "100vh",
    padding: 20,
    position: "relative",
  },
  title: {
    textAlign: "center",
    color: "#3b82f6",
    marginBottom: 30,
  },
  toast: {
    position: "fixed",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
    color: "#fff",
    padding: "10px 22px",
    borderRadius: 8,
    fontWeight: 600,
    zIndex: 9999,
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 25,
  },
  card: {
    backgroundColor: "#374151",
    borderRadius: 10,
    padding: 15,
    width: 380,
  },
  productBox: {
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  alreadyRatedBox: {
    marginTop: 10,
    backgroundColor: "#1f2937",
    padding: 10,
    borderRadius: 6,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
    objectFit: "cover",
  },
  commentBox: {
    width: "100%",
    marginTop: 5,
    borderRadius: 6,
    padding: 5,
    fontSize: 12,
  },
  submitBtn: {
    marginTop: 8,
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 12px",
    cursor: "pointer",
  },
  centered: {
    textAlign: "center",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default MyOrdersPage;
