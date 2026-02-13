const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");
const { authMiddleware } = require("..//middleware/authMiddleware"); // ✅ destructure the function

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// -------------------- Routes -------------------- //

// Create a new post (authenticated)
router.post(
  "/",
  authMiddleware, // ✅ use the function
  upload.array("pictures", file),
  postController.createPost
);

// Get all posts
router.get("/", postController.getPosts);

// Get a single post by ID
router.get("/:id", postController.getPostById);

// Update a post (authenticated)
router.put("/:id", authMiddleware, postController.updatePost);

// Delete a post (authenticated)
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router;
