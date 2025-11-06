const express = require("express");
const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  getTopRatedProducts,
  rateProduct,
  getUserRatings,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get("/top-rated", getTopRatedProducts);
router.get("/my-ratings", protect, getUserRatings);
router.post("/:id/rate", protect, rateProduct);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
