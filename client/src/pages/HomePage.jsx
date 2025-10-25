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
          ? "bg-gradient-to-br from-sky-50 via-white to-indigo-50 text-slate-900"
          : "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100"
      }`}
    >
      {/* Navbar */}
      <nav
        className={`shrink-0 backdrop-blur-md px-4 sm:px-6 py-3 flex justify-between items-center border-b transition-all shadow-sm ${
          theme === "light"
            ? "bg-white/70 border-gray-200"
            : "bg-gray-900/70 border-gray-700"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-lg shadow-md">
            🩺
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold">HealthMate AI</h1>
            <p className="text-xs opacity-80 mt-0.5">Your health companion</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            {/* Desktop: Show buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate("/dashboard")}
                className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                  theme === "light"
                    ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
                    : "bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700"
                }`}
              >
                📊 Timeline
              </button>
              <button
                onClick={() => navigate("/add-vitals")}
                className={`px-3 py-1.5 rounded text-sm font-medium text-white transition ${
                  theme === "light"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-indigo-500 hover:bg-indigo-600"
                }`}
              >
                ➕ Add Vital
              </button>
            </div>

            {/* Mobile: Hamburger Menu */}
            <div className="md:hidden relative" ref={menuRef}>
              {" "}
              {/* ✅ attach ref here */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md ${
                  theme === "light"
                    ? "text-gray-700 hover:bg-gray-200"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                aria-label="Menu"
              >
                ☰
              </button>
              {/* Mobile Dropdown Menu */}
              {mobileMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50 ${
                    theme === "light"
                      ? "bg-white border border-gray-200"
                      : "bg-gray-800 border border-gray-700"
                  }`}
                >
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    📊 Health Timeline
                  </button>
                  <button
                    onClick={() => {
                      navigate("/add-vitals");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    ➕ Add Manual Vital
                  </button>
                  <hr
                    className={`my-1 ${
                      theme === "light" ? "border-gray-200" : "border-gray-700"
                    }`}
                  />
                  <button
                    onClick={() => {
                      logoutUser();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    🔐 Logout
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
                className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded font-medium text-sm hover:bg-indigo-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Tab Switcher */}
      <div className="shrink-0 flex justify-center mt-3 px-4 mb-3">
        <div
          className={`flex gap-1 sm:gap-2 p-1 rounded-full shadow-sm border transition ${
            theme === "light"
              ? "bg-indigo-50 border-indigo-100"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {[
            { id: "chat", label: "Chat", icon: "💬" },
            { id: "pdf", label: "PDF", icon: "📄" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[80px] sm:min-w-[100px] ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : theme === "light"
                  ? "text-indigo-700 hover:bg-indigo-100"
                  : "text-indigo-300 hover:bg-gray-700"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow overflow-hidden px-4 sm:px-6">
        {activeTab === "chat" ? <Gemini /> : <GeminiPdf />}
      </main>

      <footer className="shrink-0 text-center py-3 text-xs sm:text-sm opacity-80 border-t">
        © {new Date().getFullYear()} HealthMate AI — Empowering Smarter Care
      </footer>
    </div>
  );
};

export default HomePage;
