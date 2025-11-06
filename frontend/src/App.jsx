import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext"; // ✅ Added

// 🌐 Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

// 🏠 User & Auth Pages
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import FavoritesPage from "./pages/user/FavoritesPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";

// 💳 Payment Pages
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";

// 📦 Orders & Chat
import MyOrdersPage from "./pages/user/MyOrdersPage";
import OrderDetailsPage from "./pages/user/OrderDetailsPage";
import ChatPage from "./pages/user/ChatPage";

// 👤 Profile & Ratings
import ProfilePage from "./pages/user/ProfilePage";
import RatingPage from "./pages/user/RatingPage";

// 🧑‍💼 Admin Pages
import ProductManagement from "./pages/admin/ProductManagement";
import TopRatedProducts from "./pages/admin/TopRatedProducts";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main
            style={{
              minHeight: "80vh",
              backgroundColor: "#f9fafb",
              paddingBottom: "20px",
            }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<MyOrdersPage />} />
              <Route path="/order/:orderId" element={<OrderDetailsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/support-chat" element={<ChatPage />} />
              <Route path="/rate-us" element={<RatingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment-success" element={<PaymentSuccessPage />} />
              <Route path="/admin" element={<ProductManagement />} />
              <Route path="/admin/top-rated" element={<TopRatedProducts />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
