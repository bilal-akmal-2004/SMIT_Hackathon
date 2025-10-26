// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createRequire } from "module";
import chatRoutes from "./routes/chatRoutes.js";
import cloudinary from "./utils/cloudinary.js";
import File from "./models/File.js";
import AiInsight from "./models/AiInsight.js";
// Add this near your other imports
import { protect } from "./middleware/authMiddleware.js";
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdfParse = pdfModule.default || pdfModule; // ✅ handles both CJS + ESM exports
// Add near other routes
import vitalRoutes from "./routes/vitalRoutes.js";
import multer from "multer";
import fs from "fs";
import { GoogleGenAI } from "@google/genai"; // ✅ correct new import
//import { GoogleGenerativeAI } from "@google/generative-ai";
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

// 🔌 Connect MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅."))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Gemini 2.5 client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});
//Assalamualaikum
// Gemini test route// backend/server.js (snippet)
const upload = multer({ storage: multer.memoryStorage() }); // in-memory buffer

app.post("/api/gemini/pdf", upload.single("file"), async (req, res) => {
  try {
    const userId = req.cookies?.userId; // ⚠️ You'll need to pass userId from frontend
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const prompt = req.body?.prompt || "You are HealthMate...";

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 1. Upload to Cloudinary
    const cloudResult = await cloudinary.uploader
      .upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) throw error;
        return result;
      })
      .end(req.file.buffer);

    // 2. Parse PDF text
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text.slice(0, 30000);

    // 3. Save file record
    const fileDoc = await File.create({
      userId,
      originalName: req.file.originalname,
      cloudinaryUrl: cloudResult.secure_url,
      fileType: req.file.mimetype.includes("pdf") ? "pdf" : "image",
    });

    // 4. Send to Gemini
    const fullPrompt = `${prompt}\n\nPDF CONTENT:\n${extractedText}`;
    const geminiRes = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });
    const aiText = geminiRes.text;

    // 5. TODO: Later, parse aiText into structured fields (for now, store as-is)
    const insight = await AiInsight.create({
      fileId: fileDoc._id,
      userId,
      englishSummary: aiText,
    });

    res.json({
      text: aiText,
      fileId: fileDoc._id,
      insightId: insight._id,
      fileUrl: cloudResult.secure_url,
    });
  } catch (error) {
    console.error("PDF Upload Error:", error);
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Simple text-based Gemini chat route
// Simple text-based Gemini chat route (WITH HISTORY)

app.post("/api/gemini", protect, async (req, res) => {
  try {
    const { messages } = req.body; // Now expect full message array

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required" });
    }

    // 🧠 Doctor persona context (only once at the start)
    const doctorContext = `You are HealthMate, a friendly virtual doctor.
Respond in clear, plain English with natural line breaks.
Do NOT use Markdown syntax like ###, **, or * for formatting.
Use bold only if absolutely necessary, and avoid lists if possible.
Keep responses concise, empathetic, and easy to read.`;

    // Format messages for Gemini
    // Gemini expects: [{ role: "user", parts: "..." }, { role: "model", parts: "..." }]
    const geminiMessages = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    // Add system instruction as first message (Gemini 1.5 supports this)
    const contents = [
      { role: "user", parts: [{ text: doctorContext }] },
      ...geminiMessages,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });

    const aiText =
      response.text || "I'm here to help! Could you clarify your question?";
    res.json({ text: aiText });
  } catch (error) {
    console.error("Gemini chat error:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);

// vital routes
app.use("/api/vitals", vitalRoutes);

// After vitalRoutes
app.use("/api/chats", chatRoutes);

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
