//// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";          // ← this must match the default export
import "./index.css";

ReactDOM
  .createRoot(document.getElementById("root"))
  .render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
