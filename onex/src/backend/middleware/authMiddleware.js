const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    // ✅ Extract token from Authorization header or cookies
    let token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies?.token;

    console.log("[AuthMiddleware] Incoming Authorization header:", req.header("Authorization"));
    console.log("[AuthMiddleware] Extracted token:", token);

    if (!token) {
      console.warn("[AuthMiddleware] No token provided");
      return res.status(401).json({ error: "No token provided" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || env.JWT_SECRET);
    console.log("[AuthMiddleware] Decoded JWT payload:", decoded);

    // ✅ Handle both `id` and `_id` in payload
    const userId = decoded.id || decoded._id;
    if (!userId) {
      console.error("[AuthMiddleware] Invalid token payload - missing id/_id");
      return res.status(401).json({ error: "Invalid token payload - missing id/_id" });
    }

    // ✅ Find user by decoded id
    const user = await User.findById(userId).select("-password");
    console.log("[AuthMiddleware] User found:", user ? user._id : "null");

    if (!user) {
      console.error("[AuthMiddleware] User not found for id:", userId);
      return res.status(401).json({ error: "User not found" });
    }

    // ✅ Attach user to request
    req.user = user;
    console.log("[AuthMiddleware] Attached user to req.user:", req.user._id);
    next();
  } catch (err) {
    console.error("[AuthMiddleware] Auth error:", err.message || err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
