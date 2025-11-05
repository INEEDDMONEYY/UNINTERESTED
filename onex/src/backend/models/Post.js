const PostSchema = new mongoose.Schema({
  username: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  picture: { type: String },
  city: { type: String },
  state: { type: String },
  category: { type: String, default: "" },
  visibility: {
    type: String,
    enum: ["Men", "Women", "Both"],
    default: "Both",
  },
  acknowledgedPayment: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // ✅ Enables createdAt and updatedAt automatically
