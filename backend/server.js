// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfModule = require("pdf-parse");
const pdfParse = pdfModule.default || pdfModule; // ✅ handles both CJS + ESM exports

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

// Gemini test route// backend/server.js (snippet)
const upload = multer({ storage: multer.memoryStorage() }); // in-memory buffer

app.post("/api/gemini/pdf", upload.single("file"), async (req, res) => {
  try {
    // safe import that handles both CJS and ESM shapes

    // prompt from form-data
    const prompt = req.body?.prompt || "Summarize this PDF as a doctor";

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    // parse PDF buffer
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text || "";

    // limit size to avoid sending huge prompt (adjust as needed)
    const chunk = extractedText.slice(0, 30000); // ~30k chars
    const fullPrompt = `${prompt}\n\nPDF CONTENT:\n${chunk}`;

    // call Gemini (your ai client variable `ai` already set up)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
    });

    // return the text (adjust if response object differs)
    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini PDF error:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

// Simple text-based Gemini chat route
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Gemini SDK may return response.text or response.output_text depending on version
    res.json({ text: response.text || response.output_text || "No response" });
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

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
});
