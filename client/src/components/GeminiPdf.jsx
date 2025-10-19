import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const GeminiPDF = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF first.");
    setLoading(true);
    setResponse("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/gemini/pdf`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setResponse(data.text);
    setLoading(false);
  };

  return (
    <div
      className={`min-h-[60vh] flex items-start justify-center p-6 transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-indigo-50 via-white to-blue-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
      }`}
    >
      <div
        className={`rounded-2xl shadow-2xl w-full max-w-5xl p-8 border transition-all duration-300 ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-900 border-gray-800"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-6 flex items-center justify-center gap-2 transition-colors ${
            theme === "light" ? "text-indigo-700" : "text-indigo-400"
          }`}
        >
          <span>🩺</span> Gemini Medical PDF Assistant
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <label
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all ${
              theme === "light"
                ? "border-indigo-300 hover:border-indigo-500 bg-indigo-50/30"
                : "border-indigo-600 hover:border-indigo-400 bg-gray-800/50"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <p
              className={`text-base ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              {file ? (
                <span
                  className={`font-semibold ${
                    theme === "light" ? "text-indigo-700" : "text-indigo-400"
                  }`}
                >
                  {file.name}
                </span>
              ) : (
                "Click or drop a PDF file here"
              )}
            </p>
          </label>

          {/* Prompt Input */}
          <textarea
            rows="1"
            placeholder="Ask about your medical report, lab results, or any PDF..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className={`w-full rounded-xl p-5 resize-none text-lg focus:outline-none focus:ring-2 transition ${
              theme === "light"
                ? "border border-gray-300 focus:ring-indigo-400 bg-white text-gray-800"
                : "border border-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-200"
            }`}
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-medium text-lg transition-all duration-200 ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:scale-[1.02] active:scale-95"
            } ${
              theme === "light"
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            {loading ? "Analyzing your PDF..." : "Upload & Ask Gemini"}
          </button>
        </form>

        {/* AI Response */}
        {response && (
          <div
            className={`mt-6 rounded-xl p-6 border max-h-[700px] overflow-y-auto transition-colors ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <h3
              className={`font-semibold mb-3 text-lg ${
                theme === "light" ? "text-indigo-700" : "text-indigo-400"
              }`}
            >
              🧠 Health Mate Medical Summary:
            </h3>
            <pre
              className={`whitespace-pre-wrap text-lg leading-relaxed ${
                theme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              {response}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiPDF;
