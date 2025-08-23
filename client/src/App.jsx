import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import AuthForm from "./pages/AuthForm";
import { useTheme } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "../src/pages/PageNotFound";
import HomePage from "./pages/HomePage";

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
          <Route path="/" element={<GoogleWrapper />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      <ThemeToggle />
      <ToastContainer />
    </div>
  );
}
