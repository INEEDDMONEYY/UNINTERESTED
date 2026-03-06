import express from "express";
import {
  getSettings,
  updateSettings,
  updateAdminCredentials,
} from "../controllers/AdminSettingsController.js";

const router = express.Router();

/* ----------------------------- ⚙️ Admin Settings Routes ----------------------------- */
// ✅ Core site and admin settings
router.get("/", getSettings);             // GET /api/admin/settings
router.put("/", updateSettings);          // PUT /api/admin/settings

// ✅ Admin credentials (username/password)
router.put("/credentials", updateAdminCredentials);  // PUT /api/admin/settings/credentials

export default router;
