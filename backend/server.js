// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createRequire } from "module";
import chatRoutes from "./routes/chatRoutes.js";
import File from "./models/File.js";
import AiInsight from "./models/AiInsight.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import { protect } from "./middleware/authMiddleware.js";

const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdfParse = pdfModule.default || pdfModule;

import vitalRoutes from "./routes/vitalRoutes.js";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://smit-hackathon-client.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅."))
  .catch((err) => console.error("MongoDB connection error:", err));

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

// ✅ FIXED PDF ROUTE — NO CLOUDINARY
app.post(
  "/api/gemini/pdf",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const prompt =
        req.body?.prompt ||
        "You are HealthMate, a virtual doctor. Summarize this medical document clearly and provide health insights.";

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text.slice(0, 30000);

      // ✅ Save file record WITHOUT cloudinaryUrl
      const fileDoc = await File.create({
        userId,
        originalName: req.file.originalname,
        fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
      });

      const fullPrompt = `${prompt}\n\nPDF CONTENT:\n${extractedText}`;
      const geminiRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
      });
      const aiText = geminiRes.text;

      const insight = await AiInsight.create({
        fileId: fileDoc._id,
        userId,
        englishSummary: aiText,
      });

      res.json({
        text: aiText,
        fileId: fileDoc._id,
        insightId: insight._id,
      });
    } catch (error) {
      console.error("PDF Upload Error:", error);
      res
        .status(500)
        .json({ error: "Failed to process PDF", details: error.message });
    }
  }
);

// Chat route (unchanged)

app.post("/api/gemini", protect, async (req, res) => {
  try {
    const { messages, responseLanguage } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    const isUrdu = responseLanguage === "ur";
    const aiResponseLang = isUrdu ? "Urdu" : "English";

    // Build a single prompt string (since you're using the legacy/working API)
    const conversation = messages
      .map(
        (msg) => `${msg.role === "user" ? "User" : "HealthMate"}: ${msg.text}`
      )
      .join("\n");

    const fullPrompt = `You are HealthMate, a friendly and empathetic virtual doctor.
Respond ONLY in ${aiResponseLang}.
Use simple, clear, and conversational language.
Do NOT use Markdown (like **bold**, *italic*, ### headings, or lists).
Avoid medical jargon unless you explain it simply.
Keep responses concise, helpful, and easy to understand.
Never switch languages — stick strictly to ${aiResponseLang}.

Conversation so far:
${conversation}

HealthMate:`;

    // ✅ Use the SAME working method as your PDF route
    const geminiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash", // since this works for you
      contents: fullPrompt,
    });

    const aiText =
      geminiRes.text || "I'm here to help! Could you clarify your question?";

    res.json({ text: aiText });
  } catch (error) {
    console.error("Gemini chat error:", error);
    res.status(500).json({
      error: "AI failed to respond",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/pdfs", pdfRoutes); // ✅ Must be after models are defined

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});

//just the daily push
