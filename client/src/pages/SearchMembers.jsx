// client/src/pages/SearchMembers.jsx (Enhanced)
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`min-h-screen w-full transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className={`p-2 rounded-full transition-all duration-300 ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
            }`}
          >
            ←
          </motion.button>
          <div>
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-green-700 dark:text-green-400"
            >
              🤝 Share Health Data
            </motion.h1>
            <motion.p
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Securely share your medical reports with family or healthcare
              providers
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Search Section */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <motion.div
              whileHover={{ y: -5, scale: 1.005 }}
              className={`rounded-2xl p-8 shadow-lg transition-all duration-300 ${
                theme === "light"
                  ? "bg-white border border-green-200 hover:border-green-300"
                  : "bg-gray-800 border border-gray-700 hover:border-gray-600"
              }`}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-8"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 transition-all duration-300"
                >
                  <span className="text-green-600 dark:text-green-300 text-3xl">
                    🔍
                  </span>
                </motion.div>
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
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
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
                  <AnimatePresence>
                    {results.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute z-10 mt-2 w-full rounded-xl shadow-lg border max-h-60 overflow-y-auto ${
                          theme === "light"
                            ? "bg-white border-green-200"
                            : "bg-gray-800 border-gray-700"
                        }`}
                      >
                        {results.map((user, index) => (
                          <motion.div
                            key={user._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleSelect(user)}
                            className={`px-4 py-3 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                              theme === "light"
                                ? "hover:bg-green-50 text-gray-800 border-b border-green-100 last:border-b-0"
                                : "hover:bg-gray-700 text-gray-200 border-b border-gray-700 last:border-b-0"
                            }`}
                          >
                            <div className="font-medium flex items-center gap-2">
                              <motion.span
                                whileHover={{ scale: 1.2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                👤
                              </motion.span>
                              {user.name}
                            </div>
                            <div className="text-sm opacity-80 ml-6">
                              {user.email}
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {selectedUser && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`p-4 rounded-xl border transition-all duration-300 overflow-hidden ${
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
                        <motion.button
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => {
                            setSelectedUser(null);
                            setQuery("");
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          ✕
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={!loading && !selectedUser ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || !selectedUser}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white text-lg shadow-md transition-all duration-300 ${
                    loading || !selectedUser
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 hover:shadow-lg border border-green-600"
                  }`}
                >
                  {loading ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Granting Access...
                    </motion.span>
                  ) : (
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center justify-center gap-2"
                    >
                      ✅ Grant Health Data Access
                    </motion.span>
                  )}
                </motion.button>
              </form>

              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-6 p-4 rounded-xl text-center font-medium transition-all duration-300 ${
                      message.includes("✅")
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200"
                    }`}
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Sidebar - Recent Shares & Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Recent Shares */}
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className={`rounded-2xl p-6 transition-all duration-300 ${
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
                  {recentShares.slice(0, 5).map((share, index) => (
                    <motion.div
                      key={share._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className={`p-3 rounded-lg transition-all duration-200 ${
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
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className={`text-sm italic ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  No recent shares yet
                </motion.p>
              )}
            </motion.div>

            {/* Sharing Tips */}
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              className={`rounded-2xl p-6 transition-all duration-300 ${
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
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className={`text-sm space-y-2 ${
                  theme === "light" ? "text-gray-600" : "text-gray-300"
                }`}
              >
                {[
                  "Share with family members for better health coordination",
                  "Grant access to your healthcare providers",
                  "You can revoke access anytime",
                  "Shared data is encrypted and secure",
                  "Only share with trusted individuals",
                ].map((tip, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    className="transition-all duration-200"
                  >
                    • {tip}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchMembers;
