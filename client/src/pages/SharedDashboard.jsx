// client/src/pages/SharedDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const SharedDashboard = () => {
  const [owner, setOwner] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleViewPdf = (id) => {
    // You can create a SharedPdfViewer later, or reuse PdfViewer with ownerId
    alert("PDF viewing for shared reports is not implemented yet.");
    // navigate(`/shared-pdf/${ownerId}/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div
          className={`text-lg ${
            theme === "light" ? "text-gray-800" : "text-gray-200"
          }`}
        >
          Loading {owner?.name}'s health data...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-gray-950 to-black"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/shared-with-me")}
            className={`p-2.5 rounded-lg ${
              theme === "light"
                ? "bg-white text-gray-700 shadow-sm hover:bg-gray-100"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
            aria-label="Back"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {owner?.name}'s Shared Health Data
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Shared with you on{" "}
              {new Date(owner?.sharedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Vitals Section */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-xl font-semibold ${
                theme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              📊 Vitals
            </h2>
          </div>
          {vitals.length > 0 ? (
            <div className="space-y-4">
              {vitals.map((vital) => (
                <div
                  key={vital._id}
                  className={`p-4 rounded-xl border ${
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {getVitalIcon(vital.type)}
                      </span>
                      <div>
                        <div className="font-semibold">{vital.type}</div>
                        <div
                          className={`text-sm opacity-80 ${
                            theme === "light"
                              ? "text-gray-600"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(vital.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        theme === "light"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-indigo-900/40 text-indigo-300"
                      }`}
                    >
                      {vital.value}
                    </span>
                  </div>
                  {vital.notes && (
                    <p
                      className={`mt-3 pl-10 sm:pl-12 text-sm ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      “{vital.notes}”
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-8 rounded-xl ${
                theme === "light"
                  ? "bg-gray-50 border border-dashed border-gray-300"
                  : "bg-gray-900/50 border border-dashed border-gray-700"
              }`}
            >
              <p
                className={
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }
              >
                No vitals recorded yet.
              </p>
            </div>
          )}
        </section>

        {/* Reports Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2
              className={`text-xl font-semibold ${
                theme === "light" ? "text-gray-800" : "text-gray-200"
              }`}
            >
              📄 Medical Reports
            </h2>
          </div>
          {pdfs.length > 0 ? (
            <div className="space-y-4">
              {pdfs.map((pdf) => (
                <div
                  key={pdf._id}
                  onClick={() => handleViewPdf(pdf._id)}
                  className={`p-5 rounded-xl border cursor-pointer transition ${
                    theme === "light"
                      ? "bg-white border-gray-200 hover:bg-gray-50"
                      : "bg-gray-800 border-gray-700 hover:bg-gray-750"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{pdf.originalName}</div>
                      <div
                        className={`text-sm opacity-80 mt-1 ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {new Date(pdf.uploadDate).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400">
                      👁️ View
                    </span>
                  </div>
                  {pdf.insight && (
                    <p
                      className={`mt-3 text-sm line-clamp-2 ${
                        theme === "light" ? "text-gray-700" : "text-gray-300"
                      }`}
                    >
                      {pdf.insight.englishSummary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-8 rounded-xl ${
                theme === "light"
                  ? "bg-gray-50 border border-dashed border-gray-300"
                  : "bg-gray-900/50 border border-dashed border-gray-700"
              }`}
            >
              <p
                className={
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }
              >
                No reports uploaded yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SharedDashboard;
