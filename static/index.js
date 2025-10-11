import React from "react";
import ReactDOM from "react-dom/client";
// Support switching between old and new architecture via environment variable
// Use: USE_REFACTORED_APP=true npm run build
// @ts-ignore - webpack will replace this with actual module
import App from "../src/app-loader";
import { ErrorBoundary } from "../src/components/error-boundary";
import "./index.css";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);