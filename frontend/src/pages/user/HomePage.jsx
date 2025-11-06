import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api";

const HomePage = () => {
  const { user, fetchCartCount } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [userFavorites, setUserFavorites] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const BASE_URL = "http://localhost:5000";

  // ✅ Fetch all products + trending
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, trendRes] = await Promise.all([
          api.get("/api/products"),
          api.get("/api/orders/trending"),
        ]);

        const sorted = [...prodRes.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const trendingFiltered =
          trendRes.data.trending?.filter((t) => t.orderCount >= 2) || [];

        setProducts(sorted);
        setTrendingProducts(trendingFiltered);
      } catch (err) {
        console.error("❌ Error fetching home data:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch user favorites
  useEffect(() => {
    if (!user?.token) {
      setUserFavorites([]);
      return;
    }
    const fetchFavs = async () => {
      try {
        const { data } = await api.get("/api/user/favorites", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const favoriteIds = data.map((p) => p.product?._id || p._id);
        setUserFavorites(favoriteIds);
      } catch (err) {
        console.error("Failed to fetch favorites:", err);
      }
    };
    fetchFavs();
  }, [user]);

  // ✅ Add to cart (no alert)
  const handleAddToCart = async (productId) => {
    if (!user?.token) return;
    setLoadingAction(true);
    try {
      await api.post(
        "/api/user/cart",
        { productId, qty: 1 },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      await fetchCartCount();
    } catch (err) {
      console.error("Add to cart failed:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Toggle favorite (no alert)
  const handleToggleFavorite = async (productId) => {
    if (!user?.token) return;
    setLoadingAction(true);
    try {
      const { data } = await api.post(
        "/api/user/favorites/toggle",
        { productId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const isRemoved = data.message?.includes("Removed");
      setUserFavorites((prev) =>
        isRemoved ? prev.filter((id) => id !== productId) : [...prev, productId]
      );
    } catch (err) {
      console.error("Favorite toggle failed:", err);
    } finally {
      setLoadingAction(false);
    }
  };

  const trendingIds = trendingProducts.map((t) => t._id);

  const filteredProducts = products.filter((p) => {
    const matchBrand =
      selectedBrand === "All" ||
      p.brand?.toLowerCase() === selectedBrand.toLowerCase();
    const matchSearch = p.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchBrand && matchSearch;
  });

  const brands = [
    "All",
    "BMW",
    "Ferrari",
    "Audi",
    "Mercedes",
    "Lamborghini",
    "Bugatti",
  ];

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
        🚗 Scale Model Cars
      </h2>

      {/* 🔍 Search + Brand Filter */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "80%",
            maxWidth: "400px",
            padding: "10px 15px",
            borderRadius: "10px",
            border: "1px solid #3b82f6",
            background: "#1f2937",
            color: "#fff",
            fontSize: "16px",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "30px",
        }}
      >
        {brands.map((brand) => (
          <button
            key={brand}
            onClick={() => setSelectedBrand(brand)}
            style={{
              backgroundColor: selectedBrand === brand ? "#3b82f6" : "#374151",
              color: "#fff",
              border: "1px solid #3b82f6",
              borderRadius: "20px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "0.3s ease",
            }}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* 🛍️ Product Cards (Favorites style) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 20,
        }}
      >
        {filteredProducts.map((p) => {
          const imageUrl = p.image?.startsWith("http")
            ? p.image
            : `${BASE_URL}${p.image || ""}`;
          return (
            <div
              key={p._id}
              className="product-card"
              onClick={() => setSelectedProduct(p)}
              style={{
                backgroundColor: "#374151",
                borderRadius: 10,
                width: 260,
                padding: 15,
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* 🔥 Trending Tag */}
              {trendingIds.includes(p._id) && (
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    background:
                      "linear-gradient(90deg, #ef4444, #f59e0b, #ef4444)",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    zIndex: 5,
                  }}
                >
                  🔥 Trending
                </div>
              )}

              <img
                src={imageUrl || "/default.jpg"}
                alt={p.name}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 10,
                }}
                onError={(e) => (e.target.src = "/default.jpg")}
              />

              <h3 style={{ color: "#f9fafb", margin: "8px 0" }}>{p.name}</h3>
              <p
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.9em",
                  height: 50,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {p.description}
              </p>
              <p style={{ color: "#3b82f6", fontWeight: 600 }}>
                ₹{p.price || 0}
              </p>
            </div>
          );
        })}
      </div>

      {/* 🪟 Popup Modal (same logic) */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#1f2937",
              borderRadius: "15px",
              padding: "20px",
              maxWidth: "420px",
              width: "90%",
              color: "#fff",
              boxShadow: "0 0 25px rgba(59,130,246,0.6)",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "15px",
                fontSize: "20px",
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              ✖
            </button>

            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "15px",
              }}
            />
            <h2 style={{ color: "#3b82f6", fontSize: "22px" }}>
              {selectedProduct.name}
            </h2>
            <p style={{ color: "#9ca3af" }}>{selectedProduct.brand}</p>
            <p style={{ color: "#22c55e", fontSize: "18px" }}>
              ₹{selectedProduct.price}
            </p>
            <p style={{ marginTop: "10px", fontSize: "15px", color: "#d1d5db" }}>
              {selectedProduct.description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => handleAddToCart(selectedProduct._id)}
                disabled={loadingAction}
                style={{
                  flex: 1,
                  marginRight: "10px",
                  padding: "10px",
                  backgroundColor: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={() => handleToggleFavorite(selectedProduct._id)}
                disabled={loadingAction}
                style={{
                  flex: 1,
                  marginLeft: "10px",
                  padding: "10px",
                  backgroundColor: userFavorites.includes(selectedProduct._id)
                    ? "#ef4444"
                    : "#374151",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                ❤️{" "}
                {userFavorites.includes(selectedProduct._id)
                  ? "Unfavorite"
                  : "Favorite"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hover Animation */}
      <style>
        {`
          .product-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 8px 20px rgba(59,130,246,0.6);
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;
