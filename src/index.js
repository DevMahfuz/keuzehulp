import "./setPublicPath";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const mount = document.getElementById("beamer-keuzehulp") || document.getElementById("root");

if (mount) {
  const root = ReactDOM.createRoot(mount);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
