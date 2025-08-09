// backend/routes/productRoutes.js
import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  getAllProducts,
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/mine", protect, getMyProducts);
router.get("/me", protect, getMyProducts);
router.get("/:id", getProductById);
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
