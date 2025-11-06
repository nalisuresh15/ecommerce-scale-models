import React, { useEffect, useState } from "react";
import api from "../../api";

const TopRatedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/api/products/top-rated");
        setProducts(data);
      } catch (err) {
        console.error("❌ Error fetching top-rated products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTopRated();
  }, []);

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>⭐ Top Rated Products</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ textAlign: "center" }}>No top-rated products yet.</p>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product._id} style={styles.card}>
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `${BASE_URL}${product.image}`
                }
                alt={product.name}
                style={styles.image}
              />
              <div style={styles.info}>
                <h3 style={styles.name}>{product.name}</h3>
                <p style={styles.brand}>{product.brand}</p>
                <p style={styles.price}>₹{product.price}</p>
                <p style={styles.rating}>
                  ⭐ {product.averageRating?.toFixed(1) || "0.0"} / 5
                </p>
                <hr style={{ borderColor: "#333" }} />
                <div style={styles.comments}>
                  {(product.ratings || []).length > 0 ? (
                    product.ratings
                      .slice(-3)
                      .reverse()
                      .map((r, i) => (
                        <p key={i} style={styles.comment}>
                          💬 <b>{r.user?.name || "User"}:</b> {r.comment}
                        </p>
                      ))
                  ) : (
                    <p style={{ color: "#9ca3af" }}>No comments yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    background: "linear-gradient(to bottom right, #111827, #1f2937)",
    color: "#fff",
    minHeight: "100vh",
    padding: "40px 20px",
  },
  heading: {
    textAlign: "center",
    color: "#3b82f6",
    fontSize: "2rem",
    marginBottom: "30px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
  },
  card: {
    width: "260px",
    backgroundColor: "#1f2937",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
  info: { padding: "15px" },
  name: { fontSize: "18px", fontWeight: 600, color: "#3b82f6" },
  brand: { fontSize: "14px", color: "#9ca3af", margin: "6px 0" },
  price: { fontSize: "16px", color: "#22c55e", fontWeight: 600 },
  rating: { fontSize: "15px", color: "#facc15", marginTop: "6px" },
  comments: { marginTop: "10px" },
  comment: { fontSize: "13px", color: "#e5e7eb", marginBottom: "6px" },
};

export default TopRatedProducts;
