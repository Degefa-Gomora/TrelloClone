// src/main.jsx (UPDATED)
import React from "react";
import ReactDOM from "react-dom/client";
import AppWrapper from "./App.jsx"; // Import the new AppWrapper
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper /> {/* Render AppWrapper */}
  </React.StrictMode>
);
