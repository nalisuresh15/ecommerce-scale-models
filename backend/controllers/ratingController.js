const Rating = require("../models/Rating");
const Product = require("../models/Product");

// ⭐ Add a rating
const addRating = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    let existing = await Rating.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existing) {
      existing.rating = rating;
      existing.comment = comment || "";
      await existing.save();
      return res.json({ message: "✅ Rating updated successfully", existing });
    }

    const newRating = await Rating.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({ message: "⭐ Rating added successfully", newRating });
  } catch (err) {
    console.error("Error adding rating:", err);
    res.status(500).json({ message: "Failed to add rating" });
  }
};

// 👤 Get all ratings by the logged-in user
const getUserRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user._id })
      .populate("product", "name image price");
    res.json(ratings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user ratings" });
  }
};

// 🏆 Get top-rated products (for admin dashboard)
const getTopRatedProducts = async (req, res) => {
  try {
    const topRated = await Rating.aggregate([
      { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
      { $sort: { avgRating: -1, count: -1 } },
      { $limit: 10 },
    ]);

    const populated = await Product.populate(topRated, { path: "_id", select: "name image price" });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch top-rated products" });
  }
};

module.exports = { addRating, getUserRatings, getTopRatedProducts };
