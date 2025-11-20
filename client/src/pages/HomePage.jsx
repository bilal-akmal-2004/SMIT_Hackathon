// Home.jsx (with enhanced hover effects and animations)
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Gemini from "../components/Gemini.jsx";
import GeminiPdf from "../components/GeminiPdf.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  // ✅ Ref for the mobile menu
  const menuRef = useRef(null);

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // ✅ Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setUser(res.data.user);
      } catch (err) {
        console.error("User not authenticated", err);
        navigate("/");
      }
    };
    fetchUser();
  }, []);

  const logoutUser = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("User logged out successfully.");
      navigate("/");
    } catch (err) {
      console.error("Error logging out", err);
      toast.error("Logout failed");
    }
  };

  const navButtons = [
    {
      path: "/shared-with-me",
      label: "Shared",
      icon: "🔄",
      description: "View shared reports",
    },
    {
      path: "/search-members",
      label: "Share Data",
      icon: "🤝",
      description: "Share with others",
    },
    {
      path: "/pdfs",
      label: "My Reports",
      icon: "📋",
      description: "Medical reports",
    },
    {
      path: "/dashboard",
      label: "Timeline",
      icon: "📈",
      description: "Health timeline",
    },
    {
      path: "/add-vitals",
      label: "Add Vital",
      icon: "➕",
      description: "Add health reading",
      primary: true,
    },
  ];

  const tabs = [
    {
      id: "chat",
      label: "AI Chat",
      icon: "🤖",
      description: "Chat with Health AI",
    },
    {
      id: "pdf",
      label: "PDF Analysis",
      icon: "🔍",
      description: "Analyze medical reports",
    },
  ];

  return (
    <div
      className={`flex flex-col h-screen w-full transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-800"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
      }`}
    >
      {/* Enhanced Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`shrink-0 backdrop-blur-md px-4 sm:px-6 py-3 flex justify-between items-center border-b transition-all duration-300 sticky top-0 z-40 ${
          theme === "light"
            ? isScrolled
              ? "bg-white/95 border-green-200 shadow-lg"
              : "bg-white/80 border-green-200 shadow-sm"
            : isScrolled
            ? "bg-gray-900/95 border-gray-700 shadow-lg"
            : "bg-gray-900/80 border-gray-700 shadow-sm"
        }`}
      >
        {/* Logo with hover effect */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg shadow-lg"
          >
            ❤️
          </motion.div>
          <div className="hidden sm:block">
            <motion.h1
              whileHover={{ scale: 1.02 }}
              className="text-lg font-bold text-green-700 dark:text-green-400"
            >
              HealthMate
            </motion.h1>
            <p className="text-xs opacity-80 mt-0.5">Sehat ka Smart Dost</p>
          </div>
        </motion.div>

        {user && (
          <div className="flex items-center gap-3">
            {/* Desktop: Enhanced buttons with tooltips */}
            <div className="hidden lg:flex items-center gap-2">
              {navButtons.map((button, index) => (
                <motion.div
                  key={button.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(button.path)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      button.primary
                        ? theme === "light"
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700"
                          : "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg hover:shadow-xl hover:from-green-500 hover:to-emerald-600"
                        : theme === "light"
                        ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 hover:shadow-md"
                        : "bg-gray-800 border border-gray-700 text-green-300 hover:bg-gray-700 hover:border-gray-600 hover:shadow-md"
                    }`}
                  >
                    <span className="text-base">{button.icon}</span>
                    <span>{button.label}</span>
                  </motion.button>

                  {/* Tooltip - Fixed position to show below button */}
                  <div
                    className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 ${
                      theme === "light"
                        ? "bg-gray-800 text-white shadow-lg"
                        : "bg-gray-200 text-gray-800 shadow-lg"
                    }`}
                  >
                    {button.description}
                    <div
                      className={`absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 ${
                        theme === "light"
                          ? "border-b-gray-800"
                          : "border-b-gray-200"
                      }`}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Mobile Menu - Now shows on lg screens and below */}
            <div className="lg:hidden relative" ref={menuRef}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-3 rounded-xl transition-all duration-300 text-lg ${
                  theme === "light"
                    ? "bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800 shadow-md"
                    : "bg-gray-800 text-green-300 hover:bg-gray-700 hover:text-green-400 shadow-md"
                }`}
                aria-label="Menu"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-bold"
                >
                  ☰
                </motion.div>
              </motion.button>

              {/* Enhanced Mobile Dropdown Menu */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl py-3 z-50 ${
                      theme === "light"
                        ? "bg-white border border-green-200"
                        : "bg-gray-800 border border-gray-700"
                    }`}
                  >
                    {navButtons.map((button, index) => (
                      <motion.button
                        key={button.path}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          navigate(button.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center gap-3 ${
                          theme === "light"
                            ? "hover:bg-green-50 hover:text-green-700"
                            : "hover:bg-gray-700 hover:text-green-400"
                        } ${
                          button.primary
                            ? theme === "light"
                              ? "bg-green-50 border-l-4 border-green-500"
                              : "bg-gray-700 border-l-4 border-green-500"
                            : ""
                        }`}
                      >
                        <span className="text-base">{button.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{button.label}</div>
                          <div
                            className={`text-xs ${
                              theme === "light"
                                ? "text-green-600"
                                : "text-green-400"
                            }`}
                          >
                            {button.description}
                          </div>
                        </div>
                      </motion.button>
                    ))}

                    <hr
                      className={`my-2 ${
                        theme === "light"
                          ? "border-green-200"
                          : "border-gray-700"
                      }`}
                    />

                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                      Signed in as{" "}
                      <span className="font-medium">{user.name}</span>
                    </div>

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        logoutUser();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 transition-all duration-300 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Desktop User Info - Now shows on lg screens and above */}
            <div className="hidden lg:flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-end cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                <span className="font-medium text-sm text-green-700 dark:text-green-300">
                  {user.name}
                </span>
                <span className="text-xs opacity-70">👤 Member</span>
              </motion.div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  y: -1,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={logoutUser}
                aria-label="Logout"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg ${
                  theme === "light"
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-xl"
                    : "bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 hover:shadow-xl"
                }`}
              >
                <span>🚪</span>
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.nav>

      {/* Enhanced Tab Switcher */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="shrink-0 flex justify-center mt-4 px-4 mb-4"
      >
        <div
          className={`flex gap-2 p-2 rounded-2xl shadow-lg border transition-all duration-300 ${
            theme === "light"
              ? "bg-green-50 border-green-200"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center gap-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 min-w-[140px] group ${
                activeTab === tab.id
                  ? theme === "light"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                    : "bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-lg"
                  : theme === "light"
                  ? "text-green-700 hover:bg-green-100 hover:text-green-800 hover:shadow-md"
                  : "text-green-300 hover:bg-gray-700 hover:text-green-400 hover:shadow-md"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              <motion.span
                animate={{ scale: activeTab === tab.id ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
                className="text-base"
              >
                {tab.icon}
              </motion.span>
              <span className="font-semibold">{tab.label}</span>

              {/* Active tab indicator */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-xl border-2 ${
                    theme === "light" ? "border-white" : "border-gray-200"
                  }`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex-grow overflow-hidden px-3 sm:px-6 pb-4"
      >
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-full rounded-2xl overflow-hidden shadow-xl"
        >
          {activeTab === "chat" ? <Gemini /> : <GeminiPdf />}
        </motion.div>
      </motion.main>

      {/* Enhanced Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`shrink-0 text-center py-3 text-xs border-t transition-all duration-300 ${
          theme === "light"
            ? "bg-white/80 border-green-200 text-green-700"
            : "bg-gray-900/80 border-gray-700 text-green-300"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <span>❤️</span>
            <span>
              © {new Date().getFullYear()} HealthMate — Sehat ka Smart Dost
            </span>
          </motion.span>
          <span className="hidden sm:inline opacity-50">•</span>
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="text-xs opacity-80"
          >
            AI is for understanding only, not for medical advice
          </motion.span>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
