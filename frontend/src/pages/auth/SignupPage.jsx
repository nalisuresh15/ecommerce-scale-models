import React, { useState, useContext } from "react";
import api from "../../api";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      login(data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const style = {
    page: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1f2937", // Dark background
      fontFamily: "Poppins, sans-serif",
      color: "#e5e7eb",
    },
    card: {
      backgroundColor: "#374151", // Dark gray panel
      padding: "40px 50px",
      borderRadius: "16px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      width: "100%",
      maxWidth: "420px",
      textAlign: "center",
      border: "1px solid #4b5563",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "700",
      color: "#3b82f6",
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
    <div style={style.page}>
      <div style={style.card}>
        <h2 style={style.heading}>Create an Account ✨</h2>
        <form
          onSubmit={submitHandler}
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={style.input}
          />
          <input
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={style.input}
          />
          <input
            placeholder="Password"
            type="password"
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
            Sign Up
          </button>
        </form>

        <a href="/login" style={style.link}>
          Already have an account? Sign In
        </a>
      </div>
    </div>
  );
};

export default SignupPage;
