// backend/routes/platformUpdatesRoutes.js
const express = require("express");
const { createUpdate, getUpdates } = require("../controllers/PlatformUpdatesController");
const { authMiddleware, adminOnlyMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Only authenticated admins can create updates
router.post("/", authMiddleware, adminOnlyMiddleware, createUpdate);

// Authenticated users (or public if you want) can fetch all updates
router.get("/", getUpdates);

module.exports = router;
