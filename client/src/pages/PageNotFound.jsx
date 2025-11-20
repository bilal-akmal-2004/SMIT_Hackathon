// client/src/pages/PageNotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function PageNotFound() {
  const navigate = useNavigate();
  const { theme } = useTheme();

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
        duration: 0.6,
      },
    },
  };

  const bounceVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 flex items-center justify-center px-4 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-2xl mx-auto"
      >
        {/* Animated 404 */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative inline-block">
            <motion.span
              variants={bounceVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              className={`text-8xl sm:text-9xl font-bold block leading-none ${
                theme === "light" ? "text-green-600" : "text-green-400"
              }`}
            >
              404
            </motion.span>
            <motion.div
              variants={pulseVariants}
              animate="animate"
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full ${
                theme === "light" ? "bg-green-400" : "bg-green-500"
              }`}
            ></motion.div>
          </div>
        </motion.div>

        {/* Main Message */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1
            whileHover={{ scale: 1.02 }}
            className={`text-2xl sm:text-3xl font-bold mb-4 ${
              theme === "light" ? "text-gray-800" : "text-gray-100"
            }`}
          >
            🚫 Page Not Found
          </motion.h1>
          <motion.p
            whileHover={{ x: 5 }}
            className={`text-lg sm:text-xl mb-2 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Oops! The page you're looking for doesn't exist.
          </motion.p>
          <motion.p
            whileHover={{ x: -5 }}
            className={`text-sm sm:text-base ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            It might have been moved, deleted, or you entered the wrong URL.
          </motion.p>
        </motion.div>

        {/* HealthMate Branding */}
        <motion.div
          variants={bounceVariants}
          whileHover="hover"
          className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl mb-8 cursor-pointer ${
            theme === "light"
              ? "bg-green-100 border border-green-200 hover:bg-green-200 hover:shadow-lg"
              : "bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:shadow-lg"
          }`}
          onClick={() => navigate("/")}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md"
          >
            <span className="text-white font-bold text-lg">H</span>
          </motion.div>
          <div className="text-left">
            <div
              className={`font-bold text-lg ${
                theme === "light" ? "text-green-700" : "text-green-400"
              }`}
            >
              HealthMate
            </div>
            <div
              className={`text-sm ${
                theme === "light" ? "text-green-600" : "text-green-300"
              }`}
            >
              Sehat ka Smart Dost
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <motion.button
            variants={bounceVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-md ${
              theme === "light"
                ? "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
                : "bg-green-600 text-white hover:bg-green-500 hover:shadow-lg"
            }`}
          >
            <motion.span
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              ↩️
            </motion.span>
            Go Back
          </motion.button>

          <motion.button
            variants={bounceVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 border-2 shadow-sm ${
              theme === "light"
                ? "bg-white text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 hover:shadow-md"
                : "bg-gray-800 text-green-400 border-gray-600 hover:bg-gray-700 hover:border-green-500 hover:shadow-md"
            }`}
          >
            <motion.span
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              🏠
            </motion.span>
            Go Home
          </motion.button>

          <motion.button
            variants={bounceVariants}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/auth")}
            className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 border shadow-sm ${
              theme === "light"
                ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300 hover:shadow-md"
                : "bg-gray-800 text-green-300 border-gray-700 hover:bg-gray-700 hover:border-green-400 hover:shadow-md"
            }`}
          >
            <motion.span
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              🔐
            </motion.span>
            Sign In
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={itemVariants} className="mt-8">
          <motion.p
            whileHover={{ scale: 1.02 }}
            className={`text-sm mb-4 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Quick links you might be looking for:
          </motion.p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { path: "/home", label: "Dashboard", icon: "📊", emoji: "🏠" },
              {
                path: "/dashboard",
                label: "Timeline",
                icon: "🕒",
                emoji: "📈",
              },
              { path: "/pdfs", label: "Reports", icon: "📄", emoji: "📋" },
              {
                path: "/add-vitals",
                label: "Add Vital",
                icon: "❤️",
                emoji: "➕",
              },
            ].map((link, index) => (
              <motion.button
                key={index}
                variants={bounceVariants}
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(link.path)}
                className={`group px-4 py-3 rounded-lg text-sm border transition-all duration-300 ${
                  theme === "light"
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-md"
                    : "bg-gray-800 text-green-300 border-gray-700 hover:bg-gray-700 hover:border-green-400 hover:shadow-md"
                }`}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-base"
                  >
                    {link.emoji}
                  </motion.span>
                  <span>{link.label}</span>
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    className="text-xs"
                  >
                    {link.icon}
                  </motion.span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          variants={itemVariants}
          className={`mt-8 pt-6 border-t ${
            theme === "light"
              ? "border-green-200 text-gray-500"
              : "border-gray-700 text-gray-400"
          }`}
        >
          <motion.p whileHover={{ scale: 1.01 }} className="text-xs">
            © {new Date().getFullYear()} HealthMate — Your health companion
          </motion.p>
          <motion.p whileHover={{ scale: 1.01 }} className="text-xs mt-1">
            Need help? Contact support if you believe this is an error.
          </motion.p>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute rounded-full ${
                theme === "light" ? "bg-green-200" : "bg-green-900"
              }`}
              style={{
                width: Math.random() * 20 + 5,
                height: Math.random() * 20 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
