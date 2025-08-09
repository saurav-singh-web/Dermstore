// routes/products.js
import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET /api/products?search=keyword
router.get("/", async (req, res) => {
  try {
    const searchTerm = req.query.search || "";
    console.log("Search term received:", searchTerm);

    let filter = {};
    if (searchTerm.trim()) {
      // Change 'name' to match your schema field
      filter = { name: { $regex: searchTerm, $options: "i" } };
    }

    const products = await Product.find(filter).limit(50);
    console.log("Products found:", products.length);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
