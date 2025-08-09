// backend/models/Address.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: String,
    email: String,
    address: String,
    city: String,
    zip: String,
    country: String,
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
