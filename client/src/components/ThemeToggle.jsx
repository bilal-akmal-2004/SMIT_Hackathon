// src/components/ThemeToggle.jsx
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        whileTap={{ scale: 0.85, rotate: 180 }}
        whileHover={{ scale: 1.1 }}
        onClick={toggleTheme}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-br from-yellow-300 to-orange-500 dark:from-gray-700 dark:to-gray-900 transition-all duration-500"
      >
        {isMounted && (
          <motion.div
            key={theme}
            initial={{ rotate: 0, scale: 0 }}
            animate={{ rotate: 360, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            {theme === "light" ? (
              // Sun icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </svg>
            ) : (
              // Moon icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </svg>
            )}
          </motion.div>
        )}
      </motion.button>
    </div>
  );
}
