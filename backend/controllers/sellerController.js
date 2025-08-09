import Seller from "../models/Seller.js";
import jwt from "jsonwebtoken";

// JWT Helper
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/seller/register
export const registerSeller = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Seller.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const seller = await Seller.create({ name, email, password });
    const token = generateToken(seller._id);

    res.status(201).json({ token, email: seller.email, name: seller.name });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @route   POST /api/seller/login
export const loginSeller = async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email });
    if (!seller)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await seller.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = generateToken(seller._id);
    res.status(200).json({ token, email: seller.email, name: seller.name });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSellerDashboard = (req, res) => {
  console.log("req.user:", req.user);
  res.json({
    message: "Welcome to your seller dashboard",
    user: req.user, // info from token
  });
};
