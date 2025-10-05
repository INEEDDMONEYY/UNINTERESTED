const express = require("express");
const router = express.Router();

const {
  getSettings,
  updateSettings,
  updateAdminCredentials,
} = require("../controllers/AdminSettingsController");

/* ----------------------------- ⚙️ Admin Settings Routes ----------------------------- */
// ✅ Core site and admin settings
router.get("/", getSettings);             // GET /api/admin/settings
router.put("/", updateSettings);          // PUT /api/admin/settings

// ✅ Admin credentials (username/password)
router.put("/credentials", updateAdminCredentials);  // PUT /api/admin/settings/credentials

module.exports = router;
