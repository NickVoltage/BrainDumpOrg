import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/index.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NavigationProvider } from "./contexts/NavigationContext";
import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { initializeErrorHandlers } from "./shared/utils/error-handler";

// Initialize global error handlers
initializeErrorHandlers();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <NavigationProvider>
          <App />
        </NavigationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
