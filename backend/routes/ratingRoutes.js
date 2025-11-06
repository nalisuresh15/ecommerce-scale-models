const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addRating,
  getUserRatings,
  getTopRatedProducts,
} = require("../controllers/ratingController");

const router = express.Router();

// Add rating for a product
router.post("/", protect, addRating);

// Get all ratings for logged-in user
router.get("/user", protect, getUserRatings);

// Admin: Get top-rated products
router.get("/top", getTopRatedProducts);

module.exports = router;
