// ✅ models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      selectedSize: { type: String },
      selectedColor: { type: String },
      accessories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Accessory" }]
    }
  ],
  address: { type: Object, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
