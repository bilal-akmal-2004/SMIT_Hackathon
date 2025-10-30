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
          ? "bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50"
          : "bg-gradient-to-br from-gray-900 via-gray-950 to-black"
      }`}
    >
      <div className="max-w-md mx-auto px-4 sm:px-6 py-10">
        <button
          onClick={() => navigate("/home")}
          className={`mb-8 flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm border ${
            theme === "light"
              ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
              : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700 hover:border-gray-600"
          }`}
        >
          ← Back to Shares
        </button>

        <div
          className={`rounded-2xl p-7 shadow-lg ${
            theme === "light"
              ? "bg-white border border-gray-200"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          <div className="text-center mb-6">
            <div className="mx-auto w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
              <span className="text-indigo-600 dark:text-indigo-300 text-2xl">
                🔍
              </span>
            </div>
            <h1
              className={`text-2xl font-bold ${
                theme === "light" ? "text-gray-900" : "text-white"
              }`}
            >
              Find Someone to Share With
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email..."
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
                  theme === "light"
                    ? "border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-indigo-500"
                    : "border-gray-600 bg-gray-900 text-gray-200 placeholder-gray-500 focus:ring-indigo-400"
                }`}
                autoComplete="off"
              />
              {results.length > 0 && (
                <div
                  className={`absolute z-10 mt-1 w-full rounded-xl shadow-lg ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  {results.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => handleSelect(user)}
                      className={`px-4 py-2.5 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 ${
                        theme === "light" ? "text-gray-800" : "text-gray-200"
                      }`}
                    >
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm opacity-80">{user.email}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !selectedUser}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white shadow-md transition ${
                loading || !selectedUser
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              Grant Access
            </button>
          </form>

          {message && (
            <div
              className={`mt-5 p-3 rounded-xl text-center text-sm font-medium ${
                message.includes("✅")
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchMembers;
