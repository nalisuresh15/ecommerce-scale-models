const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getTrendingProducts,
  cancelOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post("/", protect, createOrder);

// Get user's orders
router.get("/myorders", protect, getMyOrders);

// Cancel order (with reason + email)
router.delete("/:id/cancel", protect, cancelOrder);

// Get trending products
router.get("/trending", getTrendingProducts);

// Get single order
router.get("/:id", protect, getOrderById);

module.exports = router;
