// backend/controllers/orderController.js
const Order = require("../models/Order");
const Product = require("../models/Product");

// 🧾 Create a new order
const createOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    const statusUpdates = [
      {
        status: "Order Confirmed",
        timestamp: new Date(),
        location: "Warehouse",
      },
    ];

    const order = new Order({
      user: req.user._id,
      cartItems,
      totalAmount,
      status: "Confirmed",
      statusUpdates,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "✅ Order placed successfully!",
      order: savedOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({
      message: "Order creation failed",
      error: err.message,
    });
  }
};

// 🧺 Helper: format image URLs
const formatImageUrl = (req, imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return `${req.protocol}://${req.get("host")}/${imagePath}`;
};

// 📦 Get logged-in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("cartItems.product", "name price image description brand")
      .sort({ createdAt: -1 });

    if (!orders?.length) {
      return res.json({ orders: [] });
    }

    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      cartItems: order.cartItems.map((item) => ({
        qty: item.qty,
        size: item.size,
        product: item.product
          ? {
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              brand: item.product.brand,
              description: item.product.description,
              image: formatImageUrl(req, item.product.image),
            }
          : null,
      })),
    }));

    res.json({ orders: formattedOrders });
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};

// 🔍 Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "cartItems.product",
      "name price image description brand"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const formattedOrder = {
      _id: order._id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      cartItems: order.cartItems.map((item) => ({
        qty: item.qty,
        size: item.size,
        product: item.product
          ? {
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              brand: item.product.brand,
              description: item.product.description,
              image: formatImageUrl(req, item.product.image),
            }
          : null,
      })),
    };

    res.json(formattedOrder);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({
      message: "Error fetching order",
      error: err.message,
    });
  }
};

// 🔥 Get Trending Products (bought ≥ 2 times)
const getTrendingProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.product",
          totalQty: { $sum: "$cartItems.qty" },
        },
      },
      { $match: { totalQty: { $gte: 2 } } }, // ✅ bought 2+ times
      { $sort: { totalQty: -1 } },
      { $limit: 10 },
    ]);

    const trendingIds = result.map((r) => r._id);

    const trendingProducts = await Product.find({ _id: { $in: trendingIds } });

    const combined = trendingProducts.map((p) => {
      const stat = result.find(
        (r) => r._id.toString() === p._id.toString()
      );
      return {
        _id: p._id,
        name: p.name,
        price: p.price,
        brand: p.brand,
        image: formatImageUrl(req, p.image),
        orderCount: stat ? stat.totalQty : 0,
      };
    });

    res.json({ trending: combined });
  } catch (err) {
    console.error("🔥 Error fetching trending products:", err);
    res.status(500).json({ message: "Failed to load trending products" });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getTrendingProducts,
};
