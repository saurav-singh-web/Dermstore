// backend/models/Order.js

import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    quantity: { type: Number, required: true },
    priceAtAdding: { type: Number, required: true },
  },
  quantity: { type: Number, required: true },
  priceAtAdding: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [OrderItemSchema],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  couponCode: { type: String },
  discountAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
