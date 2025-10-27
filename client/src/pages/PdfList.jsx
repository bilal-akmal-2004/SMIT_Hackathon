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
          ? "bg-gradient-to-br from-sky-50 via-white to-indigo-50"
          : "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/home")}
            className={`p-2 rounded-full transition ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Your Medical Reports</h1>
        </div>

        {loading ? (
          <div className="text-center py-10">Loading your reports...</div>
        ) : pdfs.length === 0 ? (
          <div
            className={`text-center py-12 rounded-2xl ${
              theme === "light"
                ? "bg-white border border-dashed border-gray-300"
                : "bg-gray-800 border border-dashed border-gray-700"
            }`}
          >
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-medium mb-2">
              No reports uploaded yet
            </h3>
            <p
              className={`mb-4 opacity-80 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Upload your first medical PDF to get AI-powered insights.
            </p>
            <button
              onClick={() => navigate("/home")}
              className={`px-5 py-2 rounded-lg font-medium ${
                theme === "light"
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-500 text-white hover:bg-indigo-600"
              }`}
            >
              Upload a Report
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pdfs.map((pdf) => (
              <div
                key={pdf._id}
                onClick={() => handleView(pdf._id)}
                className={`p-5 rounded-2xl shadow-sm cursor-pointer transition ${
                  theme === "light"
                    ? "bg-white border border-gray-200 hover:bg-gray-50"
                    : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
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
        )}
      </div>
    </div>
  );
};

export default PdfList;
