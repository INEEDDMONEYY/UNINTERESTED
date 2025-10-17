import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  description: { type: String, required: true },
  picture: { type: String },
  city: { type: String },
  state: { type: String },
  category: { type: String, default: "" }, // ✅ NEW FIELD
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", PostSchema);
export default Post;
