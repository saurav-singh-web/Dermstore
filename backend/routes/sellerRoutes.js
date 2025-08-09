import express from "express";
import { protect } from "../middlewares/authMiddleware.js";

import {
  registerSeller,
  loginSeller,
  getSellerDashboard,
} from "../controllers/sellerController.js";

const router = express.Router();

router.post("/register", registerSeller);
router.post("/login", loginSeller);

// 🔐 Protected route example
router.get("/dashboard", protect, getSellerDashboard);

export default router; // ✅ must be default export
