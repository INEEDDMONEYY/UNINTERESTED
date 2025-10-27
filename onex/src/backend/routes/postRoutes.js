const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Create post with image support
router.post("/", upload.single("picture"), postController.createPost);

// ✅ Existing CRUD routes
router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

module.exports = router;
