const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const { uploadProfilePicture } = require("../controllers/AdminSettingsController");

/* --------------------------- 📂 Multer Setup --------------------------- */
// Ensure uploads directory exists
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

/* ----------------------------- 🖼 Profile Upload ----------------------------- */
// ✅ Upload profile picture
router.post("/picture", upload.single("profilePic"), uploadProfilePicture); // POST /api/admin/profile/picture

module.exports = router;
