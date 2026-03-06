// backend/routes/postRoutes.js
import express from 'express';
import multer from 'multer';
import * as postController from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Memory storage for multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Debug middleware to log headers and content-type
router.use('/', (req, res, next) => {
  console.log('🔹 [PostRoute Debug] Method:', req.method);
  console.log('🔹 [PostRoute Debug] Content-Type:', req.headers['content-type']);
  next();
});

// Create a new post
router.post(
  '/',
  authMiddleware,
  upload.array('pictures', 5), // field name must match frontend
  postController.createPost
);

// Get all posts
router.get('/', postController.getPosts);

// Get single post
router.get('/:id', postController.getPostById);

// Update post
router.put('/:id', authMiddleware, postController.updatePost);

// Delete post
router.delete('/:id', authMiddleware, postController.deletePost);

export default router;