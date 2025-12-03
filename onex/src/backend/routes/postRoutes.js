const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");
const authenticateToken = require("../middleware/authMiddleware");

// Use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Correct route order
router.post(
  "/",
  authenticateToken,
  upload.array("pictures", 10),
  postController.createPost
);

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", authenticateToken, postController.updatePost);
router.delete("/:id", authenticateToken, postController.deletePost);

module.exports = router;
