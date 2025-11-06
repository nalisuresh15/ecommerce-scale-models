const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getTrendingProducts,
} = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post("/", protect, createOrder);

// Get logged-in user's orders
router.get("/myorders", protect, getMyOrders);

// Get trending products (no auth needed)
router.get("/trending", getTrendingProducts);

// Get single order by ID
router.get("/:id", protect, getOrderById);

module.exports = router;
