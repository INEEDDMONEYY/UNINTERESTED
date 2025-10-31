const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary"); // ✅ Cloudinary config
const streamifier = require("streamifier");

/* -------------------------------------------------------------------------- */
/* 📝 Create a new post                                                      */
/* -------------------------------------------------------------------------- */
exports.createPost = async (req, res) => {
  try {
    const { username, description, city, state, category, visibility, title } = req.body;

    if (!username || !description) {
      return res.status(400).json({ error: "Username and description are required." });
    }

    let imageUrl = null;

    // ✅ Upload image to Cloudinary if file exists
    if (req.file) {
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
    }

    const newPost = new Post({
      username,
      title,
      description,
      city,
      state,
      category,
      visibility,
      picture: imageUrl, // ✅ Cloudinary URL or null
    });

    const saved = await newPost.save();
    console.log("✅ Post created:", saved._id);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating post:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📜 Get all posts (optional filters: state/city)                            */
/* -------------------------------------------------------------------------- */
exports.getPosts = async (req, res) => {
  try {
    const { state, city } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (city) filter.city = city;

    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("❌ Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

/* -------------------------------------------------------------------------- */
/* 📄 Get a single post by ID                                                 */
/* -------------------------------------------------------------------------- */
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    console.error("❌ Error fetching post:", err);
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ Update a post by ID                                                     */
/* -------------------------------------------------------------------------- */
exports.updatePost = async (req, res) => {
  try {
    const updated = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Post not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Failed to update post" });
  }
};

/* -------------------------------------------------------------------------- */
/* ❌ Delete a post by ID                                                     */
/* -------------------------------------------------------------------------- */
exports.deletePost = async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Failed to delete post" });
  }
};
