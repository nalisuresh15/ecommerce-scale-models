const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: Number,
      size: String,
    },
  ],
  address: {
    name: String,
    phone: String,
    pincode: String,
    city: String,
    state: String,
    addressLine: String,
  },
  paymentMethod: String,
  totalAmount: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
