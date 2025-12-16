import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/App/App.jsx";
import "./lib/i18n.js";
import "@/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/AuthContext.jsx";
import { ThemeProvider } from "next-themes";

const qc = new QueryClient();
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
      <AuthProvider>
        <QueryClientProvider client={qc}>
          <App />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
