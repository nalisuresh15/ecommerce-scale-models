// ---------------------------------------------
// 🌐 SERVER ENTRY POINT - Updated with Ratings API
// ---------------------------------------------
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// ==================
// 🧠 MIDDLEWARE
// ==================
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// ✅ Serve static uploads (for profile & product images)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("📂 Serving uploads from:", uploadsPath);

// ==================
// 💾 CONNECT DATABASE
// ==================
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ==================
// 🧭 ROUTES
// ==================
app.get("/", (req, res) => res.send("✅ API is running successfully!"));

// Core routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/user", require("./routes/userRoutes"));

// ⭐ NEW: Ratings route (for user ratings & admin analytics)
app.use("/api/ratings", require("./routes/ratingRoutes"));

// ==================
// 🚫 404 HANDLER
// ==================
app.use((req, res) => {
  console.warn(`⚠️ Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// ==================
// 💥 GLOBAL ERROR HANDLER
// ==================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ==================
// 🚀 START SERVER
// ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
