// backend/controllers/platformUpdatesController.js
import PlatformUpdate from "../models/PlatformUpdate.js";

// Create a new update
export const createUpdate = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newUpdate = await PlatformUpdate.create({
      title,
      description,
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
