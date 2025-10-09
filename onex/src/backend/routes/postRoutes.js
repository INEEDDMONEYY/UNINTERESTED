const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// ✅ Create a new post
router.post("/", async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const saved = await newPost.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// ✅ Get all posts (optionally filtered by state or city)
router.get("/", async (req, res) => {
  try {
    const { state, city } = req.query;
    const filter = {};
    if (state) filter.state = state;
    if (city) filter.city = city;
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

module.exports = router;
