const express = require("express");
const router = express.Router();
const multer = require("multer");
const postController = require("../controllers/postController");
const { authMiddleware } = require("../middleware/authMiddleware");

// ✅ Memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ----------------- Debug Middleware -----------------
// Logs headers and confirms content type
const logRequestMiddleware = (req, res, next) => {
  console.log("\n🔹 [PostRoute] Incoming request");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Content-Type:", req.headers["content-type"]);
  next();
};

// ----------------- Create a new post -----------------
router.post(
  "/",
  logRequestMiddleware,          // <-- log everything
  authMiddleware,
  upload.array("pictures", 5),
  (req, res, next) => {
    console.log("🔹 req.files:", req.files);
    if (!req.files || req.files.length === 0) {
      console.warn(
        "⚠️ No files found in req.files. pictures array will be empty."
      );
    }
    next();
  },
  postController.createPost
);

// ----------------- Get all posts -----------------
router.get("/", postController.getPosts);

// ----------------- Get single post -----------------
router.get("/:id", postController.getPostById);

// ----------------- Update post -----------------
router.put("/:id", authMiddleware, postController.updatePost);

// ----------------- Delete post -----------------
router.delete("/:id", authMiddleware, postController.deletePost);

module.exports = router; // ✅ THIS IS CRITICAL
