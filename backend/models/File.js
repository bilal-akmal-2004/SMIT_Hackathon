// backend/models/File.js
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  originalName: { type: String, required: true },
  fileType: { type: String, enum: ["pdf", "image"], required: true },
  uploadDate: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
