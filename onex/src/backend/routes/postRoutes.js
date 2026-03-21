// backend/routes/postRoutes.js
import express from 'express';
import multer from 'multer';
import * as postController from '../controllers/postController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { enforceRestriction } from '../middleware/restrictionMiddleware.js';

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
  enforceRestriction('post:create'),
  upload.fields([
    { name: 'pictures', maxCount: 5 },
    { name: 'videos', maxCount: 5 },
  ]),
  postController.createPost
);

// Get all posts
router.get('/', postController.getPosts);

// Comments for a post
router.get('/:id/comments', postController.getPostComments);
router.post('/:id/comments', authMiddleware, enforceRestriction('comment:create'), postController.createPostComment);
router.put('/:id/comments/:commentId', authMiddleware, enforceRestriction('comment:update'), postController.updatePostComment);
router.delete('/:id/comments/:commentId', authMiddleware, enforceRestriction('comment:delete'), postController.deletePostComment);

// Get single post
router.get('/:id', postController.getPostById);

// Update post
router.put('/:id', authMiddleware, enforceRestriction('post:update'), postController.updatePost);

// Delete post
router.delete('/:id', authMiddleware, enforceRestriction('post:delete'), postController.deletePost);

export default router;