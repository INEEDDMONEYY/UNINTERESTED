const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");

// ✅ Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create post with image support
router.post("/", authenticateToken, upload.single("picture"), postController.createPost);

// ✅ Existing CRUD routes
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", authenticateToken, postController.updatePost);
router.delete("/:id", authenticateToken, postController.deletePost);

module.exports = router;
