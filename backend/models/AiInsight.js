// backend/models/AiInsight.js
import mongoose from "mongoose";

const aiInsightSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "File",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  englishSummary: { type: String, required: true },
  romanUrduSummary: { type: String }, // optional for now
  doctorQuestions: [String],
  recommendations: {
    avoid: [String],
    eat: [String],
    remedies: [String],
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("AiInsight", aiInsightSchema);
