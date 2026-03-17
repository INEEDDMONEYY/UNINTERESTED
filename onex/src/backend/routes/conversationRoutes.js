import express from "express";
import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { enforceRestriction } from "../middleware/restrictionMiddleware.js";

const router = express.Router();
const WELCOME_MESSAGE =
  "Welcome to Mystery Mansion, thank you for joining our platform we are looking to make it the safest experience you could have regarding a platform like this.";

const ensureUserAdminConversation = async (userId) => {
  const admin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 }).select("_id");
  if (!admin) return;

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, admin._id] },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [userId, admin._id] });
  }

  const existingWelcome = await Message.findOne({
    conversationId: conversation._id,
    sender: admin._id,
    text: WELCOME_MESSAGE,
  }).select("_id");

  if (!existingWelcome) {
    const welcome = await Message.create({
      conversationId: conversation._id,
      sender: admin._id,
      senderId: admin._id,
      receiverId: userId,
      senderRole: "admin",
      text: WELCOME_MESSAGE,
      readBy: [admin._id],
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: welcome._id,
      updatedAt: Date.now(),
    });
  }
};

// GET all conversations for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role === "user") {
      await ensureUserAdminConversation(userId);
    }

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
router.post("/", authMiddleware, enforceRestriction("conversation:create"), async (req, res) => {
  try {
    const { recipientId } = req.body;
    const userId = req.user._id;

    if (!recipientId) {
      return res.status(400).json({ error: "recipientId is required" });
    }

    if (String(recipientId) === String(userId)) {
      return res.status(400).json({ error: "Cannot create a conversation with yourself" });
    }

    const recipient = await User.findById(recipientId).select("_id role");
    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    if (req.user.role === "user" && recipient.role !== "admin") {
      return res.status(403).json({ error: "Users can only start conversations with admins" });
    }

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
