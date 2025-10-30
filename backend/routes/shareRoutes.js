// backend/routes/shareRoutes.js
import express from "express";
import DataShare from "../models/DataShare.js";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import Vital from "../models/Vital.js";
import File from "../models/File.js";
import AiInsight from "../models/AiInsight.js";

const router = express.Router();

// POST /api/share/grant — Grant access to another user (by email)
router.post("/grant", protect, async (req, res) => {
  try {
    const { email } = req.body;
    const ownerId = req.user._id;

    const viewer = await User.findOne({ email });
    if (!viewer) return res.status(404).json({ error: "User not found" });
    if (viewer._id.toString() === ownerId.toString()) {
      return res.status(400).json({ error: "Cannot share with yourself" });
    }

    // Create or update share record
    const share = await DataShare.findOneAndUpdate(
      { ownerId, viewerId: viewer._id },
      { ownerId, viewerId: viewer._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ success: true, message: "Access granted", share });
  } catch (err) {
    res.status(500).json({ error: "Failed to grant access" });
  }
});

// GET /api/share/shared-with-me — List of users who shared with me
router.get("/shared-with-me", protect, async (req, res) => {
  try {
    const shares = await DataShare.find({ viewerId: req.user._id })
      .populate("ownerId", "name email")
      .select("ownerId createdAt");

    const owners = shares.map((s) => ({
      id: s.ownerId._id,
      name: s.ownerId.name,
      email: s.ownerId.email,
      sharedAt: s.createdAt,
    }));

    res.json(owners);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shared users" });
  }
});

// GET /api/share/vitals/:ownerId — Get vitals of someone who shared with me
router.get("/vitals/:ownerId", protect, async (req, res) => {
  try {
    const { ownerId } = req.params;
    const viewerId = req.user._id;

    // Check if access is granted
    const share = await DataShare.findOne({ ownerId, viewerId });
    if (!share) return res.status(403).json({ error: "Access denied" });

    const vitals = await Vital.find({ userId: ownerId }).sort({ date: -1 });
    res.json(vitals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vitals" });
  }
});

// GET /api/share/pdfs/:ownerId — Get PDFs of someone who shared with me
router.get("/pdfs/:ownerId", protect, async (req, res) => {
  try {
    const { ownerId } = req.params;
    const viewerId = req.user._id;

    const share = await DataShare.findOne({ ownerId, viewerId });
    if (!share) return res.status(403).json({ error: "Access denied" });

    const files = await File.find({ userId: ownerId })
      .sort({ uploadDate: -1 })
      .lean();
    const filesWithInsights = await Promise.all(
      files.map(async (file) => {
        const insight = await AiInsight.findOne({ fileId: file._id }).select(
          "englishSummary createdAt"
        );
        return { ...file, insight: insight || null };
      })
    );
    res.json(filesWithInsights);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

// GET /api/share/search?q=...
router.get("/search", protect, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json([]);

    // Exclude current user
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
      ],
    })
      .select("name email")
      .limit(10);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

// DELETE /api/share/revoke/:viewerId
router.delete("/revoke/:viewerId", protect, async (req, res) => {
  try {
    const result = await DataShare.deleteOne({
      ownerId: req.user._id,
      viewerId: req.params.viewerId,
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No access found to revoke" });
    }
    res.json({ success: true, message: "Access revoked" });
  } catch (err) {
    res.status(500).json({ error: "Failed to revoke access" });
  }
});

// In shareRoutes.js
router.get("/shared-by-me", protect, async (req, res) => {
  const shares = await DataShare.find({ ownerId: req.user._id })
    .populate("viewerId", "name email")
    .select("viewerId");
  res.json(
    shares.map((s) => ({
      id: s.viewerId._id,
      name: s.viewerId.name,
      email: s.viewerId.email,
    }))
  );
});

// GET /api/share/pdfs/:ownerId
router.get("/pdfs/:ownerId", protect, async (req, res) => {
  try {
    const { ownerId } = req.params;
    const viewerId = req.user._id;

    const share = await DataShare.findOne({ ownerId, viewerId });
    if (!share) return res.status(403).json({ error: "Access denied" });

    const files = await File.find({ userId: ownerId })
      .sort({ uploadDate: -1 })
      .lean();

    const filesWithInsights = await Promise.all(
      files.map(async (file) => {
        const insight = await AiInsight.findOne({ fileId: file._id }).select(
          "englishSummary createdAt"
        );
        return { ...file, insight: insight || null };
      })
    );
    res.json(filesWithInsights);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch PDFs" });
  }
});

export default router;
