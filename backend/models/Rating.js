// backend/models/Rating.js
const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      required: true,
    },
    comment: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate ratings by the same user for a product
ratingSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Rating", ratingSchema);
