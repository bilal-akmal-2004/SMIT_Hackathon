import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import AuthForm from "./pages/AuthForm";
import LandingPage from "./pages/LandingPage";
import { useTheme } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageNotFound from "../src/pages/PageNotFound";
import HomePage from "./pages/HomePage";
import Dashboard from "../src/pages/DashBoard.jsx";
import AddVitals from "../src/pages/AddVitals.jsx";
import SharedWithMe from "./pages/SharedWithMe";
import SearchMembers from "./pages/SearchMembers";
import SharedDashboard from "./pages/SharedDashboard";
import PdfList from "./pages/PdfList";
import PdfViewer from "./pages/PdfViewer";
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
      className={` min-h-screen transition-all duration-700 ${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<GoogleWrapper />} />

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

          <Route
            path="/pdfs"
            element={
              <ProtectedRoute>
                <PdfList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pdf/:id"
            element={
              <ProtectedRoute>
                <PdfViewer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shared-with-me"
            element={
              <ProtectedRoute>
                <SharedWithMe />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search-members"
            element={
              <ProtectedRoute>
                <SearchMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shared/:ownerId"
            element={
              <ProtectedRoute>
                <SharedDashboard />
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
