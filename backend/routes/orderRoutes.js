import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { placeOrder, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/", protect, getMyOrders);

export default router;
