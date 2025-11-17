// client/src/pages/PageNotFound.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

export default function PageNotFound() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-500 flex items-center justify-center px-4 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="text-center max-w-2xl mx-auto">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span
              className={`text-8xl sm:text-9xl font-bold block leading-none ${
                theme === "light" ? "text-green-600" : "text-green-400"
              }`}
            >
              404
            </span>
            <div
              className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full ${
                theme === "light" ? "bg-green-400" : "bg-green-500"
              }`}
            ></div>
          </div>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h1
            className={`text-2xl sm:text-3xl font-bold mb-4 ${
              theme === "light" ? "text-gray-800" : "text-gray-100"
            }`}
          >
            🚫 Page Not Found
          </h1>
          <p
            className={`text-lg sm:text-xl mb-2 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            Oops! The page you're looking for doesn't exist.
          </p>
          <p
            className={`text-sm sm:text-base ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* HealthMate Branding */}
        <div
          className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl mb-8 transition-all duration-300 hover:scale-105 ${
            theme === "light"
              ? "bg-green-100 border border-green-200 hover:bg-green-200"
              : "bg-gray-800 border border-gray-700 hover:bg-gray-700"
          }`}
        >
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">H</span>
          </div>
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
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
              theme === "light"
                ? "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                : "bg-green-600 text-white hover:bg-green-500 shadow-md hover:shadow-lg"
            }`}
          >
            <span>↩️</span>
            Go Back
          </button>

          <button
            onClick={() => navigate("/home")}
            className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
              theme === "light"
                ? "bg-white text-green-700 border border-green-300 hover:bg-green-50 hover:border-green-400 shadow-sm hover:shadow-md"
                : "bg-gray-800 text-green-400 border border-gray-600 hover:bg-gray-700 hover:border-green-500 shadow-sm hover:shadow-md"
            }`}
          >
            <span>🏠</span>
            Go Home
          </button>

          <button
            onClick={() => navigate("/auth")}
            className={`group px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 ${
              theme === "light"
                ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 hover:border-green-300 shadow-sm hover:shadow-md"
                : "bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700 hover:border-green-400 shadow-sm hover:shadow-md"
            }`}
          >
            <span>🔐</span>
            Sign In
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <p
            className={`text-sm mb-4 ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            Quick links you might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { path: "/home", label: "🏠 Dashboard", icon: "📊" },
              { path: "/dashboard", label: "📈 Timeline", icon: "🕒" },
              { path: "/pdfs", label: "📋 Reports", icon: "📄" },
              { path: "/add-vitals", label: "➕ Add Vital", icon: "❤️" },
            ].map((link, index) => (
              <button
                key={index}
                onClick={() => navigate(link.path)}
                className={`group px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 ${
                  theme === "light"
                    ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300"
                    : "bg-gray-800 text-green-300 border border-gray-700 hover:bg-gray-700 hover:border-green-400"
                }`}
              >
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mr-1">
                  {link.icon}
                </span>
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div
          className={`mt-8 pt-6 border-t ${
            theme === "light"
              ? "border-green-200 text-gray-500"
              : "border-gray-700 text-gray-400"
          }`}
        >
          <p className="text-xs">
            © {new Date().getFullYear()} HealthMate — Your health companion
          </p>
          <p className="text-xs mt-1">
            Need help? Contact support if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  );
}
