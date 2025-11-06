import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api";

const ProductCard = ({ product, refresh }) => {
  const { user } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const addToFavorites = async () => {
    if (!user) return alert("Please login first!");
    try {
      await api.post(
        "/api/user/favorites/toggle",
        { productId: product._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Added to favorites ❤️");
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      alert("Favorite toggle failed");
    }
  };

  const addToCart = async () => {
    if (!user) return alert("Please login first!");
    try {
      await api.post(
        "/api/user/cart",
        { productId: product._id, qty: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Added to cart 🛒");
    } catch (err) {
      console.error(err);
      alert("Add to cart failed");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      await api.put(`/api/products/${product._id}/image`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image updated successfully!");
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* 🧱 Compact Card (Home Page) */}
      <div
        style={{
          backgroundColor: "#1f2937",
          padding: "10px",
          borderRadius: "16px",
          width: "230px",
          textAlign: "center",
          transition: "0.3s",
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        <div onClick={() => setShowPopup(true)} style={{ position: "relative" }}>
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            style={{
              width: "100%",
              height: 180,
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          {user?.isAdmin && (
            <label
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "#000a",
                color: "#fff",
                padding: "4px 8px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.8rem",
              }}
            >
              {uploading ? "Uploading..." : "Change"}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        {/* ✅ Display product name */}
        <p
          style={{
            fontWeight: "600",
            color: "#3b82f6",
            fontSize: "16px",
            marginTop: "8px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={product.name} // Shows full name on hover
        >
          {product.name}
        </p>

        <p
          style={{
            color: "#3b82f6",
            fontWeight: "bold",
            fontSize: "18px",
            marginTop: "4px",
          }}
        >
          ₹ {product.price}
        </p>
      </div>

      {/* 🔍 Popup Card */}
      {showPopup && (
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1f2937",
              borderRadius: "16px",
              padding: "16px",
              width: "340px",
              textAlign: "center",
              color: "#f9fafb",
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "420px",
            }}
          >
            {/* 🖼️ Image */}
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />

            {/* 📝 Scrollable Description Section */}
            <div
              style={{
                flexGrow: 1,
                overflowY: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "#3b82f6 #1f2937",
              }}
            >
              <h3 style={{ fontSize: "18px", color: "#3b82f6" }}>
                {product.name}
              </h3>
              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                  marginTop: "6px",
                  whiteSpace: "pre-line",
                  padding: "0 5px",
                }}
              >
                {product.description}
              </p>
              <p
                style={{
                  color: "#22c55e",
                  fontWeight: "700",
                  fontSize: "18px",
                  margin: "10px 0",
                }}
              >
                ₹ {product.price}
              </p>
            </div>

            {/* 🧩 Buttons at Bottom */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "8px",
              }}
            >
              <button
                onClick={addToCart}
                style={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  flex: 1,
                  marginRight: "6px",
                }}
              >
                Add to Cart
              </button>
              <button
                onClick={addToFavorites}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#fff",
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ❤️
              </button>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginLeft: "6px",
                }}
              >
                ✖
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
