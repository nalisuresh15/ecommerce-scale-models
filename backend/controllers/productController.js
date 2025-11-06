const Product = require("../models/Product");

/** ✅ Get all products */
const getProducts = async (req, res) => {
  try {
    const { brand, search } = req.query;
    const query = {};

    if (brand && brand !== "All") {
      query.brand = { $regex: new RegExp(brand, "i") };
    }
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

/** ✅ Get single product */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Error fetching product" });
  }
};

/** ✅ Create product */
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch {
    res.status(400).json({ message: "Failed to create product" });
  }
};

/** ✅ Update product */
const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    res.json(updated);
  } catch {
    res.status(400).json({ message: "Failed to update product" });
  }
};

/** ✅ Delete product */
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "🗑️ Product deleted successfully" });
  } catch {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

/** ⭐ Get Top Rated Products */
const getTopRatedProducts = async (req, res) => {
  try {
    const topProducts = await Product.find({ averageRating: { $gt: 3 } })
      .populate("ratings.user", "name")
      .sort({ averageRating: -1 })
      .limit(10);
    res.json(topProducts);
  } catch {
    res.status(500).json({ message: "Failed to fetch top-rated products" });
  }
};

/** ⭐ Rate a Product (Only once per user) */
const rateProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existing = product.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existing) {
      return res.status(400).json({
        message: "You have already rated this product.",
      });
    }

    product.ratings.push({ user: userId, rating, comment });

    const total = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = total / product.ratings.length;
    product.numReviews = product.ratings.length;

    await product.save();
    res.json({ message: "✅ Rating submitted successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error rating product" });
  }
};

/** 👤 Get user's submitted ratings */
const getUserRatings = async (req, res) => {
  try {
    const userId = req.user._id;
    const products = await Product.find({ "ratings.user": userId });
    const userRatings = [];

    products.forEach((p) => {
      p.ratings.forEach((r) => {
        if (r.user.toString() === userId.toString()) {
          userRatings.push({
            product: p._id,
            name: p.name,
            rating: r.rating,
            comment: r.comment,
          });
        }
      });
    });

    res.json(userRatings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user ratings" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getTopRatedProducts,
  rateProduct,
  getUserRatings,
};
