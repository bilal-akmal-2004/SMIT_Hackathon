// Importing core React and state management
import React, { useState } from "react";

// Toast notifications container
import { ToastContainer } from "react-toastify";

// Pages
import AuthForm from "./pages/AuthForm";
import LandingPage from "./pages/LandingPage";
import PageNotFound from "../src/pages/PageNotFound";
import HomePage from "./pages/HomePage";
import Dashboard from "../src/pages/DashBoard.jsx";
import AddVitals from "../src/pages/AddVitals.jsx";
import SharedWithMe from "./pages/SharedWithMe";
import SearchMembers from "./pages/SearchMembers";
import SharedDashboard from "./pages/SharedDashboard";
import PdfList from "./pages/PdfList";
import PdfViewer from "./pages/PdfViewer";

// Theme context + toggle component
import { useTheme } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";

// Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Google OAuth provider
import { GoogleOAuthProvider } from "@react-oauth/google";

// Authentication-protected routing
import ProtectedRoute from "./components/ProtectedRoute";

// Main application component
export default function App() {
  // Accessing current theme ("light" or "dark")
  const { theme } = useTheme();

  // Wrapper to provide Google OAuth specifically for the AuthForm component
  const GoogleWrapper = () => (
    <GoogleOAuthProvider clientId="1079183921375-uqqvv5cbsjot1ibuj2huiut53ntacjr0.apps.googleusercontent.com">
      <AuthForm />
    </GoogleOAuthProvider>
  );

  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        theme === "light" ? "bg-white text-black" : "bg-black text-white"
      }`}
    >
      {/* App Routing Structure */}
      <Router>
        <Routes>
          {/* -------- PUBLIC ROUTES -------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<GoogleWrapper />} />

          {/* -------- PROTECTED ROUTES (Require Login) -------- */}
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

          {/* PDF List and Viewer */}
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

          {/* Shared Data Routes */}
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

          {/* -------- CATCH-ALL: Page Not Found -------- */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>

      {/* Theme toggle button (floating) */}
      <ThemeToggle />

      {/* Toast notifications container */}
      <ToastContainer />
    </div>
  );
}
