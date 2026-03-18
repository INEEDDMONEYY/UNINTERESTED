// backend/controllers/postController.js
import Post from '../models/Post.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';
import { normalizeState } from '../utils/stateNormalizer.js';

const normalizeCategories = ({ categories, category }) => {
  const rawCategories = Array.isArray(categories)
    ? categories
    : typeof categories === 'string'
      ? [categories]
      : [];

  const cleaned = rawCategories
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  if (!cleaned.length && category?.trim()) {
    cleaned.push(category.trim());
  }

  if (!cleaned.length) {
    cleaned.push('uncategorized');
  }

  return Array.from(new Set(cleaned));
};

// ---------------- Create a new post ----------------
export async function createPost(req, res) {
  try {
    if (!req.user?._id) return res.status(401).json({ error: 'Unauthorized' });

    const { title, description, city, state, country, category, categories, visibility } = req.body;
    if (!title || !description)
      return res.status(400).json({ error: 'Title and description required' });

    const promoExpiry = req.user.activePromoExpiry ? new Date(req.user.activePromoExpiry) : null;
    const hasActivePromo = Boolean(promoExpiry && !Number.isNaN(promoExpiry.getTime()) && promoExpiry > new Date());
    const effectiveCategories = normalizeCategories({ categories, category });
    const effectiveCategory = effectiveCategories[0];
    const normalizedCity = city?.trim() || '';
    const normalizedState = normalizeState(state);
    const normalizedCountry = country?.trim() || '';

    let imageUrls = [];
    let videoUrls = [];

    const uploadedFiles = Array.isArray(req.files)
      ? req.files
      : [
          ...(Array.isArray(req.files?.pictures) ? req.files.pictures : []),
          ...(Array.isArray(req.files?.videos) ? req.files.videos : []),
        ];

    // Upload files to Cloudinary and split by media type.
    if (uploadedFiles.length > 0) {
      const uploadPromises = uploadedFiles.map((file) =>
        new Promise((resolve, reject) => {
          const isVideo = file.mimetype?.startsWith('video/');
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'posts', resource_type: 'auto' },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                type: isVideo ? 'video' : 'image',
              });
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        })
      );

      const uploadedMedia = await Promise.all(uploadPromises);
      imageUrls = uploadedMedia.filter((m) => m.type === 'image').map((m) => m.url);
      videoUrls = uploadedMedia.filter((m) => m.type === 'video').map((m) => m.url);
      console.log('✅ Uploaded images to Cloudinary:', imageUrls);
      console.log('✅ Uploaded videos to Cloudinary:', videoUrls);
    }

    const newPost = new Post({
      userId: req.user._id,
      title,
      description,
      city: normalizedCity,
      state: normalizedState,
      country: normalizedCountry,
      category: effectiveCategory,
      categories: effectiveCategories,
      visibility,
      pictures: imageUrls,
      videos: videoUrls,
      isPromo: hasActivePromo,
      promoExpiresAt: hasActivePromo ? promoExpiry : null,
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate({
      path: 'userId',
      select: 'username email bio profilePic phoneNumber age availability incallPrice outcallPrice activePromoExpiry createdAt',
    });

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error('❌ [createPost] Error:', err);
    res
      .status(500)
      .json({ error: 'Failed to create post', details: err.message });
  }
}

// ---------------- Get all posts ----------------
export async function getPosts(req, res) {
  try {
    const { userId, state, city } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (state) filter.state = state;
    if (city) filter.city = city;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate({ path: 'userId', select: 'username email bio profilePic phoneNumber age availability incallPrice outcallPrice activePromoExpiry createdAt' });

    res.json(posts);
  } catch (err) {
    console.error('❌ [getPosts] Error:', err);
    res.status(500).json({ error: 'Failed to fetch posts', details: err.message });
  }
}

// ---------------- Get post by ID ----------------
export async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: 'userId',
      select: 'username email bio profilePic phoneNumber age availability incallPrice outcallPrice activePromoExpiry createdAt',
    });

    if (!post) return res.status(404).json({ error: 'Post not found' });

    res.json(post);
  } catch (err) {
    console.error('❌ [getPostById] Error:', err);
    res.status(500).json({ error: 'Failed to fetch post', details: err.message });
  }
}

// ---------------- Update post ----------------
export async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const updateData = { ...req.body };

    if (Object.prototype.hasOwnProperty.call(updateData, 'categories') || Object.prototype.hasOwnProperty.call(updateData, 'category')) {
      const effectiveCategories = normalizeCategories({
        categories: updateData.categories,
        category: updateData.category,
      });
      updateData.categories = effectiveCategories;
      updateData.category = effectiveCategories[0];
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate({
      path: 'userId',
      select: 'username email bio profilePic phoneNumber age availability incallPrice outcallPrice activePromoExpiry',
    });

    res.json(updatedPost);
  } catch (err) {
    console.error('❌ [updatePost] Error:', err);
    res.status(500).json({ error: 'Failed to update post', details: err.message });
  }
}

// ---------------- Delete post ----------------
export async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    console.error('❌ [deletePost] Error:', err);
    res.status(500).json({ error: 'Failed to delete post', details: err.message });
  }
}