import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Seller from "../models/Seller.js";

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });

export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.create({ name, email, password });
  if (user) {
    return res.status(201).json({
      token: generateToken(user._id),
      name: user.name,
      email: user.email,
    });
  }

  return res.status(500).json({ message: "Failed to create user" });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  return res.json({
    token: generateToken(user._id),
    name: user.name,
    email: user.email,
  });
}
