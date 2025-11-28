//main entry point of the React application
// It sets up the root component and wraps it with a ThemeProvider for theming context
// Also includes global styles from index.css
// Uses React's StrictMode for highlighting potential problems in the application
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
