// Home.jsx (with auto-close mobile menu)
import { useEffect, useState, useRef } from "react"; // ✅ added useRef
import { useNavigate } from "react-router-dom";
import Gemini from "../components/Gemini.jsx";
import GeminiPdf from "../components/GeminiPdf.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  return (
    <div
      className={`flex flex-col h-screen w-full transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-800"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
      }`}
    >
      {/* Navbar - Made more compact */}
      <nav
        className={`shrink-0 backdrop-blur-md px-4 sm:px-6 py-2 flex justify-between items-center border-b transition-all shadow-sm ${
          theme === "light"
            ? "bg-white/80 border-green-200"
            : "bg-gray-900/80 border-gray-700"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-lg shadow-md">
            ❤️
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-green-700 dark:text-green-400">
              HealthMate
            </h1>
            <p className="text-xs opacity-80 mt-0.5">Sehat ka Smart Dost</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {/* Desktop: Show buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/shared-with-me")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-800 border border-gray-700 text-green-300 hover:bg-gray-700"
                }`}
              >
                🔄 Shared
              </button>
              <button
                onClick={() => navigate("/search-members")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-800 border border-gray-700 text-green-300 hover:bg-gray-700"
                }`}
              >
                🤝 Share Data
              </button>
              <button
                onClick={() => navigate("/pdfs")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-800 border border-gray-700 text-green-300 hover:bg-gray-700"
                }`}
              >
                📋 My Reports
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                    : "bg-gray-800 border border-gray-700 text-green-300 hover:bg-gray-700"
                }`}
              >
                📈 Timeline
              </button>
              <button
                onClick={() => navigate("/add-vitals")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white transition ${
                  theme === "light"
                    ? "bg-green-600 hover:bg-green-700 shadow-md"
                    : "bg-green-600 hover:bg-green-500 shadow-md"
                }`}
              >
                ➕ Add Vital
              </button>
            </div>

            {/* Mobile: Hamburger Menu */}
            <div className="md:hidden relative" ref={menuRef}>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-green-100"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                aria-label="Menu"
              >
                ≡
              </button>
              {/* Mobile Dropdown Menu */}
              {mobileMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50 ${
                    theme === "light"
                      ? "bg-white border border-green-200"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <button
                    onClick={() => {
                      navigate("/shared-with-me");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    🔄 Shared Reports
                  </button>
                  <button
                    onClick={() => {
                      navigate("/search-members");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    🤝 Share Health Data
                  </button>
                  <button
                    onClick={() => {
                      navigate("/pdfs");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    📋 My Reports
                  </button>
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    📈 Health Timeline
                  </button>
                  <button
                    onClick={() => {
                      navigate("/add-vitals");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    ➕ Add Manual Vital
                  </button>
                  <hr
                    className={`my-1 ${
                      theme === "light" ? "border-green-200" : "border-gray-700"
                    }`}
                  />
                  <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    Signed in as {user.name}
                  </div>
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>

            {/* Desktop: User + Logout */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="font-medium text-sm">{user.name}</span>
                <span className="text-xs opacity-70">Member</span>
              </div>
              <button
                onClick={logoutUser}
                aria-label="Logout"
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition ${
                  theme === "light"
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                    : "bg-green-600 text-white hover:bg-green-500 shadow-md"
                }`}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Tab Switcher - Made more compact */}
      <div className="shrink-0 flex justify-center mt-2 px-4 mb-2">
        <div
          className={`flex gap-1 p-1 rounded-xl shadow-sm border transition ${
            theme === "light"
              ? "bg-green-50 border-green-100"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {[
            { id: "chat", label: "AI Chat", icon: "🤖" },
            { id: "pdf", label: "PDF Analysis", icon: "🔍" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none min-w-[120px] ${
                activeTab === tab.id
                  ? theme === "light"
                    ? "bg-green-500 text-white shadow-md"
                    : "bg-green-600 text-white shadow-md"
                  : theme === "light"
                  ? "text-green-700 hover:bg-green-100"
                  : "text-green-300 hover:bg-gray-700"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Takes maximum space now */}
      <main className="flex-grow overflow-hidden px-2 sm:px-4 pb-2">
        <div className="h-full rounded-2xl overflow-hidden">
          {activeTab === "chat" ? <Gemini /> : <GeminiPdf />}
        </div>
      </main>

      {/* Footer - Made more compact */}
      <footer
        className={`shrink-0 text-center py-2 text-xs opacity-70 border-t ${
          theme === "light" ? "border-green-200" : "border-gray-700"
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-center items-center gap-1 sm:gap-4">
          <span>
            © {new Date().getFullYear()} HealthMate — Sehat ka Smart Dost
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-xs">
            AI is for understanding only, not for medical advice
          </span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
