import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import AuthForm from "./pages/AuthForm";
import { useTheme } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "../src/pages/PageNotFound";
import HomePage from "./pages/HomePage";
import Dashboard from "../src/pages/DashBoard.jsx";
import AddVitals from "../src/pages/AddVitals.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ProtectedRoute from "./components/ProtectedRoute";
export default function App() {
  const { theme } = useTheme();

  const GoogleWrapper = () => (
    <GoogleOAuthProvider clientId="1079183921375-uqqvv5cbsjot1ibuj2huiut53ntacjr0.apps.googleusercontent.com">
      <AuthForm></AuthForm>
    </GoogleOAuthProvider>
  );

  return (
    <div
      className={`flex justify-center items-center h-screen  transition-all duration-700 ${
        theme === "light" ? "bg-white text-black " : "bg-black text-white"
      }`}
    >
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<GoogleWrapper />} />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-vitals"
            element={
              <ProtectedRoute>
                <AddVitals />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <ThemeToggle />
      <ToastContainer />
    </div>
  );
}
