import express from "express";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all conversations for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "username role profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (err) {
    console.error("❌ Failed to fetch conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// POST create new conversation
router.post("/", authMiddleware, async (req, res) => {
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
    console.error("❌ Failed to create conversation:", err);
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

export default router;
