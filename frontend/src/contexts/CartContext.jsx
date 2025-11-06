import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import api from "../api";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await api.get("/api/user/cart", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const totalItems = data.items.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(totalItems);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [user]);

  const updateCartCount = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <CartContext.Provider value={{ cartCount, fetchCartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
