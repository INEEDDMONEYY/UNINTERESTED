const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");
const { authMiddleware } = require("../middleware/authMiddleware");

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new post
router.post(
  "/",
  authMiddleware,
  upload.array("pictures", 5),
  postController.createPost
);

// Get all posts
router.get("/", postController.getPosts);

// Get single post
router.get("/:id", postController.getPostById);

// Update
router.put("/:id", authMiddleware, postController.updatePost);

// Delete
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router; // ✅ THIS IS CRITICAL
