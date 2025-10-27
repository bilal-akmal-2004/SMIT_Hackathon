// client/src/components/GeminiPdf.jsx
import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";

const GeminiPDF = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const formatAIResponse = (text) => {
    if (!text) return "";
    return text
      .replace(/^\s*\*{2,}\s*$/gm, "")
      .replace(/^\s*\*\s*$/gm, "")
      .replace(/^#{1,3}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/\b\*(.*?)\*\b/g, "<em>$1</em>")
      .replace(/\n{2,}/g, '</p><p class="mb-4">')
      .replace(/^/, '<p class="mb-4">')
      .replace(/$/, "</p>")
      .replace(/<p class="mb-4">\s*<\/p>/g, "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload a PDF first.");
    setLoading(true);
    setResponse("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/gemini/pdf`,
        {
          method: "POST",
          credentials: "include", // ✅ Essential for auth
          body: formData,
        }
      );

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setResponse(data.text || "No response received.");
    } catch (err) {
      console.error(err);
      setResponse("Sorry, something went wrong while analyzing your PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`w-full h-full flex flex-col transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-indigo-50 via-white to-blue-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
      }`}
    >
      <div
        className={`flex flex-col h-full w-full overflow-hidden rounded-2xl border transition ${
          theme === "light"
            ? "bg-white border-gray-200"
            : "bg-gray-900 border-gray-800"
        }`}
      >
        <div className="shrink-0 p-6 pb-4 border-b">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-600 text-white text-xl shadow">
              🩺
            </div>
            <div className="flex-1">
              <h2
                className={`text-xl font-bold ${
                  theme === "light" ? "text-slate-800" : "text-indigo-300"
                }`}
              >
                Medical PDF Analyzer
              </h2>
              <p
                className={`text-sm mt-1 ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}
              >
                Upload a report and get clear, actionable insights.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden p-4 flex flex-col gap-5">
          <div className="shrink-0 space-y-5">
            <label
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition ${
                theme === "light"
                  ? "border-indigo-200 hover:border-indigo-300 bg-indigo-50/40"
                  : "border-indigo-600 hover:border-indigo-500 bg-gray-800/50"
              }`}
            >
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="sr-only"
              />
              <div className="text-center">
                {file ? (
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        theme === "light"
                          ? "text-indigo-700"
                          : "text-indigo-300"
                      }`}
                    >
                      {file.name}
                    </span>
                    <div className="text-xs mt-1 opacity-80">
                      Click to change
                    </div>
                  </div>
                ) : (
                  <>
                    <p
                      className={`font-medium ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      📎 Upload Medical Report (PDF)
                    </p>
                    <p className="text-xs mt-1 opacity-70">
                      Lab results, prescriptions, or doctor's notes
                    </p>
                  </>
                )}
              </div>
            </label>

            <textarea
              rows="2"
              placeholder="E.g., What do my lab results mean? Should I be concerned about anything?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className={`w-full rounded-xl p-3 text-sm focus:outline-none focus:ring-2 transition ${
                theme === "light"
                  ? "border border-gray-300 bg-gray-50 focus:ring-indigo-400 text-slate-800"
                  : "border border-gray-700 bg-gray-800 focus:ring-indigo-500 text-gray-200"
              }`}
            />

            <div className="flex gap-3">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || !file}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition ${
                  loading || !file
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-opacity-90 active:scale-[0.99]"
                } ${
                  theme === "light"
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"
                }`}
              >
                {loading ? "Analyzing PDF..." : "Analyze & Get Insights"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPrompt("");
                  setResponse("");
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                Reset
              </button>
            </div>
          </div>

          {response && (
            <div className="flex-1 overflow-y-auto rounded-xl border p-5">
              <div className="flex items-start justify-between mb-3">
                <h3
                  className={`font-bold text-base ${
                    theme === "light" ? "text-slate-800" : "text-indigo-300"
                  }`}
                >
                  🩺 HealthMate Insights
                </h3>
                <span className="text-xs opacity-70 px-2 py-0.5 rounded bg-opacity-20">
                  AI-generated
                </span>
              </div>
              <div
                className={`text-sm leading-relaxed ${
                  theme === "light" ? "text-slate-700" : "text-gray-200"
                }`}
                dangerouslySetInnerHTML={{ __html: formatAIResponse(response) }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeminiPDF;
