const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true }, // 🆕 Added for post title
  description: { type: String, required: true },
  picture: { type: String },
  city: { type: String },
  state: { type: String },
  category: { type: String, default: "" },
  visibility: {
    type: String,
    enum: ["Men", "Women", "Both"],
    default: "Both", // 🆕 Added for 'See's Only' feature
  },
  acknowledgedPayment: {
    type: Boolean,
    default: false, // 🆕 For the $13 post acknowledgment checkbox
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
