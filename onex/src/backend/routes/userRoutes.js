//User routes file
import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Review from "../models/Review.js";
import Profile from "../models/Profiles.js";
import PromoCode from "../models/PromoCode.js";
import { enforceRestriction } from "../middleware/restrictionMiddleware.js";

const router = express.Router();
const looksLikeEmail = (value = "") => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

// ✅ Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Update-profile route with Cloudinary integration
router.post("/update-profile", enforceRestriction("profile:update"), upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "bannerPic", maxCount: 1 },
]), async (req, res) => {
  try {
    console.log("🔹 [UserRoutes] Incoming request to /update-profile");
    console.log("🔹 [UserRoutes] req.user:", req.user ? req.user._id : "No user attached");
    console.log("🔹 [UserRoutes] req.body:", req.body);

    if (!req.user) {
      console.error("❌ [UserRoutes] Unauthorized — no user attached to request");
      return res.status(401).json({ error: "Unauthorized - no user" });
    }

    let updateData = { ...req.body };
    const profilePicFile = req.files?.profilePic?.[0] || null;
    const bannerPicFile = req.files?.bannerPic?.[0] || null;

    if (typeof updateData.username === "string") {
      const normalizedUsername = updateData.username.trim();
      if (!normalizedUsername) {
        return res.status(400).json({ error: "Username cannot be empty" });
      }
      if (looksLikeEmail(normalizedUsername)) {
        return res.status(400).json({ error: "Username cannot be an email address" });
      }

      const existingUser = await User.findOne({
        username: { $regex: `^${normalizedUsername.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
        _id: { $ne: req.user._id },
      }).select("_id");

      if (existingUser) {
        return res.status(409).json({ error: "Username already exists" });
      }

      updateData.username = normalizedUsername;
    }

    if (typeof updateData.email === "string") {
      const normalizedEmail = updateData.email.trim().toLowerCase();
      if (!normalizedEmail) {
        return res.status(400).json({ error: "Email cannot be empty" });
      }
      if (!looksLikeEmail(normalizedEmail)) {
        return res.status(400).json({ error: "Please provide a valid email address" });
      }

      const existingEmail = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: req.user._id },
      }).select("_id");

      if (existingEmail) {
        return res.status(409).json({ error: "Email already registered" });
      }

      updateData.email = normalizedEmail;
    }

    // ✅ Handle profilePic upload if file is present
    if (profilePicFile) {
      console.log("🔹 [UserRoutes] Uploading profilePic to Cloudinary...");
      const result = await cloudinary.uploader.upload(profilePicFile.path, {
        folder: "profile_pics",
      });
      updateData.profilePic = result.secure_url; // ✅ hosted Cloudinary URL
    }

    // ✅ Handle bannerPic upload if file is present
    if (bannerPicFile) {
      console.log("🔹 [UserRoutes] Uploading bannerPic to Cloudinary...");
      const result = await cloudinary.uploader.upload(bannerPicFile.path, {
        folder: "profile_banners",
      });
      updateData.bannerPic = result.secure_url;
    }

    // ✅ Perform update
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      console.error("❌ [UserRoutes] User not found in DB for id:", req.user._id);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("✅ [UserRoutes] Updated user:", updatedUser._id);
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("🚨 [UserRoutes] Error updating profile:", err);
    res.status(500).json({
      error: "Failed to update profile",
      details: err.message || err,
    });
  }
});

// ✅ Delete current user's account and related data
router.delete("/delete-account", async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    // Remove user-owned data to keep the platform clean after account deletion.
    const [postsResult, messagesResult, conversationsResult, reviewsResult, profileResult] =
      await Promise.all([
        Post.deleteMany({ userId }),
        Message.deleteMany({ $or: [{ senderId: userId }, { receiverId: userId }] }),
        Conversation.deleteMany({ participants: userId }),
        Review.deleteMany({ $or: [{ authorUserId: userId }, { targetUserId: userId }] }),
        Profile.deleteOne({ userId }),
      ]);

    // Remove references to this user from promo code assignment/redemption history.
    await Promise.all([
      PromoCode.updateMany(
        { assignedUser: userId },
        { $set: { assignedUser: null } }
      ),
      PromoCode.updateMany(
        { "redemptions.userId": userId },
        { $pull: { redemptions: { userId } } }
      ),
    ]);

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });

    return res.json({
      success: true,
      message: "Account and related data deleted successfully",
      data: {
        deletedPosts: postsResult.deletedCount || 0,
        deletedMessages: messagesResult.deletedCount || 0,
        deletedConversations: conversationsResult.deletedCount || 0,
        deletedReviews: reviewsResult.deletedCount || 0,
        deletedProfile: profileResult.deletedCount || 0,
      },
    });
  } catch (err) {
    console.error("🚨 [UserRoutes] Error deleting account:", err);
    return res.status(500).json({
      error: "Failed to delete account",
      details: err.message || err,
    });
  }
});

export default router;
