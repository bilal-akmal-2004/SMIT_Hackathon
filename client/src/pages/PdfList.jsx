// client/src/pages/PdfList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const PdfList = () => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/pdfs`,
          {
            withCredentials: true,
          }
        );
        setPdfs(res.data);
      } catch (err) {
        console.error("Failed to load PDFs");
      } finally {
        setLoading(false);
      }
    };
    fetchPdfs();
  }, []);

  const handleView = (id) => {
    navigate(`/pdf/${id}`);
  };

  return (
    <div
      className={`min-h-screen transition-colors w-[100%] duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/home")}
            className={`p-2 rounded-full transition hover:scale-110 ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
              📋 My Medical Reports
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              All your uploaded medical reports and AI insights
            </p>
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/home")}
            className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 hover:scale-105 shadow-md ${
              theme === "light"
                ? "bg-green-600 text-white hover:bg-green-700 border border-green-600"
                : "bg-green-600 text-white hover:bg-green-500 border border-green-600"
            }`}
          >
            📤 Upload New Report
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4"></div>
              <p
                className={
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }
              >
                Loading your medical reports...
              </p>
            </div>
          </div>
        ) : pdfs.length === 0 ? (
          <div
            className={`text-center py-16 rounded-2xl transition-all duration-300 hover:shadow-md ${
              theme === "light"
                ? "bg-white border border-dashed border-green-300 hover:border-green-400"
                : "bg-gray-800 border border-dashed border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-medium mb-3 text-green-700 dark:text-green-400">
              No reports uploaded yet
            </h3>
            <p
              className={`mb-6 opacity-80 max-w-md mx-auto ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Upload your first medical PDF to get AI-powered insights in both
              English and Roman Urdu.
            </p>
            <button
              onClick={() => navigate("/home")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md ${
                theme === "light"
                  ? "bg-green-600 text-white hover:bg-green-700 border border-green-600"
                  : "bg-green-600 text-white hover:bg-green-500 border border-green-600"
              }`}
            >
              📤 Upload Your First Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Stats Summary */}
            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div
                  className={`text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-green-50 border border-green-200 hover:bg-green-100"
                      : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {pdfs.length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Total Reports
                  </div>
                </div>
                <div
                  className={`text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-green-50 border border-green-200 hover:bg-green-100"
                      : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {pdfs.filter((pdf) => pdf.insight).length}
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Analyzed
                  </div>
                </div>
                <div
                  className={`text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-green-50 border border-green-200 hover:bg-green-100"
                      : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
                  }`}
                >
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {
                      new Set(
                        pdfs.map((pdf) =>
                          new Date(pdf.uploadDate).toLocaleDateString()
                        )
                      ).size
                    }
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300">
                    Upload Days
                  </div>
                </div>
              </div>
            </div>

            {/* Reports List */}
            {pdfs.map((pdf) => (
              <div
                key={pdf._id}
                onClick={() => handleView(pdf._id)}
                className={`group p-5 rounded-2xl shadow-sm cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  theme === "light"
                    ? "bg-white border border-green-200 hover:border-green-300 hover:bg-green-50"
                    : "bg-gray-800 border border-gray-700 hover:border-gray-600 hover:bg-gray-700"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">📄</span>
                      <div className="font-semibold text-lg text-green-700 dark:text-green-300">
                        {pdf.originalName}
                      </div>
                    </div>
                    <div
                      className={`text-sm opacity-80 mb-3 ${
                        theme === "light" ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      📅 Uploaded on{" "}
                      {new Date(pdf.uploadDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    {pdf.insight ? (
                      <p
                        className={`text-sm line-clamp-2 leading-relaxed ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}
                      >
                        <span className="font-medium text-green-600 dark:text-green-400">
                          AI Summary:{" "}
                        </span>
                        {pdf.insight.englishSummary}
                      </p>
                    ) : (
                      <p
                        className={`text-sm italic ${
                          theme === "light" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        ⏳ AI analysis in progress...
                      </p>
                    )}
                  </div>
                  <span
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
                      theme === "light"
                        ? "bg-green-100 text-green-700 border border-green-200 group-hover:bg-green-200"
                        : "bg-green-900/50 text-green-300 border border-green-800 group-hover:bg-green-800"
                    }`}
                  >
                    <span>👁️</span>
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips Section */}
        {pdfs.length > 0 && (
          <div
            className={`mt-8 rounded-2xl p-4 transition-all duration-300 hover:shadow-md ${
              theme === "light"
                ? "bg-green-50 border border-green-200 hover:border-green-300"
                : "bg-gray-800 border border-gray-700 hover:border-gray-600"
            }`}
          >
            <h3
              className={`font-semibold mb-2 flex items-center gap-2 ${
                theme === "light" ? "text-green-700" : "text-green-400"
              }`}
            >
              💡 Report Management Tips
            </h3>
            <ul
              className={`text-xs space-y-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              <li>
                • Upload lab reports, prescriptions, and medical test results
              </li>
              <li>
                • Get AI-powered explanations in simple English and Roman Urdu
              </li>
              <li>• Track your health progress over time</li>
              <li>
                • Share reports securely with family or healthcare providers
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfList;
