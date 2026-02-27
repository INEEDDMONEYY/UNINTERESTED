const Post = require("../models/Post");
const bucket = require("../utils/firebase");
const { v4: uuidv4 } = require("uuid"); // unique filenames

// ---------------- Create a new post ----------------
async function createPost(req, res) {
  try {
    if (!req.user?._id) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, city, state, category, visibility } = req.body;
    if (!title || !description)
      return res.status(400).json({ error: "Title and description required" });

    let imageUrls = [];

    // Upload files to Firebase Storage
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const filename = `posts/${uuidv4()}-${file.originalname}`;
        const fileRef = bucket.file(filename);

        await fileRef.save(file.buffer, {
          contentType: file.mimetype,
          public: true, // makes the URL publicly accessible
        });

        return `https://storage.googleapis.com/${bucket.name}/${filename}`;
      });

      imageUrls = await Promise.all(uploadPromises);
      console.log("✅ Uploaded images to Firebase:", imageUrls);
    }

    const newPost = new Post({
      userId: req.user._id,
      title,
      description,
      city,
      state,
      category,
      visibility,
      pictures: imageUrls,
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate({
      path: "userId",
      select: "username bio profilePic",
    });

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("❌ [createPost] Error:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
}

// ---------------- Get all posts ----------------
async function getPosts(req, res) {
  try {
    const { userId, state, city } = req.query;
    const filter = {};
    if (userId) filter.userId = userId;
    if (state) filter.state = state;
    if (city) filter.city = city;

    const posts = await Post.find(filter).sort({ createdAt: -1 }).populate({
      path: "userId",
      select: "username bio profilePic",
    });

    res.json(posts);
  } catch (err) {
    console.error("❌ [getPosts] Error:", err);
    res.status(500).json({ error: "Failed to fetch posts", details: err.message });
  }
}

// ---------------- Get post by ID ----------------
async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username bio profilePic",
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("❌ [getPostById] Error:", err);
    res.status(500).json({ error: "Failed to fetch post", details: err.message });
  }
}

// ---------------- Update post ----------------
async function updatePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate({
      path: "userId",
      select: "username bio profilePic",
    });

    res.json(updatedPost);
  } catch (err) {
    console.error("❌ [updatePost] Error:", err);
    res.status(500).json({ error: "Failed to update post", details: err.message });
  }
}

// ---------------- Delete post ----------------
async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ [deletePost] Error:", err);
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
};