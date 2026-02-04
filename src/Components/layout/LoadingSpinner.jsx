// LahzaLoader.jsx
import React from "react";

const LahzaLoader = () => {
  return (
    <div className="flex justify-center my-4 w-full">
      <div className="flex items-center gap-1">
        <svg height="0" width="0" viewBox="0 0 64 64" className="absolute">
          <defs>
            <linearGradient
              id="b"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="62"
              x2="0"
              y2="2"
            >
              <stop stopColor="#973BED" />
              <stop stopColor="#007CFF" offset="1" />
            </linearGradient>

            <linearGradient
              id="c"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="64"
              x2="0"
              y2="0"
            >
              <stop stopColor="#FFC800" />
              <stop stopColor="#F0F" offset="1" />
              <animateTransform
                attributeName="gradientTransform"
                type="rotate"
                values="0 32 32; -270 32 32; -270 32 32; -540 32 32; -540 32 32; -810 32 32; -810 32 32; -1080 32 32; -1080 32 32"
                keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
                dur="8s"
                repeatCount="indefinite"
              />
            </linearGradient>

            <linearGradient
              id="d"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="62"
              x2="0"
              y2="2"
            >
              <stop stopColor="#00E0ED" />
              <stop stopColor="#00DA72" offset="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* L */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#b)"
            d="M 12 8 v 48 h 32"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* A (first) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#d)"
            d="M 8 56 l 24 -48 l 24 48 m -40 -16 h 32"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* H */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#b)"
            d="M 10 8 v 48 M 54 8 v 48 M 10 32 h 44"
            className="dash"
            pathLength="360"
          />
        </svg>

        {/* Z - spinning middle */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="10"
            stroke="url(#c)"
            d="M 12 12 h 40 l -40 40 h 40"
            className="spin"
            pathLength="360"
          />
        </svg>

        {/* A (second) */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 64 64"
          height="64"
          width="64"
          className="inline-block"
        >
          <path
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="8"
            stroke="url(#d)"
            d="M 8 56 l 24 -48 l 24 48 m -40 -16 h 32"
            className="dash"
            pathLength="360"
          />
        </svg>
      </div>
    </div>
  );
};

export default LahzaLoader;
