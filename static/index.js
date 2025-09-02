import React from "react";
import ReactDOM from "react-dom/client";
import App from "../src/app";
import { ErrorBoundary } from "../src/components/error-boundary";
import "./index.css";

ReactDOM.createRoot(document.querySelector("#root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);