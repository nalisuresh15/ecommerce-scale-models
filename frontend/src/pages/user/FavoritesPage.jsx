import React, { useContext, useEffect, useState } from "react";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";

const FavoritesPage = () => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]); // ✅ Always an array
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5000";

  // ✅ Fetch favorites safely
  const fetchFavs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await api.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      // ✅ Handle possible undefined/null structure
      if (!data) {
        setFavorites([]);
      } else if (Array.isArray(data)) {
        setFavorites(data);
      } else if (data.favorites && Array.isArray(data.favorites)) {
        setFavorites(data.favorites);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error("❌ Error fetching favorites:", err);
      setFavorites([]); // Prevent crash if API fails
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle favorite removal
  const removeFavorite = async (productId) => {
    try {
      await api.post(
        "/api/user/favorites/toggle",
        { productId },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      setFavorites((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error("❌ Failed to remove favorite:", err);
      alert("Failed to remove favorite");
    }
  };

  useEffect(() => {
    fetchFavs();
  }, [user]);

  // ✅ Handle when user not logged in
  if (!user)
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
        Please login to see your favorites.
      </div>
    );

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
        ❤️ Your Favorite Products
      </h2>

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {!loading && favorites.length === 0 && (
        <p style={{ textAlign: "center", color: "#cbd5e1" }}>
          No favorites yet.
        </p>
      )}

      {/* ✅ Safe map - only if favorites is an array */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {Array.isArray(favorites) &&
          favorites.map((p) => {
            const imageUrl = p.image?.startsWith("http")
              ? p.image
              : `${BASE_URL}${p.image || ""}`;

            return (
              <div
                key={p._id}
                style={{
                  backgroundColor: "#374151",
                  borderRadius: 10,
                  width: 260,
                  padding: 15,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: 400,
                }}
              >
                <img
                  src={imageUrl || "/default.jpg"}
                  alt={p.name || "Product"}
                  style={{
                    width: "100%",
                    height: 150,
                    objectFit: "cover",
                    borderRadius: 8,
                    marginBottom: 10,
                  }}
                  onError={(e) => (e.target.src = "/default.jpg")}
                />
                <h3 style={{ margin: "8px 0", color: "#f9fafb" }}>
                  {p.name || "Unnamed Product"}
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    fontSize: "0.9em",
                    height: 60,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {p.description || "No description available."}
                </p>
                <p style={{ color: "#3b82f6", fontWeight: 600 }}>
                  ₹{p.price || 0}
                </p>

                <button
                  onClick={() => removeFavorite(p._id)}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    marginTop: "auto",
                  }}
                >
                  Remove from Favorites
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default FavoritesPage;
