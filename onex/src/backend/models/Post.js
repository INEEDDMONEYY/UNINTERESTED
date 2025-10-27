const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  picture: { type: String },
  city: { type: String },
  state: { type: String },
  category: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
