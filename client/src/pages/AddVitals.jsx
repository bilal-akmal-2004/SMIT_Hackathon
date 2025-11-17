// client/src/pages/AddVitals.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const AddVitals = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "BP",
    value: "",
    notes: "",
  });
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/vitals`,
        formData,
        { withCredentials: true }
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Failed to save vital. Please try again.");
    }
  };

  const typeLabels = {
    BP: "Blood Pressure (e.g., 120/80)",
    Sugar: "Blood Sugar (mg/dL)",
    Weight: "Weight (e.g., 70 kg)",
    Temperature: "Temperature (°F or °C)",
    Other: "Value",
  };

  return (
    <div
      className={`min-h-screen w-[100%] transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      {/* Full-width container with responsive padding */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`p-2.5 rounded-full transition ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
            }`}
            aria-label="Go back"
          >
            ←
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
              Add Manual Vital
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Record your health readings anytime
            </p>
          </div>
        </div>

        <div
          className={`rounded-2xl p-4 sm:p-6 shadow-lg ${
            theme === "light"
              ? "bg-white border border-green-200"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                📅 Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition text-base ${
                  theme === "light"
                    ? "border-green-300 bg-green-50 focus:ring-green-400 focus:border-green-400 text-gray-800"
                    : "border-gray-700 bg-gray-900 focus:ring-green-500 focus:border-green-500 text-gray-200"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                ❤️ Type of Vital
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition text-base ${
                  theme === "light"
                    ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800"
                    : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200"
                }`}
              >
                <option value="BP">🫀 Blood Pressure</option>
                <option value="Sugar">🩸 Blood Sugar</option>
                <option value="Weight">⚖️ Weight</option>
                <option value="Temperature">🌡️ Temperature</option>
                <option value="Other">📝 Other</option>
              </select>
            </div>

            <div>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                📊 {typeLabels[formData.type]}
              </label>
              <input
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 120/80, 95, 70 kg"
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition text-base ${
                  theme === "light"
                    ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800"
                    : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200"
                }`}
                required
              />
            </div>

            <div>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                📝 Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="How are you feeling? Any symptoms?"
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition text-base ${
                  theme === "light"
                    ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800"
                    : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200"
                }`}
                rows="3"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className={`py-3 rounded-xl font-medium transition text-center ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600"
                } sm:flex-1`}
              >
                ↩️ Cancel
              </button>
              <button
                type="submit"
                className={`py-3 rounded-xl font-medium text-white transition text-center shadow-md ${
                  theme === "light"
                    ? "bg-green-600 hover:bg-green-700 border border-green-600"
                    : "bg-green-600 hover:bg-green-500 border border-green-600"
                } sm:flex-1`}
              >
                💾 Save Vital
              </button>
            </div>
          </form>
        </div>

        {/* Quick Tips Section */}
        <div
          className={`mt-6 rounded-2xl p-4 sm:p-6 ${
            theme === "light"
              ? "bg-green-50 border border-green-200"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          <h3
            className={`font-semibold mb-3 flex items-center gap-2 ${
              theme === "light" ? "text-green-700" : "text-green-400"
            }`}
          >
            💡 Quick Tips
          </h3>
          <ul
            className={`text-sm space-y-2 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            <li>
              • <strong>Blood Pressure:</strong> Enter as systolic/diastolic
              (e.g., 120/80)
            </li>
            <li>
              • <strong>Blood Sugar:</strong> Enter in mg/dL (e.g., 95)
            </li>
            <li>
              • <strong>Weight:</strong> Include units (e.g., 70 kg or 154 lbs)
            </li>
            <li>
              • <strong>Temperature:</strong> Specify units (e.g., 98.6°F or
              37°C)
            </li>
            <li>• Track regularly to monitor your health trends</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddVitals;
