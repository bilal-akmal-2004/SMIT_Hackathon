// client/src/pages/SearchMembers.jsx (Enhanced)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const SearchMembers = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [recentShares, setRecentShares] = useState([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Live search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/share/search?q=${encodeURIComponent(query)}`,
          { withCredentials: true }
        );
        setResults(res.data);
      } catch (err) {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch recent shares
  useEffect(() => {
    const fetchRecentShares = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/share/recent`,
          { withCredentials: true }
        );
        setRecentShares(res.data);
      } catch (err) {
        console.error("Failed to fetch recent shares");
      }
    };
    fetchRecentShares();
  }, []);

  const handleSelect = (user) => {
    setSelectedUser(user);
    setQuery(user.email);
    setResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setLoading(true);
    setMessage("");
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/share/grant`,
        { email: selectedUser.email },
        { withCredentials: true }
      );
      setMessage("✅ Access granted successfully!");
      setQuery("");
      setSelectedUser(null);
      // Refresh recent shares
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/share/recent`,
        { withCredentials: true }
      );
      setRecentShares(res.data);
    } catch (err) {
      setMessage(err.response?.data?.error || "Failed to grant access");
    } finally {
      setLoading(false);
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
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
              🤝 Share Health Data
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Securely share your medical reports with family or healthcare
              providers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Search Section */}
          <div className="lg:col-span-2">
            <div
              className={`rounded-2xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="text-center mb-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 transition-all duration-300 hover:scale-110">
                  <span className="text-green-600 dark:text-green-300 text-3xl">
                    🔍
                  </span>
                </div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}
                >
                  Find Members to Share With
                </h2>
                <p
                  className={`text-sm opacity-80 ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  Search by name or email address
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Start typing name or email..."
                    className={`w-full px-5 py-4 rounded-xl border focus:outline-none focus:ring-2 text-lg transition-all duration-300 ${
                      theme === "light"
                        ? "border-green-300 bg-green-50 text-gray-800 placeholder-gray-500 focus:ring-green-500 focus:border-green-400 hover:border-green-400"
                        : "border-gray-600 bg-gray-900 text-gray-200 placeholder-gray-500 focus:ring-green-400 focus:border-green-500 hover:border-gray-500"
                    }`}
                    autoComplete="off"
                  />
                  {results.length > 0 && (
                    <div
                      className={`absolute z-10 mt-2 w-full rounded-xl shadow-lg border max-h-60 overflow-y-auto ${
                        theme === "light"
                          ? "bg-white border-green-200"
                          : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      {results.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleSelect(user)}
                          className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                            theme === "light"
                              ? "hover:bg-green-50 text-gray-800 border-b border-green-100 last:border-b-0"
                              : "hover:bg-gray-700 text-gray-200 border-b border-gray-700 last:border-b-0"
                          }`}
                        >
                          <div className="font-medium flex items-center gap-2">
                            <span>👤</span>
                            {user.name}
                          </div>
                          <div className="text-sm opacity-80 ml-6">
                            {user.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {selectedUser && (
                  <div
                    className={`p-4 rounded-xl border transition-all duration-300 ${
                      theme === "light"
                        ? "bg-green-50 border-green-200"
                        : "bg-green-900/20 border-green-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          👤 {selectedUser.name}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          {selectedUser.email}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedUser(null);
                          setQuery("");
                        }}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !selectedUser}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg shadow-md transition-all duration-300 ${
                    loading || !selectedUser
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 hover:scale-105 hover:shadow-lg border border-green-600"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Granting Access...
                    </span>
                  ) : (
                    "✅ Grant Health Data Access"
                  )}
                </button>
              </form>

              {message && (
                <div
                  className={`mt-6 p-4 rounded-xl text-center font-medium transition-all duration-300 ${
                    message.includes("✅")
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200"
                  }`}
                >
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recent Shares & Info */}
          <div className="space-y-6">
            {/* Recent Shares */}
            <div
              className={`rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <h3
                className={`font-bold text-lg mb-4 flex items-center gap-2 ${
                  theme === "light" ? "text-green-700" : "text-green-400"
                }`}
              >
                📋 Recently Shared With
              </h3>
              {recentShares.length > 0 ? (
                <div className="space-y-3">
                  {recentShares.slice(0, 5).map((share) => (
                    <div
                      key={share._id}
                      className={`p-3 rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                        theme === "light"
                          ? "bg-green-50 border border-green-200 hover:bg-green-100"
                          : "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                      }`}
                    >
                      <div className="font-medium text-green-700 dark:text-green-300">
                        {share.sharedWithName}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400">
                        {new Date(share.sharedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  className={`text-sm italic ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No recent shares yet
                </p>
              )}
            </div>

            {/* Sharing Tips */}
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
                💡 Sharing Tips
              </h3>
              <ul
                className={`text-sm space-y-2 ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}
              >
                <li>
                  • Share with family members for better health coordination
                </li>
                <li>• Grant access to your healthcare providers</li>
                <li>• You can revoke access anytime</li>
                <li>• Shared data is encrypted and secure</li>
                <li>• Only share with trusted individuals</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchMembers;
