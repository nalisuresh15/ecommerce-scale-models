import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleRateNow = () => {
    navigate("/rate-us");
  };

  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #111827, #1f2937)",
        color: "#f9fafb",
        padding: "40px 20px 20px",
        borderTop: "2px solid #3b82f6",
        marginTop: "60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "40px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* About Section */}
        <div style={{ flex: "1 1 250px", minWidth: "240px" }}>
          <h3
            style={{
              color: "#3b82f6",
              fontWeight: "700",
              marginBottom: "10px",
              fontSize: "1.2rem",
            }}
          >
            About Scale Models
          </h3>
          <p style={{ color: "#d1d5db", lineHeight: "1.6" }}>
            Scale Models is your one-stop destination for premium collectible
            model cars. We provide enthusiasts with top-quality replicas and
            exclusive limited-edition models.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ flex: "1 1 180px", minWidth: "150px" }}>
          <h3
            style={{
              color: "#3b82f6",
              fontWeight: "700",
              marginBottom: "10px",
              fontSize: "1.2rem",
            }}
          >
            Quick Links
          </h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li>
              <Link
                to="/"
                style={{
                  color: "#f9fafb",
                  textDecoration: "none",
                }}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                style={{
                  color: "#f9fafb",
                  textDecoration: "none",
                }}
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/favorites"
                style={{
                  color: "#f9fafb",
                  textDecoration: "none",
                }}
              >
                Favorites
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                style={{
                  color: "#f9fafb",
                  textDecoration: "none",
                }}
              >
                My Orders
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                style={{
                  color: "#f9fafb",
                  textDecoration: "none",
                }}
              >
                Login / Signup
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ flex: "1 1 180px", minWidth: "180px" }}>
          <h3
            style={{
              color: "#3b82f6",
              fontWeight: "700",
              marginBottom: "10px",
              fontSize: "1.2rem",
            }}
          >
            Contact Us
          </h3>
          <p style={{ color: "#d1d5db", marginBottom: "5px" }}>
            📧 support@scalemodels.com
          </p>
          <p style={{ color: "#d1d5db" }}>📞 +91 9391907724</p>
          <p style={{ color: "#d1d5db" }}>📍 Hyderabad, India</p>
        </div>

        {/* Feedback / Rating Section */}
        <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
          <h3
            style={{
              color: "#3b82f6",
              fontWeight: "700",
              marginBottom: "10px",
              fontSize: "1.2rem",
            }}
          >
            Feedback
          </h3>
          <p style={{ color: "#d1d5db", marginBottom: "12px" }}>
            We value your feedback! Help us improve your shopping experience.
          </p>
          <button
            onClick={handleRateNow}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            ⭐ Rate Now
          </button>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div
        style={{
          borderTop: "1px solid #374151",
          marginTop: "40px",
          paddingTop: "15px",
          textAlign: "center",
          color: "#9ca3af",
          fontSize: "14px",
        }}
      >
        &copy; {new Date().getFullYear()}{" "}
        <span style={{ color: "#3b82f6", fontWeight: "600" }}>
          Scale Models
        </span>
        . All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
