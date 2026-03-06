import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { uploadProfilePicture } from "../controllers/AdminSettingsController.js";

const router = express.Router();

/* --------------------------- 📂 Multer Setup --------------------------- */
// Ensure uploads directory exists
const uploadDir = path.join(path.dirname(new URL(import.meta.url).pathname), "../uploads");
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

export default router;
