// Home.jsx (UPDATED)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Gemini from "../components/Gemini.jsx";
import GeminiPdf from "../components/GeminiPdf.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const navigate = useNavigate();
  const { theme } = useTheme();

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
      {/* Navbar - fixed height */}
      <nav
        className={`shrink-0 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b transition-all shadow-sm ${
          theme === "light"
            ? "bg-white/70 border-gray-200"
            : "bg-gray-900/70 border-gray-700"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white text-xl shadow-md">
            🩺
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
              HealthMate AI
            </h1>
            <p className="text-xs opacity-80 mt-0.5">
              Smarter conversations about your health
            </p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs opacity-70">Member</span>
            </div>
            <button
              onClick={logoutUser}
              aria-label="Logout"
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 active:scale-95 transition-shadow shadow"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Tab Switcher - fixed height */}
      <div className="shrink-0 flex justify-center mt-4 px-4 mb-2">
        <div
          className={`flex gap-2 p-1 rounded-full shadow-sm border transition ${
            theme === "light"
              ? "bg-indigo-50 border-indigo-100"
              : "bg-gray-800 border-gray-700"
          }`}
        >
          {[
            { id: "chat", label: "Chat Assistant", icon: "💬" },
            { id: "pdf", label: "PDF Analyzer", icon: "📄" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm sm:text-base font-semibold capitalize transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md"
                  : theme === "light"
                  ? "text-indigo-700 hover:bg-indigo-50"
                  : "text-indigo-300 hover:bg-gray-700"
              }`}
              aria-pressed={activeTab === tab.id}
            >
              <span className="mr-2">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.icon}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ MAIN CONTENT: scrollable area is ONLY here */}
      <main className="flex-grow overflow-hidden px-4 sm:px-6">
        {activeTab === "chat" ? <Gemini /> : <GeminiPdf />}
      </main>

      {/* Footer - fixed height */}
      <footer className="shrink-0 text-center py-3 text-sm opacity-80 border-t">
        © {new Date().getFullYear()} HealthMate AI — Empowering Smarter Care
      </footer>
    </div>
  );
};

export default HomePage;
