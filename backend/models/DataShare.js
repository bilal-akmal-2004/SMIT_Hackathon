// backend/models/DataShare.js
import mongoose from "mongoose";

const dataShareSchema = new mongoose.Schema({
  // Who owns the data
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Who is granted access
  viewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Optional: permissions (we'll start with full access)
  permissions: {
    vitals: { type: Boolean, default: true },
    pdfs: { type: Boolean, default: true },
    chats: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
});

// Ensure no duplicate shares
dataShareSchema.index({ ownerId: 1, viewerId: 1 }, { unique: true });

export default mongoose.model("DataShare", dataShareSchema);
