const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  getAllUsers,
  deleteUser,
} = require('../controllers/AdminSettingsController');
const User = require('../models/User');

// ✅ Multer storage for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) return cb(new Error('Only images allowed'));
    cb(null, true);
  },
});

// ✅ Get all users
router.get('/users', getAllUsers);

// ✅ Delete a user
router.delete('/user/:id', deleteUser);

// ✅ Upload profile picture
router.post('/profile-picture', upload.single('profilePic'), async (req, res) => {
  try {
    const fileUrl = `/uploads/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.id, { profilePic: fileUrl });
    res.json({ message: 'Profile picture uploaded successfully', url: fileUrl });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

module.exports = router;
