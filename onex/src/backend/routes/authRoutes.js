// Auth Routes 
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import env from "../config/env.js";
import sendWelcomeEmail from "../utils/sendWelcomeEmail.js";
import sendResetEmail from "../utils/sendResetEmail.js";
import { ensureUserAdminConversation } from "../utils/ensureAdminWelcomeConversation.js";

// 🔐 NEW: import combined middleware
import { authMiddleware, adminOnlyMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const normalizeUsername = (value = "") =>
  value
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033]/g, '"')
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/* -------------------------- 🔑 Signup -------------------------- */
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role = "user" } = req.body;
    const normalizedUsername = normalizeUsername(username || "");
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedUsername || !normalizedEmail || !password) {
      return res.status(400).json({
        error: "Username, email, and password are required"
      });
    }

    const existingUser = await User.findOne({
      username: { $regex: `^${escapeRegex(normalizedUsername)}$`, $options: "i" },
    });
    if (existingUser) return res.status(409).json({ error: "Username already exists" });

    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) return res.status(409).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      role
    });

    await user.save();

    if (user.role === "user") {
      await ensureUserAdminConversation(user._id);
    }

    // Send welcome email after successful signup. Do not fail signup if email service has issues.
    if (user.email) {
      sendWelcomeEmail({ to: user.email, username: user.username }).catch((mailErr) => {
        console.warn("Welcome email failed:", mailErr?.message || mailErr);
      });
    }

    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Server error during signup" });
  }
});

/* -------------------------- 🔓 Signin -------------------------- */
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

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
        profilePic: user.profilePic,
        roleRestriction: user.roleRestriction,
        status: user.status,
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

    if (newUser.role === "user") {
      await ensureUserAdminConversation(newUser._id);
    }

    if (newUser.email) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      newUser.resetPasswordToken = resetToken;
      newUser.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
      await newUser.save();

      sendResetEmail({
        to: newUser.email,
        username: newUser.username,
        resetToken,
      }).catch((mailErr) => {
        console.warn("Admin setup email failed:", mailErr?.message || mailErr);
      });
    }

    res.status(201).json({
      message: "User created by admin successfully. A secure password setup email has been sent.",
      user: newUser,
    });
  } catch (err) {
    console.error("Admin create-user error:", err.message);
    res.status(500).json({ error: "Server error creating user" });
  }
});

export default router;
