// backend/routes/pdfRoutes.js
import express from "express";
import File from "../models/File.js";
import AiInsight from "../models/AiInsight.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/pdfs — get list of user's PDFs (with insight preview)
router.get("/", protect, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id })
      .sort({ uploadDate: -1 })
      .lean();

    // Attach insight preview
    const filesWithInsights = await Promise.all(
      files.map(async (file) => {
        const insight = await AiInsight.findOne({ fileId: file._id }).select(
          "englishSummary createdAt"
        );
        return {
          ...file,
          insight: insight || null,
        };
      })
    );

    res.json(filesWithInsights);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

// GET /api/pdfs/:id — get full report + insight
router.get("/:id", protect, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "PDF not found" });
    if (file.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const insight = await AiInsight.findOne({ fileId: file._id });
    res.json({ file, insight });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch PDF details" });
  }
});

export default router;
