const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users (public, no auth)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // hide passwords
    res.status(200).json(users);
  } catch (err) {
    console.error('❌ Failed to fetch users', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
