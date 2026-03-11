// backend/controllers/platformUpdatesController.js
import PlatformUpdate from "../models/PlatformUpdate.js";

// Create a new update
export const createUpdate = async (req, res) => {
  try {
    const { title, description, type } = req.body;
    const safeType = type === "feature" ? "feature" : "platform";
    const newUpdate = await PlatformUpdate.create({
      title,
      description,
      type: safeType,
      createdBy: req.user._id, // assume user is authenticated
    });
    res.status(201).json(newUpdate);
  } catch (err) {
    res.status(500).json({ error: "Failed to create update", details: err.message });
  }
};

// Get all updates
export const getUpdates = async (req, res) => {
  try {
    const updates = await PlatformUpdate.find().sort({ createdAt: -1 });
    res.json(updates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch updates", details: err.message });
  }
};

// Delete update (admin only)
export const deleteUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PlatformUpdate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Update not found" });
    }

    return res.json({ success: true, message: "Update deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete update", details: err.message });
  }
};
