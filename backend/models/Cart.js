// models/Cart.js
import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
});

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    items: [CartItemSchema],
    couponCode: String,
    discountAmount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
