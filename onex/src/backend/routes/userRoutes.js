const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const env = require('../config/env');

// Ensure profile-pics folder exists
if (!fs.existsSync(env.PROFILE_PICS_PATH)) {
  fs.mkdirSync(env.PROFILE_PICS_PATH, { recursive: true });
}

// ------------------------ Multer Setup ------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.PROFILE_PICS_PATH),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}-${Date.now()}${ext}`);
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

    if (req.file) {
      const imagePath = `/uploads/profile-pics/${req.file.filename}`;
      updateData.profilePic = `${env.SERVER_URL}${imagePath}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

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
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.error('❌ Get user profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user info' });
  }
});

// ------------------------ Get All Users ------------------------
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
