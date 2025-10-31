const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");

// ✅ Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Create post with image support
router.post("/", upload.single("picture"), postController.createPost);

// ✅ Existing CRUD routes
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
