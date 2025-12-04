// Auth Routes 
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

// 🔐 NEW: import combined middleware
const { authMiddleware, adminOnlyMiddleware } = require("../middleware/authMiddleware");

/* -------------------------- 🔑 Signup -------------------------- */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required"
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ error: "Username already exists" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error during signup" });
  }
});

/* -------------------------- 🔓 Signin -------------------------- */
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signin error:", err.message);
    res.status(500).json({ error: "Server error during signin" });
  }
});

/* -------------------------- 🚪 Logout -------------------------- */
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "none", secure: true });
  res.json({ message: "Logged out successfully" });
});

/* -------------------- ✅ Get Current User -------------------- */
router.get("/me", async (req, res) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, env.JWT_SECRET);
    if (!decoded.id) return res.status(401).json({ error: "Invalid token payload" });

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Fetch current user error:", err.message);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

/* -------------------------------------------------------------------
   🛑 NEW — Admin-Only Create User Route
   Accessible only to admin users.
-------------------------------------------------------------------- */
router.post("/admin/create-user", authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(409).json({ error: "Username already exists" });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User created by admin successfully", user: newUser });
  } catch (err) {
    console.error("Admin create-user error:", err.message);
    res.status(500).json({ error: "Server error creating user" });
  }
});

module.exports = router;
