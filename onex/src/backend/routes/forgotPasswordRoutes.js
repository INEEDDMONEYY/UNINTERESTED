// routes/forgotPasswordRoutes.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const sendResetEmail = require("../utils/sendResetEmail"); // updated import

/* ------------------------ 🔑 Forgot Password ------------------------ */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Security: do not reveal whether email exists
      return res.json({
        message: "If the email exists, a reset link has been sent",
      });
    }

    // Generate a secure one-time token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiration to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email using updated sendResetEmail utility
    await sendResetEmail({
      to: user.email,
      username: user.username,
      resetToken,
    });

    res.json({
      message: "If the email exists, a reset link has been sent",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
