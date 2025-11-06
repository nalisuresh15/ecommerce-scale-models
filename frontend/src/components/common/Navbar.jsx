import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <Link to="/" style={styles.logo}>
          Scale Models
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/favorites" style={styles.link}>Favorites</Link>

          <Link to="/cart" style={styles.link}>
            🛒 Cart
            {user && (
              <span style={styles.badge}>{cartCount}</span>
            )}
          </Link>

          <Link to="/admin/top-rated" style={{ ...styles.link, color: "#fff" }}>
            ⭐ Top Rated
          </Link>

          {user?.isAdmin && (
            <Link to="/admin" style={{ ...styles.link, color: "#facc15" }}>
              🛠️ Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.link}>Signup</Link>
            </>
          ) : (
            <div style={{ position: "relative" }} ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={styles.profileBtn}
              >
                👤 {user.name}
              </button>

              {isProfileOpen && (
                <div style={styles.dropdown}>
                  <Link to="/profile" style={styles.dropdownItem}>
                    🧑‍💼 Profile
                  </Link>
                  <Link to="/orders" style={styles.dropdownItem}>
                    📦 My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{ ...styles.dropdownItem, color: "#ef4444" }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: "#111827",
    color: "#fff",
    padding: "12px 20px",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    borderBottom: "2px solid #1f2937",
    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
  },
  navContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#ef4444",
    textDecoration: "none",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  link: {
    color: "#f9fafb",
    textDecoration: "none",
    fontWeight: "500",
  },
  badge: {
    background: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    padding: "2px 8px",
    marginLeft: "5px",
    fontSize: "12px",
    fontWeight: "bold",
  },
  profileBtn: {
    backgroundColor: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    top: "38px",
    right: 0,
    backgroundColor: "#1f2937",
    borderRadius: "10px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
    zIndex: 1100,
    minWidth: "180px",
  },
  dropdownItem: {
    display: "block",
    padding: "10px 14px",
    color: "#e5e7eb",
    textDecoration: "none",
    background: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "15px",
  },
};

export default Navbar;
