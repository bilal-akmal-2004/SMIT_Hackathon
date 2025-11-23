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
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div
        className={`flex flex-col h-full w-full overflow-hidden rounded-2xl border transition-all duration-300 shadow-lg ${
          theme === "light"
            ? "bg-white border-green-200"
            : "bg-gray-900 border-gray-700"
        }`}
      >
        {/* Header */}
        <div className="shrink-0 p-6 pb-4 border-b transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl shadow-md transition-all duration-300 hover:scale-110">
              📄
            </div>
            <div className="flex-1">
              <h2
                className={`text-xl font-bold text-green-700 dark:text-green-400`}
              >
                Medical PDF Analyzer
              </h2>
              <p
                className={`text-sm mt-1 ${
                  theme === "light" ? "text-green-600" : "text-green-300"
                }`}
              >
                Upload medical reports and get AI-powered insights in simple
                language
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 overflow-scroll flex flex-col lg:flex-row ${
            theme === "light"
              ? "custom-scrollbar-light"
              : "custom-scrollbar-dark"
          }`}
        >
          {/* Left Panel - Input Section (Smaller on desktop) */}
          <div
            className={`lg:w-2/5 xl:w-1/3 p-6 border-r ${
              theme === "light" ? "border-green-200" : "border-gray-700"
            }`}
          >
            <div className="space-y-6 h-full flex flex-col">
              {/* Upload Section */}
              <div className="shrink-0">
                <label
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                    theme === "light"
                      ? "border-green-300 hover:border-green-400 bg-green-50/60"
                      : "border-green-600 hover:border-green-500 bg-gray-800/50"
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
                        <div className="text-2xl mb-2">✅</div>
                        <span
                          className={`font-semibold block truncate max-w-[200px] ${
                            theme === "light"
                              ? "text-green-700"
                              : "text-green-300"
                          }`}
                        >
                          {file.name}
                        </span>
                        <div
                          className={`text-xs mt-1 ${
                            theme === "light"
                              ? "text-green-600"
                              : "text-green-400"
                          }`}
                        >
                          Click to change file
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">📎</div>
                        <p
                          className={`font-semibold text-base mb-1 ${
                            theme === "light"
                              ? "text-green-700"
                              : "text-green-300"
                          }`}
                        >
                          Upload Medical Report
                        </p>
                        <p
                          className={`text-xs ${
                            theme === "light"
                              ? "text-green-600"
                              : "text-green-400"
                          }`}
                        >
                          PDF files only
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {/* Prompt Input */}
              <div className="space-y-3 flex-1">
                <label
                  className={`block text-sm font-medium ${
                    theme === "light" ? "text-green-700" : "text-green-300"
                  }`}
                >
                  💭 Your Question
                </label>
                <textarea
                  rows="4"
                  placeholder="Examples: 
• What do my lab results mean?
• Should I be concerned about any values?
• Explain this medical report in simple terms
• What questions should I ask my doctor?"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className={`w-full rounded-xl p-4 text-sm focus:outline-none focus:ring-2 transition-all duration-300 resize-none flex-1 ${
                    theme === "light"
                      ? "border border-green-300 bg-green-50 focus:ring-green-400 focus:border-green-400 text-gray-800 placeholder-green-500 hover:border-green-400"
                      : "border border-gray-600 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 placeholder-green-400 hover:border-gray-500"
                  }`}
                />
              </div>

              {/* Action Buttons */}
              <div className="shrink-0 space-y-3">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading || !file}
                  className={`w-full py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                    loading || !file
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:scale-105 hover:shadow-lg active:scale-95"
                  } ${
                    theme === "light"
                      ? "bg-green-600 text-white border border-green-600 hover:bg-green-700"
                      : "bg-green-600 text-white border border-green-600 hover:bg-green-500"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Analyzing PDF...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      🔍 Analyze & Get Insights
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPrompt("");
                    setResponse("");
                  }}
                  className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 hover:border-green-300"
                      : "bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                  }`}
                >
                  🔄 Reset All
                </button>
              </div>

              {/* Tips Section - Only show when no response */}
              {!response && (
                <div
                  className={`rounded-xl p-4 transition-all duration-300 ${
                    theme === "light"
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <h4
                    className={`font-semibold mb-2 flex items-center gap-2 text-sm ${
                      theme === "light" ? "text-green-700" : "text-green-400"
                    }`}
                  >
                    💡 Tips for Best Results
                  </h4>
                  <ul
                    className={`text-xs space-y-1 ${
                      theme === "light" ? "text-green-600" : "text-green-300"
                    }`}
                  >
                    <li className="break-words leading-4">
                      • Upload clear, readable PDFs
                    </li>
                    <li className="break-words leading-4">
                      • Ask specific questions
                    </li>
                    <li className="break-words leading-4">
                      • Request simple explanations
                    </li>
                    <li className="break-words leading-4">
                      • Ask for doctor questions
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Response Section (Larger on desktop) */}
          <div className="flex-1 flex flex-col">
            {response ? (
              <div className="flex-1 flex flex-col p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                      <h3
                        className={`font-bold text-xl text-green-700 dark:text-green-400`}
                      >
                        HealthMate AI Insights
                      </h3>
                      <p
                        className={`text-sm ${
                          theme === "light"
                            ? "text-green-600"
                            : "text-green-400"
                        }`}
                      >
                        Based on your medical report analysis
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      theme === "light"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-green-900/50 text-green-300 border border-green-800"
                    }`}
                  >
                    AI-generated
                  </span>
                </div>

                {/* Response Content - Takes most of the space */}
                <div
                  className={`flex-1 overflow-y-auto rounded-2xl border p-6 transition-all duration-300 ${
                    theme === "light"
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div
                    className={`text-base leading-relaxed space-y-4 ${
                      theme === "light" ? "text-gray-700" : "text-gray-200"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: formatAIResponse(response),
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Empty State - Welcome Message */
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-4 opacity-60">📄</div>
                  <h3
                    className={`text-xl font-bold mb-3 ${
                      theme === "light" ? "text-green-700" : "text-green-400"
                    }`}
                  >
                    Ready to Analyze Your Medical Report
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-green-600" : "text-green-300"
                    }`}
                  >
                    Upload a PDF medical report and ask questions to get
                    AI-powered insights in simple, easy-to-understand language.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiPDF;
