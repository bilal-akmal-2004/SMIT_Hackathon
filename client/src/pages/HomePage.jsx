// Home.jsx
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
      className={`w-full min-h-screen flex flex-col transition-colors duration-500 ${
        theme === "light"
          ? "bg-gradient-to-br from-sky-50 via-white to-indigo-100 text-black"
          : "bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white"
      }`}
    >
      {/* 🌐 Navbar */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-lg shadow-lg px-6 py-4 flex justify-between items-center border-b transition-all ${
          theme === "light"
            ? "bg-white/70 border-gray-200"
            : "bg-gray-900/70 border-gray-700"
        }`}
      >
        <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">
          🩺 HealthMate AI
        </h1>

        {user && (
          <div className="flex items-center gap-4">
            <p
              className={`hidden sm:block font-medium truncate max-w-[200px] ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              👋 {user.name}
            </p>
            <button
              onClick={logoutUser}
              className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* 🧭 Tabs */}
      <div className="flex justify-center mt-35 mb-4">
        <div
          className={`flex gap-3 p-1 rounded-full ${
            theme === "light"
              ? "bg-indigo-100 border border-indigo-200"
              : "bg-gray-800 border border-gray-700"
          }`}
        >
          {["chat", "pdf"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-semibold capitalize transition-all ${
                activeTab === tab
                  ? "bg-indigo-600 text-white shadow-lg"
                  : theme === "light"
                  ? "text-indigo-600 hover:bg-indigo-50"
                  : "text-indigo-400 hover:bg-gray-700"
              }`}
            >
              {tab === "chat" ? "💬 Chat Assistant" : "📄 PDF Analyzer"}
            </button>
          ))}
        </div>
      </div>

      {/* 🌟 Main Container */}
      <main className="w-full flex-grow flex justify-center items-center px-4 sm:px-8 py-8">
        <div
          className={`relative w-full h-[85vh] rounded-3xl shadow-2xl overflow-hidden border transition-all duration-300 ${
            theme === "light"
              ? "bg-white/90 border-gray-200"
              : "bg-gray-900/90 border-gray-800"
          }`}
        >
          {/* Glow effect background */}
          <div
            className={`absolute inset-0 blur-3xl opacity-30 ${
              theme === "light"
                ? "bg-gradient-to-tr from-indigo-300 via-sky-200 to-purple-200"
                : "bg-gradient-to-tr from-indigo-700 via-purple-800 to-blue-900"
            }`}
          ></div>

          {/* Content */}
          <div className="relative flex flex-col h-full">
            {/* Header */}
            <div
              className={`px-6 py-4 border-b flex justify-between items-center ${
                theme === "light"
                  ? "bg-gray-50/70 border-gray-200"
                  : "bg-gray-800/60 border-gray-700"
              }`}
            >
              <h2
                className={`text-lg sm:text-2xl font-semibold ${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                }`}
              >
                {activeTab === "chat"
                  ? "🧠 AI Health Consultant"
                  : "📚 Medical Report Summarizer"}
              </h2>
              <span
                className={`text-sm ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {activeTab === "chat"
                  ? "Ask your medical questions"
                  : "Upload & summarize your medical PDFs"}
              </span>
            </div>

            {/* Content */}
            <div
              className={`flex-grow  p-4 sm:p-8 ${
                theme === "light" ? "bg-white" : "bg-gray-900"
              }`}
            >
              {activeTab === "chat" ? <Gemini /> : <GeminiPdf />}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-sm opacity-70">
        © {new Date().getFullYear()} HealthMate AI — Empowering Smarter Care 💙
      </footer>
    </div>
  );
};

export default HomePage;
