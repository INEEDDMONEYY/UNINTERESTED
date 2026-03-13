import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import PromoCode from '../models/PromoCode.js';

const router = express.Router();

const normalizeUsername = (value = '') => String(value).trim().toLowerCase();

// GET currently promoted users (public, no auth)
router.get('/promoted', async (req, res) => {
  try {
    const now = new Date();
    const promoCodes = await PromoCode.find({
      isActive: true,
      redemptions: { $elemMatch: { expiresAt: { $gt: now } } },
    }).select('redemptions');

    const expiryByUserId = new Map();

    promoCodes.forEach((promo) => {
      const redemptions = Array.isArray(promo.redemptions) ? promo.redemptions : [];
      redemptions.forEach((entry) => {
        if (!entry?.userId || !entry?.expiresAt) return;
        const expiresAt = new Date(entry.expiresAt);
        if (Number.isNaN(expiresAt.getTime()) || expiresAt <= now) return;

        const key = entry.userId.toString();
        const current = expiryByUserId.get(key);
        if (!current || expiresAt > current) {
          expiryByUserId.set(key, expiresAt);
        }
      });
    });

    const promotedUserIds = [...expiryByUserId.keys()];
    if (promotedUserIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const users = await User.find({
      _id: { $in: promotedUserIds },
      status: { $ne: 'suspended' },
    }).select('-password -resetPasswordToken -resetPasswordExpires -email');

    const promotedUsers = users
      .map((user) => {
        const obj = user.toObject();
        const expiresAt = expiryByUserId.get(String(user._id));
        return {
          ...obj,
          activePromoExpiry: expiresAt ? expiresAt.toISOString() : obj.activePromoExpiry,
        };
      })
      .sort((a, b) => new Date(a.activePromoExpiry) - new Date(b.activePromoExpiry));

    return res.status(200).json({ success: true, data: promotedUsers });
  } catch (err) {
    console.error('\u274c Failed to fetch promoted users', err);
    return res.status(500).json({ error: 'Failed to fetch promoted users' });
  }
});

// GET user by id (public, no auth)
router.get('/id/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    const user = await User.findById(userId).select(
      '-password -resetPasswordToken -resetPasswordExpires -email'
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    console.error('\u274c Failed to fetch user by id', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// GET user by username (public, no auth)
router.get('/:username', async (req, res) => {
  try {
    const username = normalizeUsername(req.params.username);
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const user = await User.findOne({
      username: { $regex: `^${username}$`, $options: 'i' },
    }).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error('❌ Failed to fetch user by username', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

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

export default router;
