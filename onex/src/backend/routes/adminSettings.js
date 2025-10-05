const express = require("express");
const multer = require("multer");
const path = require("path");
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
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `admin_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

/* ----------------------------- ⚙️ Admin Routes ----------------------------- */
// ✅ Core admin settings
router.get("/", getSettings);
router.put("/", updateSettings);

// ✅ Admin credentials management
router.put("/credentials", updateAdminCredentials);

// ✅ Profile picture upload (new)
router.post("/profile-picture", upload.single("profilePic"), uploadProfilePicture);

// ✅ Users management (for admin panel)
router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);

module.exports = router;
