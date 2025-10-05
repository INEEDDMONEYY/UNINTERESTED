const AdminSettings = require("../models/AdminSettings");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

/* --------------------------- 📄 Get Admin Settings --------------------------- */
exports.getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = await AdminSettings.create({});
      console.log("🆕 Created new default settings document");
    }

    res.json({ success: true, settings });
  } catch (err) {
    console.error("❌ Error fetching settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* --------------------------- 🛠 Update Admin Settings --------------------------- */
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
      setDefaultsOnInsert: true,
    });

    res.json({ success: true, settings, message: "Settings updated successfully" });
  } catch (err) {
    console.error("❌ Error updating settings:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* --------------------------- 👥 Get All Users --------------------------- */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json({ success: true, users });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* --------------------------- 🔑 Update Admin Credentials --------------------------- */
exports.updateAdminCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const updates = {};
    if (username) updates.username = username;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updatedAdmin = await User.findByIdAndUpdate(adminId, updates, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, error: "Admin user not found" });
    }

    console.log(`✅ Admin credentials updated for user ID: ${adminId}`);

    res.json({
      success: true,
      message: "Admin credentials updated successfully.",
      admin: {
        username: updatedAdmin.username,
        profilePic: updatedAdmin.profilePic,
        role: updatedAdmin.role,
      },
    });
  } catch (err) {
    console.error("❌ Error updating admin credentials:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

/* --------------------------- 🖼 Upload Profile Picture --------------------------- */
exports.uploadProfilePicture = async (req, res) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(401).json({ success: false, error: "Unauthorized" });
    if (!req.file) return res.status(400).json({ success: false, error: "No file uploaded" });

    const filePath = path.join(__dirname, `../uploads/${req.file.filename}`);
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ success: false, error: "File save failed" });
    }

    // ✅ Build public URL for Render/Vercel
    const baseUrl = process.env.BACKEND_URL || "https://your-render-backend-url.onrender.com";
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(adminId, { profilePic: imageUrl }, { new: true });

    if (!updatedUser) return res.status(404).json({ success: false, error: "Admin not found" });

    res.json({ success: true, url: imageUrl, message: "Profile picture updated" });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ success: false, error: "Failed to upload profile picture" });
  }
};

/* --------------------------- 🗑 Delete User --------------------------- */
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
