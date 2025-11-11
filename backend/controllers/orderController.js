const nodemailer = require("nodemailer");
const Order = require("../models/Order");
const Product = require("../models/Product");

// 📧 Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 🧾 Create Order + Send Email
 */
const createOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "No order items found" });
    }

    const order = new Order({
      user: req.user._id,
      cartItems,
      totalAmount,
      status: "Confirmed",
      statusUpdates: [{ status: "Order Confirmed", timestamp: new Date() }],
      emailSent: false,
    });

    const savedOrder = await order.save();

    if (savedOrder.emailSent) {
      return res.status(201).json({
        message: "✅ Order placed successfully (email already sent).",
        order: savedOrder,
      });
    }

    // Build product table
    const productListHTML = cartItems
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 12px;">${item.qty} × Product ID: ${item.product}</td>
        </tr>
      `
      )
      .join("");

    // Confirmation Email
    const mailOptions = {
      from: `"Scale Model Store" <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: "🧾 Order Confirmation - Scale Model Store",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;padding:20px;">
            <h2 style="color:#3b82f6;">Thank you for your order, ${
              req.user.name || "Customer"
            }! 🎉</h2>
            <p>Your order has been placed successfully.</p>

            <h3 style="color:#1f2937;">🛍️ Order Details</h3>
            <table style="width:100%;border-collapse:collapse;">${productListHTML}</table>
            <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            <p><strong>Status:</strong> ✅ Confirmed</p>
            <hr/>
            <p style="color:#6b7280;font-size:12px;">We’ll notify you once your order ships. 🚚</p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Order confirmation sent to ${req.user.email}`);
      savedOrder.emailSent = true;
      await savedOrder.save();
    } catch (err) {
      console.error("❌ Failed to send confirmation email:", err.message);
    }

    res.status(201).json({
      message: "✅ Order placed successfully and email sent!",
      order: savedOrder,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

/**
 * ❌ Cancel Order + Send Email
 */
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("cartItems.product", "name price image");

    if (!order)
      return res.status(404).json({ message: "Order not found or unauthorized" });

    const { reason } = req.body;
    if (!reason || !reason.trim())
      return res.status(400).json({ message: "Cancellation reason required" });

    // Generate cancelled product list
    const itemsHTML = order.cartItems
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 12px;">${item.product.name}</td>
          <td style="padding:8px 12px;text-align:center;">${item.qty}</td>
          <td style="padding:8px 12px;text-align:right;">₹${item.product.price}</td>
        </tr>`
      )
      .join("");

    const totalAmount = order.cartItems.reduce(
      (sum, item) => sum + item.qty * item.product.price,
      0
    );

    // Send cancellation email (user only)
    const mailOptions = {
      from: `"Scale Model Store" <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: "❌ Order Cancelled - Scale Model Store",
      html: `
        <div style="font-family:Arial,sans-serif;background:#f9fafb;padding:20px;">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;padding:20px;">
            <h2 style="color:#ef4444;">Order Cancelled ❌</h2>
            <p>Hello <strong>${req.user.name || "Customer"}</strong>,</p>
            <p>Your order has been successfully cancelled.</p>

            <h3 style="color:#b91c1c;">🛍️ Cancelled Items</h3>
            <table style="width:100%;border-collapse:collapse;margin-top:10px;">
              <thead style="background:#f3f4f6;">
                <tr>
                  <th style="padding:8px 12px;text-align:left;">Product</th>
                  <th style="padding:8px 12px;text-align:center;">Qty</th>
                  <th style="padding:8px 12px;text-align:right;">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHTML}</tbody>
              <tfoot style="background:#f3f4f6;">
                <tr>
                  <td colspan="2" style="padding:8px 12px;text-align:right;"><strong>Total:</strong></td>
                  <td style="padding:8px 12px;text-align:right;">₹${totalAmount}</td>
                </tr>
              </tfoot>
            </table>

            <p style="margin-top:20px;"><strong>Reason:</strong> <em>${reason}</em></p>
            <hr style="margin:20px 0;border:none;border-top:1px solid #e5e7eb;"/>
            <p style="font-size:13px;color:#6b7280;">
              If this was a mistake, please contact our support at 
              <a href="mailto:${process.env.EMAIL_USER}" style="color:#3b82f6;">${process.env.EMAIL_USER}</a>.
            </p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`📧 Cancellation email sent to ${req.user.email}`);
    } catch (err) {
      console.error("❌ Failed to send cancellation email:", err.message);
    }

    // Remove order
    await Order.deleteOne({ _id: order._id });

    res.json({
      message: "❌ Order cancelled successfully and email sent.",
      reason,
    });
  } catch (err) {
    console.error("❌ Error cancelling order:", err);
    res.status(500).json({ message: "Error cancelling order" });
  }
};

/**
 * 📦 Get User Orders
 */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("cartItems.product", "name price image brand description")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * 🔍 Get Order by ID
 */
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "cartItems.product",
      "name price image brand description"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error fetching order" });
  }
};

/**
 * 📈 Get Trending Products
 */
const getTrendingProducts = async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.product",
          orderCount: { $sum: "$cartItems.qty" },
        },
      },
      { $match: { orderCount: { $gte: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: 20 },
      { $project: { _id: 1, orderCount: 1 } },
    ]);

    res.json({ trending: result });
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
  cancelOrder,
};
