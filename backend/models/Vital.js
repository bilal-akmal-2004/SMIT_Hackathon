// backend/models/Vital.js
import mongoose from "mongoose";

const vitalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: { type: Date, required: true },
  type: {
    type: String,
    enum: ["BP", "Sugar", "Weight", "Temperature", "Other"],
    required: true,
  },
  value: { type: String, required: true }, // e.g., "130/80", "95", "70 kg"
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Vital", vitalSchema);
