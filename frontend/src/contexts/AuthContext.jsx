import React, { createContext, useState, useEffect } from "react";
import api from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // Load user from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Store user to localStorage
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  // Fetch cart count after login or page reload
  useEffect(() => {
    if (user?.token) fetchCartCount();
  }, [user]);

  const fetchCartCount = async () => {
    try {
      const { data } = await api.get("/api/user/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCartCount(data?.items?.length || 0);
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  };

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setCartCount(0);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        cartCount,
        setCartCount,
        fetchCartCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
