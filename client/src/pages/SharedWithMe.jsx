// client/src/pages/SharedWithMe.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const SharedWithMe = () => {
  const [sharedWithMe, setSharedWithMe] = useState([]); // people who shared with me
  const [sharedByMe, setSharedByMe] = useState([]); // people I shared with
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // People who shared with me
        const sharedWithMeRes = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/shared-with-me`,
          { withCredentials: true }
        );
        setSharedWithMe(sharedWithMeRes.data);

        // People I shared with (reverse lookup)
        const allShares = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/shared-by-me`,
          { withCredentials: true }
        );
        setSharedByMe(allShares.data);
      } catch (err) {
        console.error("Failed to load shared lists");
      }
    };
    fetchData();
  }, []);

  const handleRevoke = async (viewerId) => {
    if (!window.confirm("Revoke access? They will no longer see your data."))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/share/revoke/${viewerId}`,
        { withCredentials: true }
      );
      setSharedByMe((prev) => prev.filter((u) => u.id !== viewerId));
    } catch (err) {
      alert("Failed to revoke access");
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/home")}
            className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold text-green-700 dark:text-green-400">
              🤝 Data Sharing
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Manage who can view your health data and see who shared with you
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shared With Me */}
          <div
            className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
              theme === "light"
                ? "bg-white border border-green-200 hover:border-green-300"
                : "bg-gray-800 border border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-bold flex items-center gap-2 ${
                  theme === "light" ? "text-green-700" : "text-green-400"
                }`}
              >
                👥 Shared With You
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme === "light"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-green-900/50 text-green-300 border border-green-800"
                }`}
              >
                {sharedWithMe.length} people
              </span>
            </div>

            {sharedWithMe.length === 0 ? (
              <div
                className={`text-center py-8 rounded-xl transition-all duration-300 hover:shadow-md ${
                  theme === "light"
                    ? "bg-green-50 border border-dashed border-green-300 hover:border-green-400"
                    : "bg-gray-700 border border-dashed border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="text-4xl mb-3">🔒</div>
                <p
                  className={
                    theme === "light" ? "text-green-600" : "text-green-400"
                  }
                >
                  No one has shared their health data with you yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedWithMe.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => navigate(`/shared/${user.id}`)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                      theme === "light"
                        ? "bg-green-50 border border-green-200 hover:border-green-300 hover:bg-green-100"
                        : "bg-gray-700 border border-gray-600 hover:border-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          {user.name}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          {user.email}
                        </div>
                        <div className="text-xs text-green-500 dark:text-green-500 mt-1">
                          Shared on{" "}
                          {new Date(user.sharedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 ${
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
            )}
          </div>

          {/* Shared By Me */}
          <div
            className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
              theme === "light"
                ? "bg-white border border-green-200 hover:border-green-300"
                : "bg-gray-800 border border-gray-700 hover:border-gray-600"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className={`text-xl font-bold flex items-center gap-2 ${
                  theme === "light" ? "text-green-700" : "text-green-400"
                }`}
              >
                📤 You Shared With
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  theme === "light"
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-green-900/50 text-green-300 border border-green-800"
                }`}
              >
                {sharedByMe.length} people
              </span>
            </div>

            {sharedByMe.length === 0 ? (
              <div
                className={`text-center py-8 rounded-xl transition-all duration-300 hover:shadow-md ${
                  theme === "light"
                    ? "bg-green-50 border border-dashed border-green-300 hover:border-green-400"
                    : "bg-gray-700 border border-dashed border-gray-600 hover:border-gray-500"
                }`}
              >
                <div className="text-4xl mb-3">📤</div>
                <p
                  className={
                    theme === "light" ? "text-green-600" : "text-green-400"
                  }
                >
                  You haven't shared your data with anyone yet.
                </p>
                <button
                  onClick={() => navigate("/search-members")}
                  className={`mt-4 px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 ${
                    theme === "light"
                      ? "bg-green-600 text-white hover:bg-green-700 border border-green-600"
                      : "bg-green-600 text-white hover:bg-green-500 border border-green-600"
                  }`}
                >
                  🤝 Share Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sharedByMe.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                      theme === "light"
                        ? "bg-green-50 border border-green-200 hover:border-green-300 hover:bg-green-100"
                        : "bg-gray-700 border border-gray-600 hover:border-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-green-700 dark:text-green-300">
                            {user.name}
                          </div>
                          <div className="text-sm text-green-600 dark:text-green-400">
                            {user.email}
                          </div>
                          <div className="text-xs text-green-500 dark:text-green-500 mt-1">
                            Shared on{" "}
                            {new Date(user.sharedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRevoke(user.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 ${
                          theme === "light"
                            ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 hover:border-red-300"
                            : "bg-red-900/50 text-red-300 border border-red-800 hover:bg-red-800 hover:border-red-700"
                        }`}
                      >
                        🚫 Revoke
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/search-members")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
              theme === "light"
                ? "bg-green-600 text-white hover:bg-green-700 border border-green-600 shadow-md"
                : "bg-green-600 text-white hover:bg-green-500 border border-green-600 shadow-md"
            }`}
          >
            🤝 Share With Someone New
          </button>
          <button
            onClick={() => navigate("/home")}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 ${
              theme === "light"
                ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200"
                : "bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700"
            }`}
          >
            ↩️ Back to Dashboard
          </button>
        </div>

        {/* Sharing Tips */}
        <div
          className={`mt-8 rounded-2xl p-6 transition-all duration-300 hover:shadow-md ${
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
            💡 Sharing Best Practices
          </h3>
          <ul
            className={`text-sm space-y-2 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            <li>
              • Only share with trusted family members and healthcare providers
            </li>
            <li>• You can revoke access anytime if needed</li>
            <li>• Shared data is encrypted and secure</li>
            <li>• Regular sharing helps in coordinated healthcare</li>
            <li>• Keep your sharing list updated regularly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SharedWithMe;
