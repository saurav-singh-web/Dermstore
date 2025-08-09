// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas 🎉"))
  .catch((err) => console.error("Connection error ❌", err));

// Middlewares
app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  console.error("Unhandled server error:", err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });

  next();
});
// Add listeners to track real-time connection state
mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to DB");
});
mongoose.connection.on("error", (err) => {
  console.log("❗ Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
mongoose.set("debug", true);

// Routes
app.get("/", (req, res) => res.send("API Running ✅"));

// DB Connection
// ✅ Use your `connectDB()` helper
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
connectDB();
