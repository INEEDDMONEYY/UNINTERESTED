//User routes file
import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Multer setup for handling file uploads
const upload = multer({ dest: "uploads/" });

// ✅ Update-profile route with Cloudinary integration
router.post("/update-profile", async (req, res) => {
  try {
    console.log("🔹 [UserRoutes] Incoming request to /update-profile");
    console.log("🔹 [UserRoutes] req.user:", req.user ? req.user._id : "No user attached");
    console.log("🔹 [UserRoutes] req.body:", req.body);

    if (!req.user) {
      console.error("❌ [UserRoutes] Unauthorized — no user attached to request");
      return res.status(401).json({ error: "Unauthorized - no user" });
    }

    let updateData = { ...req.body };

    // ✅ Handle profilePic upload if file is present
    if (req.file) {
      console.log("🔹 [UserRoutes] Uploading profilePic to Cloudinary...");
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_pics",
      });
      updateData.profilePic = result.secure_url; // ✅ hosted Cloudinary URL
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

export default router;
