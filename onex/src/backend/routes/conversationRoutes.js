const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');

// GET all conversations for the logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username role profilePic')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// POST create new conversation
router.post('/', async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user.id;

    const existing = await Conversation.findOne({
      participants: { $all: [userId, recipientId] },
    });

    if (existing) return res.json(existing);

    const newConv = await Conversation.create({
      participants: [userId, recipientId],
    });

    res.status(201).json(newConv);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

module.exports = router;
