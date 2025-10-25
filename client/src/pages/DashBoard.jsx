// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Dashboard = () => {
  const [vitals, setVitals] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/vitals`,
          { withCredentials: true }
        );
        setVitals(res.data);
      } catch (err) {
        console.error("Failed to load vitals", err);
      }
    };
    fetchVitals();
  }, []);

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

  return (
    <div
      className={`min-h-screen w-[100%] transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-sky-50 via-white to-indigo-50"
          : "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full transition ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700"
            }`}
            aria-label="Go back"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              Your Health Timeline
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Track your vitals and health trends over time
            </p>
          </div>
        </div>

        {/* Add Vital Button - full width on mobile */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/add-vitals")}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition ${
              theme === "light"
                ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                : "bg-indigo-500 text-white hover:bg-indigo-600"
            }`}
          >
            ➕ Add Manual Vital
          </button>
        </div>

        {/* Vitals List */}
        <div className="space-y-4">
          {vitals.length > 0 ? (
            vitals.map((vital) => (
              <div
                key={vital._id}
                className={`p-4 sm:p-5 rounded-2xl shadow-sm transition ${
                  theme === "light"
                    ? "bg-white border border-gray-200"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getVitalIcon(vital.type)}</span>
                    <div>
                      <div className="font-semibold text-base sm:text-lg">
                        {vital.type}
                      </div>
                      <div
                        className={`text-xs sm:text-sm opacity-80 mt-0.5 ${
                          theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`}
                      >
                        {new Date(vital.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xl font-medium whitespace-nowrap ${
                      theme === "light"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-indigo-900/50 text-indigo-300"
                    }`}
                  >
                    {vital.value}
                  </span>
                </div>
                {vital.notes && (
                  <p
                    className={`mt-3 pl-10 sm:pl-12 text-sm leading-relaxed ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    “{vital.notes}”
                  </p>
                )}
              </div>
            ))
          ) : (
            <div
              className={`text-center py-10 sm:py-12 rounded-2xl ${
                theme === "light"
                  ? "bg-white border border-dashed border-gray-300"
                  : "bg-gray-800 border border-dashed border-gray-700"
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🩺</div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">
                No vitals recorded yet
              </h3>
              <p
                className={`px-4 mb-4 opacity-80 text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Start tracking your health by adding your first vital reading.
              </p>
              <button
                onClick={() => navigate("/add-vitals")}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium ${
                  theme === "light"
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-500 text-white hover:bg-indigo-600"
                }`}
              >
                Add Your First Vital
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
