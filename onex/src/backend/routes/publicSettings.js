import express from "express";
import { getPublicDevMessage } from "../controllers/AdminSettingsController.js";

const router = express.Router();

// Public read-only endpoint for developer message shown in header.
router.get("/dev-message", getPublicDevMessage);

export default router;
