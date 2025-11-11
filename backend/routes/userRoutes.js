const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");
const {
  toggleFavorite,
  getFavorites,
  addToCart,
  getCart,
  removeFromCart,
  getUserProfile,
  updateUserProfile,
  getUserRatings, // ✅ NEW
} = require("../controllers/userController");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Protected routes
router.use(protect);

// Profile
router
  .route("/profile")
  .get(getUserProfile)
  .put(upload.single("profileImage"), updateUserProfile);

// Favorites
router.post("/favorites/toggle", toggleFavorite);
router.get("/favorites", getFavorites);

// Cart
router.post("/cart", addToCart);
router.get("/cart", getCart);
router.delete("/cart", removeFromCart);

// ✅ NEW: Get user’s submitted ratings
router.get("/my-ratings", getUserRatings);

module.exports = router;
