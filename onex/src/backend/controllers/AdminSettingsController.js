const AdminSettings = require('../models/AdminSettings');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// ✅ Get current admin settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update site settings
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    const settings = await AdminSettings.findOneAndUpdate({}, updates, {
      new: true,
      upsert: true,
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all users (for admin panel dropdown)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update admin username/password
exports.updateAdminCredentials = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updates = {};

    if (username) updates.username = username;
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const admin = await User.findOneAndUpdate({ role: 'admin' }, updates, { new: true });
    res.json({ message: 'Admin credentials updated', admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete user
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
