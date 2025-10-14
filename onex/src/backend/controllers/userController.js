import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js"; // if using image hosting

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { username, password, bio } = req.body;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (password) user.password = password;

    if (req.file) {
      // Upload image (Cloudinary or your file storage)
      const uploadResult = await cloudinary.uploader.upload_stream(req.file.buffer);
      user.image = uploadResult.secure_url;
    }

    await user.save();
    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
