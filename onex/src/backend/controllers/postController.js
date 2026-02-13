const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

/* -------------------------------------------------------------------------- */
/* 📝 Create a new post                                                      */
/* -------------------------------------------------------------------------- */
exports.createPost = async (req, res) => {
  try {
    console.log("🔹 [createPost] NEW REQUEST");
    console.log("🔹 req.user:", req.user);
    console.log("🔹 req.body:", req.body);
    console.log("🔹 req.files:", req.files);

    if (!req.user || !req.user._id) {
      console.error("❌ Missing req.user or req.user._id");
      return res.status(401).json({ error: "Unauthorized - no user attached" });
    }

    const { description, city, state, category, visibility, title } = req.body;

    if (!description || !title) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    let imageUrls = []; // initialize array for multiple images

    /* ---------------------------- Upload images ---------------------------- */
    if (req.files && req.files.length > 0) {
      console.log(
        `🔹 Found ${req.files.length} files. Starting Cloudinary uploads...`,
      );
      try {
        const uploadPromises = req.files.map((file, idx) => {
          console.log(
            `🔹 Preparing file index ${idx}:`,
            file.originalname,
            file.size,
            file.mimetype,
          );
          if (!file.buffer) {
            console.warn(`❌ File buffer missing for index ${idx}`);
            throw new Error(`File buffer is missing for file index ${idx}`);
          }

          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "posts" },
              (error, result) => {
                if (error) {
                  console.error(
                    `❌ Cloudinary upload error for file index ${idx}:`,
                    error,
                  );
                  reject(error);
                } else {
                  console.log(
                    `✅ Cloudinary upload success for index ${idx}:`,
                    result.secure_url,
                  );
                  resolve(result.secure_url);
                }
              },
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
          });
        });

        // Wait for all uploads
        imageUrls = await Promise.all(uploadPromises);
        console.log("🔹 All images uploaded. URLs:", imageUrls);
      } catch (uploadErr) {
        console.error("❌ Cloudinary upload failed:", uploadErr);
        return res.status(500).json({
          error: "Image upload failed",
          details: uploadErr.message,
        });
      }
    } else {
      console.warn(
        "⚠️ No files found in req.files. pictures array will be empty.",
      );
    }

    console.log("🔹 Saving new post with userId:", req.user._id.toString());

    const newPost = new Post({
      userId: req.user._id,
      title,
      description,
      city,
      state,
      category,
      visibility,
      pictures: imageUrls, // save array of uploaded image URLs
    });

    const savedPost = await newPost.save();
    console.log("🔹 Post saved to DB:", savedPost);

    // Populate the user for the frontend
    const populatedPost = await Post.findById(savedPost._id).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false,
    });

    console.log("✅ Post created successfully:", populatedPost._id);
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("❌ [createPost] Server error:", err);
    res
      .status(500)
      .json({ error: "Failed to create post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📜 Get all posts                                                          */
/* -------------------------------------------------------------------------- */
exports.getPosts = async (req, res) => {
  try {
    const { userId, state, city } = req.query;
    console.log("🔹 [getPosts] Query params:", req.query);

    const filter = {};
    if (userId) filter.userId = userId;
    if (state) filter.state = state;
    if (city) filter.city = city;

    const posts = await Post.find(filter).sort({ createdAt: -1 }).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false,
    });

    console.log(`🔹 [getPosts] Found ${posts.length} posts`);
    res.json(posts);
  } catch (err) {
    console.error("❌ [getPosts] Error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📄 Get post by ID                                                         */
/* -------------------------------------------------------------------------- */
exports.getPostById = async (req, res) => {
  try {
    console.log("🔹 [getPostById] ID:", req.params.id);

    const post = await Post.findById(req.params.id).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false,
    });

    if (!post) {
      console.warn(`⚠️ [getPostById] Post not found for ID: ${req.params.id}`);
      return res.status(404).json({ error: "Post not found" });
    }

    console.log("🔹 [getPostById] Post found:", post._id);
    res.json(post);
  } catch (err) {
    console.error("❌ [getPostById] Error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✏️ Update post                                                             */
/* -------------------------------------------------------------------------- */
exports.updatePost = async (req, res) => {
  try {
    console.log("🔹 [updatePost] ID:", req.params.id, "Body:", req.body);
    console.log("🔹 req.files array length:", req.files?.length);
    console.log(
      "🔹 req.files content:",
      req.files?.map((f) => ({
        originalname: f.originalname,
        size: f.size,
        mimetype: f.mimetype,
        hasBuffer: !!f.buffer,
      })),
    );

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (
      post.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      console.warn("⚠️ [updatePost] User not authorized");
      return res
        .status(403)
        .json({ error: "Not authorized to update this post" });
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate({
      path: "userId",
      select: "username bio profilePic",
      strictPopulate: false,
    });

    console.log("🔹 [updatePost] Post updated:", updatedPost._id);
    res.json(updatedPost);
  } catch (err) {
    console.error("❌ [updatePost] Error:", err);
    res
      .status(500)
      .json({ error: "Failed to update post", details: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ❌ Delete post                                                             */
/* -------------------------------------------------------------------------- */
exports.deletePost = async (req, res) => {
  try {
    console.log("🔹 [deletePost] ID:", req.params.id);

    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (
      post.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      console.warn("⚠️ [deletePost] User not authorized");
      return res
        .status(403)
        .json({ error: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    console.log("✅ Post deleted successfully:", post._id);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("❌ [deletePost] Error:", err);
    res
      .status(500)
      .json({ error: "Failed to delete post", details: err.message });
  }
};
