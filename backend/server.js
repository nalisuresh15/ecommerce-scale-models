// ---------------------------------------------
// 🌐 MAIN SERVER ENTRY POINT (With Email Support)
// ---------------------------------------------
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// ======================================
// 🔹 Load environment variables
// ======================================
dotenv.config();

// ======================================
// 🚀 Initialize Express App
// ======================================
const app = express();

// ======================================
// ⚙️ Middlewares
// ======================================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ======================================
// 📂 Static File Serving (Profile & Product Images)
// ======================================
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("📂 Serving uploads from:", uploadsPath);

// ======================================
// 💾 Connect MongoDB
// ======================================
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ======================================
// 🧭 Routes
// ======================================
app.get("/", (req, res) => res.send("✅ API is running successfully!"));

// ✅ Authentication Routes
app.use("/api/auth", require("./routes/authRoutes"));

// ✅ Product Management Routes
app.use("/api/products", require("./routes/productRoutes"));

// ✅ Order Handling (with Email after payment)
app.use("/api/orders", require("./routes/orderRoutes"));

// ✅ User Routes (Profile, etc.)
app.use("/api/user", require("./routes/userRoutes"));

// ✅ Ratings & Reviews Routes
app.use("/api/ratings", require("./routes/ratingRoutes"));

// ======================================
// ⚠️ 404 Handler (Unknown Routes)
// ======================================
app.use((req, res) => {
  console.warn(`⚠️ Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// ======================================
// 💥 Global Error Handler
// ======================================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ======================================
// 🚀 Start Server
// ======================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER}`);
  console.log(`👑 Admin email: ${process.env.ADMIN_EMAIL}`);
});
