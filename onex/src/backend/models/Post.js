const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  picture: { type: String }, // optional — store image URL or base64
  city: { type: String },
  state: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
