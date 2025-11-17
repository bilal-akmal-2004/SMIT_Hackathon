// src/components/ThemeToggle.jsx
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <motion.button
        whileTap={{ scale: 0.85, rotate: 180 }}
        whileHover={{
          scale: 1.15,
          transition: { type: "spring", stiffness: 400, damping: 10 },
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={toggleTheme}
        className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl bg-gradient-to-br from-yellow-300 to-orange-500 dark:from-gray-700 dark:to-gray-900 transition-all duration-500 group"
      >
        {/* Blooming Effect */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0.4 }}
            exit={{ scale: 1, opacity: 0 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-200 to-orange-400 dark:from-gray-600 dark:to-gray-800 blur-sm"
          />
        )}

        {/* Glow Effect */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 0.2 }}
            exit={{ scale: 1, opacity: 0 }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-orange-500 dark:from-gray-500 dark:to-gray-700 blur-md"
          />
        )}

        {/* Pulse Ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full border-2 border-yellow-400/30 dark:border-gray-400/30"
        />

        {isMounted && (
          <motion.div
            key={theme}
            initial={{ rotate: 0, scale: 0 }}
            animate={{
              rotate: 360,
              scale: 1,
              filter: isHovered ? "brightness(1.3)" : "brightness(1)",
            }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative z-10"
          >
            {theme === "light" ? (
              // Sun icon with enhanced glow
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-yellow-500 filter drop-shadow-lg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{
                  rotate: isHovered ? 180 : 0,
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414-1.414M17.95 17.95l-1.414-1.414M6.05 6.05L4.636 7.464M12 8a4 4 0 100 8 4 4 0 000-8z"
                />
              </motion.svg>
            ) : (
              // Moon icon with enhanced glow
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white filter drop-shadow-lg"
                fill="currentColor"
                viewBox="0 0 24 24"
                animate={{
                  rotate: isHovered ? -180 : 0,
                  scale: isHovered ? 1.2 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
              </motion.svg>
            )}
          </motion.div>
        )}

        {/* Tooltip - Moved to the right side */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? 0 : -10,
          }}
          className="absolute left-full ml-3 px-2 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap"
        >
          Switch to {theme === "light" ? "dark" : "light"} mode
        </motion.div>
      </motion.button>

      {/* Ambient Light Effect */}
      <motion.div
        animate={{
          opacity: isHovered ? 0.1 : 0,
          scale: isHovered ? 2 : 1,
        }}
        className="absolute inset-0 rounded-full bg-yellow-400 dark:bg-gray-400 blur-xl -z-10"
      />
    </div>
  );
}
