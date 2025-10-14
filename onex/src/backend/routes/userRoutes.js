const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// ------------------------ Multer Setup ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/profile-pics');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${req.user.id}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

// ------------------------ Update Profile ------------------------
router.put('/update-profile', upload.single('profilePic'), async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password, bio } = req.body;
    const updateData = {};

    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (bio) updateData.bio = bio;
    if (req.file) updateData.profilePic = `/uploads/profile-pics/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({
      message: 'Profile updated successfully',
      updatedUser: {
        username: updatedUser.username,
        bio: updatedUser.bio || '',
        profilePic: updatedUser.profilePic || '',
        role: updatedUser.role,
        _id: updatedUser._id,
      },
    });
  } catch (err) {
    console.error('❌ Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ------------------------ Get Current User ------------------------
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Get user error:', err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

module.exports = router;
