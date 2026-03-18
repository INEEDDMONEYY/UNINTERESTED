import Conversation from "../models/Conversation.js";
import User from "../models/User.js";
import Message from "../models/Message.js";

const WELCOME_MESSAGE = `Welcome to Mystery Mansion 🎉🎊 — glad to have you here.

You can post your ad for free and start getting exposure right away.

To activate your promo:

• Complete your profile (photo + bio + age + gender).
• Create your first post & redeem code upon post creation (or activate it in dashboard settings).


Early profiles are getting homepage promotion + a Founding Provider badge (limited).

If you need anything, just message support — the platform is actively monitored for safety.`;

export const getPrimaryAdminId = async () => {
  const admin = await User.findOne({ role: "admin" }).sort({ createdAt: 1 }).select("_id");
  return admin?._id || null;
};

export const ensureUserAdminConversation = async (userId, providedAdminId = null) => {
  if (!userId) return null;

  const adminId = providedAdminId || (await getPrimaryAdminId());
  if (!adminId) return null;

  let conversation = await Conversation.findOne({
    participants: { $all: [userId, adminId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({ participants: [userId, adminId] });
  }

  const existingWelcome = await Message.findOne({
    conversationId: conversation._id,
    sender: adminId,
    text: WELCOME_MESSAGE,
  }).select("_id");

  if (!existingWelcome) {
    const welcome = await Message.create({
      conversationId: conversation._id,
      sender: adminId,
      senderId: adminId,
      receiverId: userId,
      senderRole: "admin",
      text: WELCOME_MESSAGE,
      readBy: [adminId],
    });

    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessage: welcome._id,
      updatedAt: Date.now(),
    });
  }

  return conversation;
};

export const ensureAdminConversationsForAllUsers = async (adminId) => {
  if (!adminId) return;

  const users = await User.find({ role: "user" }).select("_id");
  await Promise.all(users.map((u) => ensureUserAdminConversation(u._id, adminId)));
};
