// backend/models/PlatformUpdate.js
import mongoose from "mongoose";

const platformUpdateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model("PlatformUpdate", platformUpdateSchema);
