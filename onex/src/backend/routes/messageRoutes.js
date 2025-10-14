const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const auth = require("../middleware/authMiddleware");

// ✅ GET all messages for a conversation
router.get("/:conversationId", auth, async (req, res) => {
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

// ✅ POST send new message
router.post("/", auth, async (req, res) => {
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

module.exports = router;
