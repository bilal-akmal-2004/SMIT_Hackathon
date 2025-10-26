// backend/routes/chatRoutes.js
import express from "express";
import Chat from "../models/Chat.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/chats — save current chat
router.post("/", protect, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // Optional: generate a title from first user message
    const title =
      messages[0]?.role === "user"
        ? messages[0].text.substring(0, 30) +
          (messages[0].text.length > 30 ? "..." : "")
        : "New Chat";

    const chat = new Chat({
      userId: req.user._id,
      title,
      messages,
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Save chat error:", error);
    res.status(500).json({ error: "Failed to save chat" });
  }
});

// DELETE /api/chats/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Chat.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete chat" });
  }
});

// GET /api/chats — get all user chats (for future sidebar)
router.get("/", protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select("title createdAt updatedAt");
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});

// GET /api/chats/latest — get most recent chat
router.get("/latest", protect, async (req, res) => {
  try {
    const latestChat = await Chat.findOne({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

    if (!latestChat) {
      return res.status(404).json({ error: "No chat found" });
    }

    res.json(latestChat);
  } catch (error) {
    console.error("Fetch latest chat error:", error);
    res.status(500).json({ error: "Failed to fetch latest chat" });
  }
});

// PUT /api/chats/:id — update existing chat
router.put("/:id", protect, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    chat.messages = messages;
    chat.updatedAt = Date.now();
    await chat.save();

    res.json(chat);
  } catch (error) {
    console.error("Update chat error:", error);
    res.status(500).json({ error: "Failed to update chat" });
  }
});

export default router;
