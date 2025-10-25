// backend/routes/vitalRoutes.js
import express from "express";
import Vital from "../models/Vital.js";
import { protect } from "../middleware/authMiddleware.js"; // ✅ import middleware

const router = express.Router();

// POST /api/vitals
router.post("/", protect, async (req, res) => {
  // ✅ add protect middleware
  try {
    const { date, type, value, notes } = req.body;
    // ✅ Now we get userId from req.user (set by middleware)
    const userId = req.user._id;

    const vital = await Vital.create({
      userId,
      date: new Date(date),
      type,
      value,
      notes,
    });

    res.status(201).json(vital);
  } catch (error) {
    console.error("Vital creation error:", error);
    res.status(500).json({ error: "Failed to add vital" });
  }
});

// GET /api/vitals
router.get("/", protect, async (req, res) => {
  // ✅ protect this too
  try {
    const vitals = await Vital.find({ userId: req.user._id }).sort({
      date: -1,
    });
    res.json(vitals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vitals" });
  }
});

export default router;
