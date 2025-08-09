import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { getCart, updateCart } from "../controllers/cartController.js";

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.post("/update", updateCart);
export default router;
