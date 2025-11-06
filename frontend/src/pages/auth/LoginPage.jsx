import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import api from "../../api";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const style = {
    pageContainer: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1f2937", // Dark background
      fontFamily: "Poppins, sans-serif",
      color: "#e5e7eb",
    },
    card: {
      backgroundColor: "#374151", // Mid-dark panel
      padding: "40px 50px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center",
      border: "1px solid #4b5563",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#3b82f6", // Highlight blue
      marginBottom: "25px",
    },
    input: {
      width: "100%",
      padding: "12px 15px",
      borderRadius: "8px",
      border: "1px solid #4b5563",
      backgroundColor: "#4b5563",
      color: "#f3f4f6",
      fontSize: "15px",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.3s",
    },
    button: {
      width: "100%",
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      padding: "12px",
      borderRadius: "8px",
      fontWeight: "600",
      border: "none",
      cursor: "pointer",
      marginTop: "12px",
      transition: "background-color 0.3s",
    },
    link: {
      color: "#9ca3af",
      fontSize: "14px",
      textDecoration: "none",
      marginTop: "12px",
      display: "block",
    },
  };

  return (
    <div style={style.pageContainer}>
      <div style={style.card}>
        <h2 style={style.heading}>Welcome Back 👋</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={style.input}
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={style.input}
          />
          <button
            type="submit"
            style={style.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Sign In
          </button>
        </form>

        <a href="#" style={style.link}>
          Forgot Password?
        </a>
        <a href="/register" style={style.link}>
          Create New Account
        </a>
      </div>
    </div>
  );
};

export default LoginPage;
