const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  deleteUser,
} = require("../controllers/AdminSettingsController");

/* ----------------------------- 👥 Admin User Management ----------------------------- */
// ✅ Get all users
router.get("/", getAllUsers);              // GET /api/admin/users

// ✅ Delete a specific user
router.delete("/:id", deleteUser);         // DELETE /api/admin/users/:id

module.exports = router;
