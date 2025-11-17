// client/src/pages/PdfViewer.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const PdfViewer = () => {
  const [pdfData, setPdfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("english");
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
      .replace(/\n{2,}/g, '</p><p class="mb-4">')
      .replace(/^(.+)$/s, '<p class="mb-4">$1</p>')
      .replace(/<p class="mb-4">\s*<\/p>/g, "");
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center h-screen transition-colors duration-300 ${
          theme === "light"
            ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
            : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
        }`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4 mx-auto"></div>
          <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
            Loading your medical report...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate("/pdfs")}
              className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                theme === "light"
                  ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              ←
            </button>
            <div>
              <h1 className="text-xl font-bold text-green-700 dark:text-green-400">
                📋 Report Details
              </h1>
              <p
                className={`text-sm opacity-80 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                AI-powered analysis of your medical report
              </p>
            </div>
          </div>

          {/* File Info Card */}
          <div
            className={`mb-6 p-5 rounded-2xl transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${
              theme === "light"
                ? "bg-white border border-green-200 hover:border-green-300"
                : "bg-gray-800 border border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">📄</div>
              <div>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  {pdfData.file.originalName}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  📅 Uploaded on{" "}
                  {new Date(pdfData.file.uploadDate).toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Language Tabs */}
          {pdfData.insight?.urduSummary && (
            <div className="mb-6">
              <div
                className={`flex gap-2 p-1 rounded-xl ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {[
                  { id: "english", label: "🇺🇸 English", icon: "🔤" },
                  { id: "urdu", label: "🇵🇰 Roman Urdu", icon: "📝" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 min-w-[120px] ${
                      activeTab === tab.id
                        ? theme === "light"
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-green-600 text-white shadow-md"
                        : theme === "light"
                        ? "text-green-700 hover:bg-green-100"
                        : "text-green-300 hover:bg-gray-700"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          <div
            className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
              theme === "light"
                ? "bg-white border border-green-200 hover:border-green-300"
                : "bg-gray-800 border border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🤖</div>
                <h2 className="font-bold text-xl text-green-700 dark:text-green-400">
                  HealthMate AI Insights
                </h2>
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

            <div
              className={`text-sm leading-relaxed space-y-4 ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}
              dangerouslySetInnerHTML={{
                __html: formatAIResponse(
                  activeTab === "english"
                    ? pdfData.insight?.englishSummary ||
                        "No English insights available."
                    : pdfData.insight?.urduSummary ||
                        "No Roman Urdu insights available."
                ),
              }}
            />

            {/* Additional AI Features */}
            {pdfData.insight && (
              <div className="mt-6 pt-6 border-t border-green-200 dark:border-gray-700">
                <h3
                  className={`font-semibold mb-3 flex items-center gap-2 ${
                    theme === "light" ? "text-green-700" : "text-green-400"
                  }`}
                >
                  💡 Key Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      label: "Abnormal Values",
                      icon: "⚠️",
                      color: "text-yellow-600",
                    },
                    {
                      label: "Normal Range",
                      icon: "✅",
                      color: "text-green-600",
                    },
                    {
                      label: "Doctor Questions",
                      icon: "❓",
                      color: "text-blue-600",
                    },
                    {
                      label: "Health Tips",
                      icon: "💡",
                      color: "text-purple-600",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                        theme === "light"
                          ? "bg-green-50 border border-green-200 hover:bg-green-100"
                          : "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className={`text-sm ${item.color}`}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={() => navigate("/pdfs")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                theme === "light"
                  ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                  : "bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700"
              }`}
            >
              ↩️ Back to Reports
            </button>
            <button
              onClick={() => navigate("/home")}
              className={`flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
                theme === "light"
                  ? "bg-green-600 text-white border border-green-600 hover:bg-green-700"
                  : "bg-green-600 text-white border border-green-600 hover:bg-green-500"
              }`}
            >
              📤 Upload Another
            </button>
          </div>

          {/* Disclaimer */}
          <div
            className={`mt-6 p-4 rounded-xl text-xs ${
              theme === "light"
                ? "bg-yellow-50 border border-yellow-200 text-yellow-700"
                : "bg-yellow-900/20 border border-yellow-800 text-yellow-300"
            }`}
          >
            <p className="font-medium mb-1">⚠️ Important Disclaimer</p>
            <p>
              This AI analysis is for educational purposes only. Always consult
              with a qualified healthcare professional for medical advice and
              diagnosis.
            </p>
            <p className="mt-1 italic">
              Roman Urdu: "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye
              nahi."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
