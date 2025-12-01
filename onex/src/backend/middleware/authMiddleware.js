const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env"); // Make sure this is imported if you use env.JWT_SECRET

module.exports = async function (req, res, next) {
  try {
    console.log("\n[AuthMiddleware] ---------------- NEW REQUEST ----------------");

    // Log incoming headers and cookies
    console.log("[AuthMiddleware] Headers:", req.headers);
    console.log("[AuthMiddleware] Cookies:", req.cookies);

    // Extract token from Authorization header or cookies
    let token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.token;

    console.log("[AuthMiddleware] Extracted token:", token);

    if (!token) {
      console.warn("[AuthMiddleware] No token provided");
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || env.JWT_SECRET);
      console.log("[AuthMiddleware] Decoded JWT payload:", decoded);
    } catch (verifyErr) {
      console.error("[AuthMiddleware] Token verification failed:", verifyErr.message);
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Ensure payload has id or _id
    const userId = decoded.id || decoded._id;
    if (!userId) {
      console.error("[AuthMiddleware] Token payload missing id/_id");
      return res.status(401).json({ error: "Invalid token payload - missing id/_id" });
    }
    console.log("[AuthMiddleware] User ID from token:", userId);

    // Fetch user from DB
    const user = await User.findById(userId).select("-password");
    console.log("[AuthMiddleware] User found in DB:", user ? user._id : "null");

    if (!user) {
      console.error("[AuthMiddleware] No user found for ID:", userId);
      return res.status(401).json({ error: "User not found" });
    }

    // Attach user to request
    req.user = user;
    console.log("[AuthMiddleware] Attached user to req.user:", req.user._id);

    next();
  } catch (err) {
    console.error("[AuthMiddleware] Unexpected error:", err);
    return res.status(500).json({ error: "Server error in auth middleware", details: err.message });
  }
};
