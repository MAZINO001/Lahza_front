// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "@/App/App.jsx";
// import "./lib/i18n.js";
// import "@/styles/index.css";
// import { queryClient } from "./lib/queryClient.js";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { AuthProvider } from "./hooks/AuthContext.jsx";
// import { ThemeProvider } from "next-themes";
// import ErrorBoundary from "./components/ErrorBoundary.jsx";

// document.addEventListener("contextmenu", (e) => {
//   e.preventDefault();
//   return false;
// });

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ErrorBoundary>
//       {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
//       <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//         <AuthProvider>
//           <QueryClientProvider client={queryClient}>
//             <App />
//           </QueryClientProvider>
//         </AuthProvider>
//       </ThemeProvider>
//     </ErrorBoundary>
//   </React.StrictMode>
// );

import React from "react";
import { createRoot } from "react-dom/client";
import App from "@/App/App.jsx";
import "./lib/i18n.js";
import "@/styles/index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/AuthContext.jsx";
import { ThemeProvider } from "next-themes";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  return false;
});

const qc = new QueryClient();
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <QueryClientProvider client={qc}>
            <App />
          </QueryClientProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
