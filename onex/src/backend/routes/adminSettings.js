const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const {
  getSettings,
  updateSettings,
  getAllUsers,
  updateAdminCredentials,
  deleteUser,
  uploadProfilePicture,
} = require("../controllers/AdminSettingsController");

/* --------------------------- 📂 Multer Setup --------------------------- */
// Ensure uploads directory exists (prevents crash on Render or fresh deploy)
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `admin_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

/* ----------------------------- ⚙️ Admin Routes ----------------------------- */
// ✅ Core Admin Settings
router.get("/", getSettings);
router.put("/", updateSettings);

// ✅ Admin credentials management (username/password reset)
router.put("/credentials", updateAdminCredentials);

// ✅ Profile picture upload
router.post("/profile-picture", upload.single("profilePic"), uploadProfilePicture);

// ✅ User management
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);

module.exports = router;
