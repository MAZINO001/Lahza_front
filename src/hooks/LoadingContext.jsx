/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";
import TheLoader from "@/pages/extras/Loader";

const LoadingContext = createContext(undefined);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Loading...");
  const [loaderType, setLoaderType] = useState("fullscreen"); // 'fullscreen' | 'content'
  const [loaderPosition, setLoaderPosition] = useState("center"); // 'center' | 'top' | 'bottom'

  const show = (msg = "Loading...", options = {}) => {
    setText(msg);
    setLoaderType(options.type || "fullscreen");
    setLoaderPosition(options.position || "center");
    setLoading(true);
  };

  const hide = () => setLoading(false);

  const getLoaderPosition = () => {
    switch (loaderPosition) {
      case "top":
        return "items-start pt-8";
      case "bottom":
        return "items-end pb-8";
      default:
        return "items-center";
    }
  };

  return (
    <LoadingContext.Provider value={{ loading, show, hide, text }}>
      <div className="relative h-full w-full">
        {children}

        {loading && (
          <div
            className={`fixed inset-0 z-50 flex ${getLoaderPosition()} justify-center ${
              loaderType === "fullscreen"
                ? "bg-white/80 backdrop-blur-sm"
                : "pointer-events-none"
            }`}
          >
            <div
              className={`${loaderType === "content" ? "absolute inset-0" : ""} flex items-center justify-center`}
            >
              <div className="rounded-xl bg-white p-6 shadow-xl border border-border">
                <TheLoader size="lg" variant="orbit" text={text} />
              </div>
            </div>
          </div>
        )}
      </div>
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be inside LoadingProvider");
  return {
    ...ctx,
    show: (msg, options) => ctx.show(msg, options),
    hide: ctx.hide,
  };
};
