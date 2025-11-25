const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

/* -------------------------------------------------------------------------- */
/* 📝 Create a new post                                                      */
/* -------------------------------------------------------------------------- */
exports.createPost = async (req, res) => {
  try {
    const { description, city, state, category, visibility, title } = req.body;

    // ✅ Require description + title
    if (!description || !title) {
      return res.status(400).json({ error: "Title and description are required." });
    }

    // ✅ Ensure authenticated user is attached
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - no user attached" });
    }

    let imageUrl = null;

    // ✅ Upload image to Cloudinary if file exists
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

    const newPost = new Post({
      author: req.user._id, // ✅ store only user reference
      title,
      description,
      city,
      state,
      category,
      visibility,
      picture: imageUrl,
    });

    const saved = await newPost.save();

    // ✅ Populate author info before sending response
    const populatedPost = await Post.findById(saved._id).populate(
      "author",
      "username bio profilePic"
    );

    console.log("✅ Post created:", populatedPost._id);
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Failed to create post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📜 Get all posts (optional filters: author/state/city)                     */
/* -------------------------------------------------------------------------- */
exports.getPosts = async (req, res) => {
  try {
    const { author, state, city } = req.query;
    const filter = {};

    if (author) filter.author = author;
    if (state) filter.state = state;
    if (city) filter.city = city;

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .populate("author", "username bio profilePic"); // ✅ dynamic user info

    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📄 Get a single post by ID                                                 */
/* -------------------------------------------------------------------------- */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username bio profilePic"
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ Update a post by ID (ownership check)                                   */
/* -------------------------------------------------------------------------- */
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // ✅ Only author or admin can update
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to update this post" });
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("author", "username bio profilePic"); // ✅ ensure latest author info

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Failed to update post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ❌ Delete a post by ID (ownership check)                                   */
/* -------------------------------------------------------------------------- */
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // ✅ Only author or admin can delete
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post", details: err.message });
  }
};
