// client/src/pages/PdfViewer.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const PdfViewer = () => {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pdfs/${id}`,
          {
            withCredentials: true,
          }
        );
        setPdfData(res.data);
      } catch (err) {
        console.error("Failed to load PDF");
        navigate("/pdfs");
      } finally {
        setLoading(false);
      }
    };
    fetchPdf();
  }, [id]);

  const formatAIResponse = (text) => {
    if (!text) return "";
    return text
      .replace(/^\s*\*{2,}\s*$/gm, "")
      .replace(/^\s*\*\s*$/gm, "")
      .replace(/^#{1,3}\s*/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/\b\*(.*?)\*\b/g, "<em>$1</em>")
      .replace(/\n{2,}/g, '</p><p class="mb-3">')
      .replace(/^(.+)$/s, '<p class="mb-3">$1</p>')
      .replace(/<p class="mb-3">\s*<\/p>/g, "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading report...</p>
      </div>
    );
  }

  return (
    // ✅ Full-height, scrollable container
    <div
      className={`flex flex-col h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-sky-50 via-white to-indigo-50"
          : "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
      }`}
    >
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/pdfs")}
              className={`p-2 rounded-full transition ${
                theme === "light"
                  ? "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
              }`}
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold">{pdfData.file.originalName}</h1>
              <p
                className={`text-sm opacity-80 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Uploaded on{" "}
                {new Date(pdfData.file.uploadDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* File Info Card */}
          <div
            className={`mb-6 p-4 rounded-lg ${
              theme === "light"
                ? "bg-white border border-gray-200"
                : "bg-gray-800 border border-gray-700"
            }`}
          >
            <p className="font-medium">📄 {pdfData.file.originalName}</p>
            <p
              className={`text-sm mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Uploaded on{" "}
              {new Date(pdfData.file.uploadDate).toLocaleDateString()}
            </p>
          </div>

          {/* AI Insights — will scroll if long */}
          <div
            className={`rounded-2xl p-5 border ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-gray-800 border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`font-bold text-lg ${
                  theme === "light" ? "text-slate-800" : "text-indigo-300"
                }`}
              >
                🩺 HealthMate Insights
              </h2>
              <span className="text-xs opacity-70">AI-generated</span>
            </div>
            <div
              className={`text-sm leading-relaxed ${
                theme === "light" ? "text-slate-700" : "text-gray-200"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatAIResponse(
                  pdfData.insight?.englishSummary || "No insights available."
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
