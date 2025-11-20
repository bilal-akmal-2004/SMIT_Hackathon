// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

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

  // Stats data for better organization
  const statsData = [
    {
      label: "Total Records",
      value: vitals.length,
      icon: "📊",
      description: "All health entries",
    },
    {
      label: "BP Readings",
      value: vitals.filter((v) => v.type === "BP").length,
      icon: "🫀",
      description: "Blood pressure measurements",
    },
    {
      label: "Sugar Tests",
      value: vitals.filter((v) => v.type === "Sugar").length,
      icon: "🩸",
      description: "Blood glucose readings",
    },
    {
      label: "Days Tracked",
      value: new Set(vitals.map((v) => v.date.split("T")[0])).size,
      icon: "📅",
      description: "Unique tracking days",
    },
  ];

  // Animation variants
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

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen w-[100%] transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full transition ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
            }`}
            aria-label="Go back"
          >
            ←
          </motion.button>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
              📈 Health Timeline
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Track your vitals and health trends over time
            </p>
          </motion.div>
        </motion.div>

        {/* Add Vital Button - full width on mobile */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex justify-end mb-6"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              y: -2,
              transition: { type: "spring", stiffness: 400 },
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/add-vitals")}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition shadow-md ${
              theme === "light"
                ? "bg-green-600 text-white hover:bg-green-700 border border-green-600"
                : "bg-green-600 text-white hover:bg-green-500 border border-green-600"
            }`}
          >
            ➕ Add New Vital
          </motion.button>
        </motion.div>

        {/* Stats Summary */}
        {vitals.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-8"
          >
            <motion.h2
              whileHover={{ scale: 1.02 }}
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                theme === "light" ? "text-green-700" : "text-green-400"
              }`}
            >
              📊 Health Overview
            </motion.h2>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  className={`group text-center p-4 rounded-2xl transition-all duration-300 cursor-default ${
                    theme === "light"
                      ? "bg-gradient-to-br from-green-100 to-emerald-100 border border-green-200 hover:border-green-300 hover:from-green-200 hover:to-emerald-200"
                      : "bg-gradient-to-br from-gray-800 to-green-900/20 border border-green-800/50 hover:border-green-700 hover:from-gray-700 hover:to-green-900/30"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    className="text-2xl mb-2 transition-transform duration-300"
                  >
                    {stat.icon}
                  </motion.div>
                  <div
                    className={`text-2xl font-bold mb-1 ${
                      theme === "light" ? "text-green-700" : "text-green-400"
                    }`}
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      theme === "light" ? "text-green-600" : "text-green-300"
                    }`}
                  >
                    {stat.label}
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className={`text-xs mt-1 transition-opacity duration-300 ${
                      theme === "light" ? "text-green-500" : "text-green-400"
                    }`}
                  >
                    {stat.description}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Vitals List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {vitals.length > 0 ? (
            vitals.map((vital, index) => (
              <motion.div
                key={vital._id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  y: -3,
                  transition: { type: "spring", stiffness: 400 },
                }}
                className={`p-4 sm:p-5 rounded-2xl shadow-sm transition-all duration-300 ${
                  theme === "light"
                    ? "bg-white border border-green-200 hover:border-green-300 hover:shadow-lg"
                    : "bg-gray-800 border border-gray-700 hover:border-gray-600 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex items-center gap-3">
                    <motion.span
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      className="text-2xl"
                    >
                      {getVitalIcon(vital.type)}
                    </motion.span>
                    <div>
                      <div className="font-semibold text-base sm:text-lg">
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
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={`px-3 py-2 rounded-xl text-lg font-medium whitespace-nowrap transition-all duration-300 ${
                      theme === "light"
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200 hover:from-green-200 hover:to-emerald-200"
                        : "bg-gradient-to-r from-green-900/50 to-emerald-900/30 text-green-300 border border-green-800 hover:from-green-800 hover:to-emerald-800"
                    }`}
                  >
                    {vital.value}
                  </motion.span>
                </div>
                {vital.notes && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ delay: 0.2 }}
                    className={`mt-3 pl-10 sm:pl-12 text-sm leading-relaxed ${
                      theme === "light" ? "text-gray-700" : "text-gray-300"
                    }`}
                  >
                    📝 {vital.notes}
                  </motion.p>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.02 }}
              className={`text-center py-10 sm:py-12 rounded-2xl transition-all duration-300 ${
                theme === "light"
                  ? "bg-white border border-dashed border-green-300 hover:border-green-400"
                  : "bg-gray-800 border border-dashed border-gray-700 hover:border-gray-600"
              }`}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 2, repeat: Infinity },
                }}
                className="text-3xl sm:text-4xl mb-3 sm:mb-4"
              >
                📊
              </motion.div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">
                No health data yet
              </h3>
              <p
                className={`px-4 mb-4 opacity-80 text-sm ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                Start tracking your health journey by adding your first vital
                reading.
              </p>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -2,
                  transition: { type: "spring", stiffness: 400 },
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/add-vitals")}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-medium shadow-md transition-all duration-300 ${
                  theme === "light"
                    ? "bg-green-600 text-white hover:bg-green-700 border border-green-600"
                    : "bg-green-600 text-white hover:bg-green-500 border border-green-600"
                }`}
              >
                ➕ Add Your First Vital
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Health Tracking Tips */}
        {vitals.length > 0 && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{ y: -2 }}
            className={`mt-8 rounded-2xl p-4 transition-all duration-300 ${
              theme === "light"
                ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-300 hover:shadow-lg"
                : "bg-gradient-to-r from-gray-800 to-green-900/20 border border-gray-700 hover:border-gray-600 hover:shadow-lg"
            }`}
          >
            <motion.h3
              whileHover={{ scale: 1.02 }}
              className={`font-semibold mb-2 flex items-center gap-2 ${
                theme === "light" ? "text-green-700" : "text-green-400"
              }`}
            >
              💡 Tracking Tips
            </motion.h3>
            <motion.ul
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={`text-xs space-y-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              {[
                "Track your vitals at the same time each day for consistent data",
                "Note any symptoms or lifestyle changes in the notes section",
                "Regular tracking helps identify patterns and trends",
                "Share this data with your healthcare provider during checkups",
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
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
