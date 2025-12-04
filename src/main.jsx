import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/App/App.jsx";
import "./lib/i18n.js";
import "@/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/AuthContext.jsx";

const qc = new QueryClient();
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={qc}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
);
