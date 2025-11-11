// backend/controllers/userController.js
const User = require("../models/User");
const Product = require("../models/Product");
const Rating = require("../models/Rating"); // ✅ Added
const fs = require("fs");
const path = require("path");

// ✅ Get Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update Profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.gender = req.body.gender || user.gender;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.mobile = req.body.mobile || user.mobile;
    user.address = req.body.address || user.address;

    if (req.file) {
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (user.profileImage) {
        const oldPath = path.join(uploadsDir, path.basename(user.profileImage));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "✅ Profile updated successfully!", user });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// ✅ Toggle Favorites
const toggleFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favorites.indexOf(productId);
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(productId);
    }
    await user.save();

    res.json({ message: "✅ Favorites updated", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update favorites",
      error: err.message,
    });
  }
};

// ✅ Get Favorites
const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch favorites",
      error: err.message,
    });
  }
};

// ✅ Add / Update Cart
const addToCart = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);
    if (!user || !product)
      return res.status(404).json({ message: "User or Product not found" });

    const existing = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (existing) {
      existing.qty = qty || existing.qty;
    } else {
      user.cart.push({ product: productId, qty: qty || 1 });
    }

    await user.save();
    const populatedUser = await User.findById(req.user.id).populate("cart.product");
    res.json(populatedUser.cart);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update cart",
      error: err.message,
    });
  }
};

// ✅ Get Cart
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    res.json({ items: user.cart || [] });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch cart",
      error: err.message,
    });
  }
};

// ✅ Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();

    const populatedUser = await User.findById(req.user.id).populate("cart.product");
    res.json({ items: populatedUser.cart });
  } catch (err) {
    res.status(500).json({
      message: "Failed to remove item",
      error: err.message,
    });
  }
};

// ✅ Get all ratings by logged-in user
const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const ratings = await Rating.find({ user: userId })
      .populate("product", "name price image")
      .sort({ createdAt: -1 });

    if (!ratings.length)
      return res.json([]);

    res.json(
      ratings.map((r) => ({
        product: r.product?._id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      }))
    );
  } catch (err) {
    console.error("❌ Error fetching user ratings:", err);
    res.status(500).json({
      message: "Failed to fetch user ratings",
      error: err.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  toggleFavorite,
  getFavorites,
  addToCart,
  getCart,
  removeFromCart,
  getUserRatings, // ✅ Added export
};
