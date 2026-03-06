import express from "express";
import {
  getAllUsers,
  deleteUser,
} from "../controllers/AdminSettingsController.js";

const router = express.Router();

/* ----------------------------- 👥 Admin User Management ----------------------------- */
// ✅ Get all users
router.get("/", getAllUsers);              // GET /api/admin/users

// ✅ Delete a specific user
router.delete("/:id", deleteUser);         // DELETE /api/admin/users/:id

export default router;
