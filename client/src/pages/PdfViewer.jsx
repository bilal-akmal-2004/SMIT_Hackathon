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
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
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
            <h1 className="text-xl lg:text-2xl font-bold text-green-700 dark:text-green-400">
              📋 Report Analysis
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              AI-powered insights from your medical report
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Info Card */}
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-md">
                  📄
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-green-700 dark:text-green-400 text-lg">
                    {pdfData.file.originalName}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      theme === "light" ? "text-green-600" : "text-green-400"
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
              <div
                className={`rounded-2xl p-1 ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                <div className="flex gap-1">
                  {[
                    { id: "english", label: "🇺🇸 English", icon: "🔤" },
                    { id: "urdu", label: "🇵🇰 Roman Urdu", icon: "📝" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
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
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">
                    🤖
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-green-700 dark:text-green-400">
                      HealthMate AI Insights
                    </h2>
                    <p
                      className={`text-sm ${
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }`}
                    >
                      Intelligent analysis of your medical report
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

              {/* Key Highlights - Improved Text Contrast */}
              {pdfData.insight && (
                <div className="mt-8 pt-6 border-t border-green-200 dark:border-gray-700">
                  <h3
                    className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                      theme === "light" ? "text-green-700" : "text-green-400"
                    }`}
                  >
                    💡 Key Highlights
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        label: "Abnormal Values",
                        icon: "⚠️",
                        description: "Values outside normal range",
                        lightClass:
                          "bg-yellow-50 text-yellow-900 border-yellow-200",
                        darkClass:
                          "bg-yellow-900/30 text-yellow-200 border-yellow-800",
                      },
                      {
                        label: "Normal Range",
                        icon: "✅",
                        description: "Values within healthy limits",
                        lightClass:
                          "bg-green-50 text-green-900 border-green-200",
                        darkClass:
                          "bg-green-900/30 text-green-200 border-green-800",
                      },
                      {
                        label: "Doctor Questions",
                        icon: "❓",
                        description: "Questions for your doctor",
                        lightClass: "bg-blue-50 text-blue-900 border-blue-200",
                        darkClass:
                          "bg-blue-900/30 text-blue-200 border-blue-800",
                      },
                      {
                        label: "Health Tips",
                        icon: "💡",
                        description: "Helpful recommendations",
                        lightClass:
                          "bg-purple-50 text-purple-900 border-purple-200",
                        darkClass:
                          "bg-purple-900/30 text-purple-200 border-purple-800",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-md ${
                          theme === "light" ? item.lightClass : item.darkClass
                        }`}
                      >
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">
                            {item.label}
                          </div>
                          <div className="text-xs opacity-90 mt-1">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/pdfs")}
                className={`flex-1 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
                  theme === "light"
                    ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 hover:border-green-300"
                    : "bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700 hover:border-gray-600"
                }`}
              >
                <span>↩️</span>
                Back to Reports
              </button>
              <button
                onClick={() => navigate("/home")}
                className={`flex-1 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
                  theme === "light"
                    ? "bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:shadow-lg"
                    : "bg-green-600 text-white border border-green-600 hover:bg-green-500 hover:shadow-lg"
                }`}
              >
                <span>📤</span>
                Upload Another
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Report Summary */}
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                theme === "light"
                  ? "bg-green-50 border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <h3
                className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  theme === "light" ? "text-green-700" : "text-green-400"
                }`}
              >
                📊 Report Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">File Type</span>
                  <span
                    className={`font-medium ${
                      theme === "light" ? "text-green-600" : "text-green-400"
                    }`}
                  >
                    PDF
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Upload Date</span>
                  <span
                    className={`font-medium ${
                      theme === "light" ? "text-green-600" : "text-green-400"
                    }`}
                  >
                    {new Date(pdfData.file.uploadDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">AI Analysis</span>
                  <span
                    className={`font-medium ${
                      pdfData.insight ? "text-green-500" : "text-yellow-500"
                    }`}
                  >
                    {pdfData.insight ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                theme === "light"
                  ? "bg-green-50 border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <h3
                className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  theme === "light" ? "text-green-700" : "text-green-400"
                }`}
              >
                ⚡ Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-white border border-green-200 text-gray-800 hover:bg-green-100"
                      : "bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  🖨️ Print Report
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-white border border-green-200 text-gray-800 hover:bg-green-100"
                      : "bg-gray-700 border border-gray-600 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  📈 View Timeline
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div
              className={`rounded-2xl p-5 transition-all duration-300 hover:shadow-md ${
                theme === "light"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                  : "bg-yellow-900/20 border border-yellow-800 text-yellow-300"
              }`}
            >
              <h4 className="font-bold mb-2 flex items-center gap-2">
                ⚠️ Important Notice
              </h4>
              <p className="text-xs leading-relaxed">
                This AI analysis is for educational purposes only. Always
                consult with a qualified healthcare professional for medical
                advice and diagnosis.
              </p>
              <p className="text-xs mt-2 italic">
                "Yeh AI sirf samajhne ke liye hai, ilaaj ke liye nahi."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
