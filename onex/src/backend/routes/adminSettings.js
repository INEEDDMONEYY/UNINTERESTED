const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getAllUsers,
  updateAdminCredentials,
  deleteUser,
} = require('../controllers/AdminSettingsController');

// ✅ Core admin settings
router.get('/', getSettings);
router.put('/', updateSettings);

// ✅ Admin credentials management
router.put('/credentials', updateAdminCredentials);

// ✅ Users management (for admin panel)
router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);

module.exports = router;
