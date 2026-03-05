import User from "../../models/User.js";
import bucket from "../utils/firebase.js"; // Firebase bucket
import { v4 as uuidv4 } from "uuid";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { username, password, bio } = req.body;

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (password) user.password = password;

    // 📸 Upload profile image to Firebase
    if (req.file) {
      const filename = `profiles/${uuidv4()}-${req.file.originalname}`;
      const file = bucket.file(filename);

      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
        public: true,
      });

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

      user.image = imageUrl;
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user,
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
};