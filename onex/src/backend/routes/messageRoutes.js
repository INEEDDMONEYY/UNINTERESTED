import express from "express";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { enforceRestriction } from "../middleware/restrictionMiddleware.js";

const router = express.Router();

// GET all messages for a conversation
router.get("/:conversationId", authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate("sender", "username role profilePic")
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Failed to fetch messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST send new message
router.post("/", authMiddleware, enforceRestriction("message:send"), async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    const senderId = req.user.id;

    const message = await Message.create({
      conversationId,
      sender: senderId,
      text,
    });

    // Update conversation's lastMessage
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      updatedAt: Date.now(),
    });

    const populated = await message.populate(
      "sender",
      "username role profilePic"
    );
    res.status(201).json(populated);
  } catch (err) {
    console.error("❌ Failed to send message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
