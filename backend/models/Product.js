import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    title: { type: String, required: true },
    description: String,
    category: String,
    brand: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: String,
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: String,
        rating: Number,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
