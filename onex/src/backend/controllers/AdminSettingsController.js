const AdminSettings = require("../models/AdminSettings");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");

/* ✅ GET current admin settings */
exports.getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) settings = await AdminSettings.create({});
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ✅ PUT - Update specific or multiple settings */
exports.updateSettings = async (req, res) => {
  try {
    let updates = {};

    if (req.body.field && req.body.value !== undefined) {
      updates[req.body.field] = req.body.value;
    } else {
      updates = req.body;
    }

    const settings = await AdminSettings.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
    });

    res.json({ success: true, settings });
  } catch (err) {
    console.error("❌ Error updating settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ✅ GET all users (for admin dropdown) */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ✅ Update admin username or password */
exports.updateAdminCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const admin = await User.findOneAndUpdate(
      { role: "admin" },
      updates,
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ success: false, error: "Admin not found" });
    }

    res.json({ success: true, message: "Admin credentials updated", admin });
  } catch (err) {
    console.error("❌ updateAdminCredentials error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ✅ Upload admin profile picture */
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    // update admin user profile pic
    const admin = await User.findOneAndUpdate(
      { role: "admin" },
      { profilePic: fileUrl },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile picture updated",
      url: fileUrl,
      admin,
    });
  } catch (err) {
    console.error("❌ uploadProfilePicture error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* ✅ DELETE user by ID */
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
