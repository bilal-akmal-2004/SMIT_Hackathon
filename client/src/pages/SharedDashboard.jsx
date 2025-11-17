// client/src/pages/SharedDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const SharedDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("vitals");
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchSharedData = async () => {
      try {
        // Verify access
        const usersRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/shared-with-me`,
          { withCredentials: true }
        );
        const ownerInfo = usersRes.data.find((u) => u.id === ownerId);
        if (!ownerInfo) {
          navigate("/shared-with-me");
          return;
        }
        setOwner(ownerInfo);

        // Fetch vitals and PDFs in parallel
        const [vitalsRes, pdfsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/share/vitals/${ownerId}`,
            {
              withCredentials: true,
            }
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/share/pdfs/${ownerId}`,
            {
              withCredentials: true,
            }
          ),
        ]);

        setVitals(vitalsRes.data);
        setPdfs(pdfsRes.data);
      } catch (err) {
        console.error("Failed to load shared data", err);
        navigate("/shared-with-me");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedData();
  }, [ownerId]);

  const getVitalIcon = (type) => {
    switch (type) {
      case "BP":
        return "🫀";
      case "Sugar":
        return "🩸";
      case "Weight":
        return "⚖️";
      case "Temperature":
        return "🌡️";
      default:
        return "📊";
    }
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
          <p
            className={`text-lg ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Loading {owner?.name}'s health data...
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 lg:mb-8">
          <button
            onClick={() => navigate("/shared-with-me")}
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
              👤 {owner?.name}'s Health Data
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Shared with you on{" "}
              {new Date(owner?.sharedAt).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Stats Overview - Desktop Only */}
        <div className="hidden lg:grid grid-cols-3 gap-6 mb-8">
          <div
            className={`text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
              theme === "light"
                ? "bg-green-50 border border-green-200 hover:bg-green-100"
                : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
            }`}
          >
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {vitals.length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Vitals Recorded
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
              {pdfs.length}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Medical Reports
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
                new Set([
                  ...vitals.map((v) => v.date.split("T")[0]),
                  ...pdfs.map((p) => p.uploadDate.split("T")[0]),
                ]).size
              }
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              Active Days
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6">
          <div
            className={`flex gap-1 p-1 rounded-xl ${
              theme === "light"
                ? "bg-green-50 border border-green-200"
                : "bg-gray-800 border border-gray-700"
            }`}
          >
            {[
              { id: "vitals", label: "📊 Vitals", icon: "❤️" },
              { id: "reports", label: "📋 Reports", icon: "📄" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
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
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Layout - Full height sections */}
        <div className="lg:hidden">
          {/* Vitals Section - Mobile */}
          <section className={`${activeTab === "vitals" ? "block" : "hidden"}`}>
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg min-h-[400px] flex flex-col ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold flex items-center gap-2 ${
                    theme === "light" ? "text-green-700" : "text-green-400"
                  }`}
                >
                  📊 Health Vitals
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === "light"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-green-900/50 text-green-300 border border-green-800"
                  }`}
                >
                  {vitals.length} records
                </span>
              </div>

              {vitals.length > 0 ? (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {vitals.map((vital) => (
                    <div
                      key={vital._id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                        theme === "light"
                          ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100"
                          : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getVitalIcon(vital.type)}
                          </span>
                          <div>
                            <div className="font-semibold text-green-700 dark:text-green-300">
                              {vital.type === "BP"
                                ? "Blood Pressure"
                                : vital.type === "Sugar"
                                ? "Blood Sugar"
                                : vital.type === "Weight"
                                ? "Weight"
                                : vital.type === "Temperature"
                                ? "Temperature"
                                : vital.type}
                            </div>
                            <div
                              className={`text-sm opacity-80 ${
                                theme === "light"
                                  ? "text-green-600"
                                  : "text-green-400"
                              }`}
                            >
                              {new Date(vital.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-2 rounded-lg text-lg font-medium whitespace-nowrap transition-all duration-300 ${
                            theme === "light"
                              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                              : "bg-green-900/50 text-green-300 border border-green-800 hover:bg-green-800"
                          }`}
                        >
                          {vital.value}
                        </span>
                      </div>
                      {vital.notes && (
                        <p
                          className={`mt-3 pl-10 sm:pl-12 text-sm ${
                            theme === "light"
                              ? "text-gray-700"
                              : "text-gray-300"
                          }`}
                        >
                          📝 {vital.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`text-center py-8 rounded-xl transition-all duration-300 hover:shadow-md w-full ${
                      theme === "light"
                        ? "bg-green-50 border border-dashed border-green-300 hover:border-green-400"
                        : "bg-gray-700 border border-dashed border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <p
                      className={
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }
                    >
                      No vitals recorded yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Reports Section - Mobile */}
          <section
            className={`${activeTab === "reports" ? "block" : "hidden"}`}
          >
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg min-h-[400px] flex flex-col ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold flex items-center gap-2 ${
                    theme === "light" ? "text-green-700" : "text-green-400"
                  }`}
                >
                  📋 Medical Reports
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === "light"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-green-900/50 text-green-300 border border-green-800"
                  }`}
                >
                  {pdfs.length} reports
                </span>
              </div>

              {pdfs.length > 0 ? (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf._id}
                      onClick={() => setSelectedPdf(pdf)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                        theme === "light"
                          ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100"
                          : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📄</span>
                            <div className="font-semibold text-green-700 dark:text-green-300">
                              {pdf.originalName}
                            </div>
                          </div>
                          <div
                            className={`text-sm opacity-80 mb-3 ${
                              theme === "light"
                                ? "text-green-600"
                                : "text-green-400"
                            }`}
                          >
                            📅 {new Date(pdf.uploadDate).toLocaleDateString()}
                          </div>
                          {pdf.insight && (
                            <p
                              className={`text-sm line-clamp-2 ${
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              }`}
                            >
                              <span className="font-medium text-green-600 dark:text-green-400">
                                AI Summary:{" "}
                              </span>
                              {pdf.insight.englishSummary}
                            </p>
                          )}
                        </div>
                        <span
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                            theme === "light"
                              ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                              : "bg-green-900/50 text-green-300 border border-green-800 hover:bg-green-800"
                          }`}
                        >
                          👁️ View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`text-center py-8 rounded-xl transition-all duration-300 hover:shadow-md w-full ${
                      theme === "light"
                        ? "bg-green-50 border border-dashed border-green-300 hover:border-green-400"
                        : "bg-gray-700 border border-dashed border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <p
                      className={
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }
                    >
                      No reports uploaded yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Desktop Layout - Side by side */}
        <div className="hidden lg:grid grid-cols-2 gap-8">
          {/* Vitals Section - Desktop */}
          <section>
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg h-full flex flex-col ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold flex items-center gap-2 ${
                    theme === "light" ? "text-green-700" : "text-green-400"
                  }`}
                >
                  📊 Health Vitals
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === "light"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-green-900/50 text-green-300 border border-green-800"
                  }`}
                >
                  {vitals.length} records
                </span>
              </div>

              {vitals.length > 0 ? (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {vitals.map((vital) => (
                    <div
                      key={vital._id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                        theme === "light"
                          ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100"
                          : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getVitalIcon(vital.type)}
                          </span>
                          <div>
                            <div className="font-semibold text-green-700 dark:text-green-300">
                              {vital.type === "BP"
                                ? "Blood Pressure"
                                : vital.type === "Sugar"
                                ? "Blood Sugar"
                                : vital.type === "Weight"
                                ? "Weight"
                                : vital.type === "Temperature"
                                ? "Temperature"
                                : vital.type}
                            </div>
                            <div
                              className={`text-sm opacity-80 ${
                                theme === "light"
                                  ? "text-green-600"
                                  : "text-green-400"
                              }`}
                            >
                              {new Date(vital.date).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-2 rounded-lg text-lg font-medium whitespace-nowrap transition-all duration-300 ${
                            theme === "light"
                              ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                              : "bg-green-900/50 text-green-300 border border-green-800 hover:bg-green-800"
                          }`}
                        >
                          {vital.value}
                        </span>
                      </div>
                      {vital.notes && (
                        <p
                          className={`mt-3 pl-10 sm:pl-12 text-sm ${
                            theme === "light"
                              ? "text-gray-700"
                              : "text-gray-300"
                          }`}
                        >
                          📝 {vital.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`text-center py-8 rounded-xl transition-all duration-300 hover:shadow-md w-full ${
                      theme === "light"
                        ? "bg-green-50 border border-dashed border-green-300 hover:border-green-400"
                        : "bg-gray-700 border border-dashed border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <p
                      className={
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }
                    >
                      No vitals recorded yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Reports Section - Desktop */}
          <section>
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg h-full flex flex-col ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={`text-xl font-semibold flex items-center gap-2 ${
                    theme === "light" ? "text-green-700" : "text-green-400"
                  }`}
                >
                  📋 Medical Reports
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    theme === "light"
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-green-900/50 text-green-300 border border-green-800"
                  }`}
                >
                  {pdfs.length} reports
                </span>
              </div>

              {pdfs.length > 0 ? (
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {pdfs.map((pdf) => (
                    <div
                      key={pdf._id}
                      onClick={() => setSelectedPdf(pdf)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                        theme === "light"
                          ? "bg-green-50 border-green-200 hover:border-green-300 hover:bg-green-100"
                          : "bg-gray-700 border-gray-600 hover:border-gray-500 hover:bg-gray-600"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">📄</span>
                            <div className="font-semibold text-green-700 dark:text-green-300">
                              {pdf.originalName}
                            </div>
                          </div>
                          <div
                            className={`text-sm opacity-80 mb-3 ${
                              theme === "light"
                                ? "text-green-600"
                                : "text-green-400"
                            }`}
                          >
                            📅 {new Date(pdf.uploadDate).toLocaleDateString()}
                          </div>
                          {pdf.insight && (
                            <p
                              className={`text-sm line-clamp-2 ${
                                theme === "light"
                                  ? "text-gray-700"
                                  : "text-gray-300"
                              }`}
                            >
                              <span className="font-medium text-green-600 dark:text-green-400">
                                AI Summary:{" "}
                              </span>
                              {pdf.insight.englishSummary}
                            </p>
                          )}
                        </div>
                        <span
                          className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                            theme === "light"
                              ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                              : "bg-green-900/50 text-green-300 border border-green-800 hover:bg-green-800"
                          }`}
                        >
                          👁️ View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div
                    className={`text-center py-8 rounded-xl transition-all duration-300 hover:shadow-md w-full ${
                      theme === "light"
                        ? "bg-green-50 border border-dashed border-green-300 hover:border-green-400"
                        : "bg-gray-700 border border-dashed border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <p
                      className={
                        theme === "light" ? "text-green-600" : "text-green-400"
                      }
                    >
                      No reports uploaded yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* PDF Modal */}
        {selectedPdf && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-all duration-300"
            onClick={() => setSelectedPdf(null)}
          >
            <div
              className={`w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto transition-all duration-300 transform hover:scale-[1.01] ${
                theme === "light"
                  ? "bg-white border border-green-200"
                  : "bg-gray-800 border border-gray-700"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                className={`flex justify-between items-center p-6 border-b ${
                  theme === "light" ? "border-green-200" : "border-gray-700"
                }`}
              >
                <div>
                  <h3
                    className={`text-lg font-bold ${
                      theme === "light" ? "text-green-700" : "text-green-400"
                    }`}
                  >
                    📄 {selectedPdf.originalName}
                  </h3>
                  <p
                    className={`text-sm opacity-80 ${
                      theme === "light" ? "text-green-600" : "text-green-400"
                    }`}
                  >
                    Uploaded on{" "}
                    {new Date(selectedPdf.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                    theme === "light"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {selectedPdf.insight ? (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">🤖</span>
                      <h4
                        className={`font-semibold text-lg ${
                          theme === "light"
                            ? "text-green-700"
                            : "text-green-400"
                        }`}
                      >
                        HealthMate AI Insights
                      </h4>
                    </div>
                    <div
                      className={`text-sm leading-relaxed whitespace-pre-wrap space-y-3 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {selectedPdf.insight.englishSummary}
                    </div>
                  </div>
                ) : (
                  <p
                    className={`text-center py-8 ${
                      theme === "light" ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    No AI insights available for this report.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedDashboard;
