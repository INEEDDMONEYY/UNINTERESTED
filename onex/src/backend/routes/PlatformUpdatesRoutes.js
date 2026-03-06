// backend/routes/platformUpdatesRoutes.js
import express from "express";
import { createUpdate, getUpdates } from "../controllers/PlatformUpdatesController.js";
import { authMiddleware, adminOnlyMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only authenticated admins can create updates
router.post("/", authMiddleware, adminOnlyMiddleware, createUpdate);

// Authenticated users (or public if you want) can fetch all updates
router.get("/", getUpdates);

export default router;
