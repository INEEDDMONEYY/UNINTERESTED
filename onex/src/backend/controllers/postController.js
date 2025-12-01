const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

/* -------------------------------------------------------------------------- */
/* 📝 Create a new post                                                      */
/* -------------------------------------------------------------------------- */
exports.createPost = async (req, res) => {
  try {
    console.log("🔹 [createPost] req.user:", req.user); // ✅ Debug: ensure user is attached

    if (!req.user || !req.user._id) {
      console.error("❌ [createPost] Missing req.user or req.user._id");
      return res.status(401).json({ error: "Unauthorized - no user attached" });
    }

    const { description, city, state, category, visibility, title } = req.body;

    if (!description || !title) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    let imageUrl = null;

    // Upload Cloudinary image if included
    if (req.file) {
      try {
        const streamUpload = () =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "posts" },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
          });

        const result = await streamUpload();
        imageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload failed:", uploadErr);
        return res.status(500).json({ error: "Image upload failed" });
      }
    }

    // ✅ Debug: show userId before saving
    console.log("🔹 [createPost] Saving new post with userId:", req.user._id.toString());

    const newPost = new Post({
      userId: req.user._id, // ✅ Ensure this is set
      title,
      description,
      city,
      state,
      category,
      visibility,
      picture: imageUrl,
    });

    const saved = await newPost.save();

    // Return populated post info with strictPopulate: false
    const populatedPost = await Post.findById(saved._id).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false, // ✅ override strictPopulate
    });

    console.log("✅ [createPost] Post created successfully:", populatedPost._id);
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("❌ [createPost] Error creating post:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📜 Get all posts                                                          */
/* -------------------------------------------------------------------------- */
exports.getPosts = async (req, res) => {
  try {
    const { userId, state, city } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (state) filter.state = state;
    if (city) filter.city = city;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        select: "username bio profilePic",
        strictPopulate: false,
      });

    res.json(posts);
  } catch (err) {
    console.error("❌ [getPosts] Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📄 Get a single post by ID                                                 */
/* -------------------------------------------------------------------------- */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false,
    });

    if (!post) return res.status(404).json({ error: "Post not found" });

    res.json(post);
  } catch (err) {
    console.error("❌ [getPostById] Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ Update post                                                             */
/* -------------------------------------------------------------------------- */
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Only post owner or admin can update
    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this post" });
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false,
    });

    res.json(updated);
  } catch (err) {
    console.error("❌ [updatePost] Error updating post:", err);
    res.status(500).json({ error: "Failed to update post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ❌ Delete post                                                             */
/* -------------------------------------------------------------------------- */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Only post owner or admin can delete
    if (post.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ [deletePost] Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
};
