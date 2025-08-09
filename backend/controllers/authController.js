import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Seller from "../models/Seller.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.create({ name, email, password });
  if (user) {
    res.json({ token: generateToken(user._id), name, email });
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return res.status(201).json({ token, name: user.name, email: user.email });
}

export async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return res.json({ token, name: user.name, email: user.email });
}
