const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  updateAdminCredentials,
} = require('../controllers/AdminSettingsController');

// ✅ Get or update admin site settings
router.get('/', getSettings);
router.put('/', updateSettings);

// ✅ Update admin username/password
router.put('/credentials', updateAdminCredentials);

module.exports = router;
