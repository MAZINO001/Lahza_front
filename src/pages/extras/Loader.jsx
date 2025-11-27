// import { Loader2 } from "lucide-react";

// export default function Loader({ size = "md", text }) {
//   const sizeClasses = {
//     sm: "w-6 h-6",
//     md: "w-12 h-12",
//     lg: "w-20 h-20",
//   };

//   return (
//     <div className="flex flex-col items-center justify-center space-y-4">
//       <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
//       {text && <p className="text-gray-600 text-sm">{text}</p>}
//     </div>
//   );
// }

import { Loader2, Orbit, Loader } from "lucide-react";
const loaderVariants = {
  spinner: Loader2,
  orbit: Orbit,
  dots: Loader,
};

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const textSizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export default function TheLoader({
  size = "md",
  text = "Loading...",
  variant = "spinner",
  speed = "normal",
}) {
  const Icon = loaderVariants[variant] || Loader2;

  const spinSpeed =
    speed === "slow"
      ? "animate-spin-slow"
      : speed === "fast"
        ? "animate-spin-fast"
        : "animate-spin";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <Icon
            className={`${sizeMap[size]} ${spinSpeed} text-blue-600`}
            strokeWidth={2.5}
          />

          {(size === "lg" || size === "xl") && (
            <div className="absolute inset-0 -m-6 animate-ping">
              <div className="h-full w-full rounded-full border-4 border-blue-600/20" />
            </div>
          )}
        </div>

        {text && (
          <p
            className={`${textSizeMap[size]} font-medium text-gray-700 animate-pulse`}
          >
            {text}
          </p>
        )}

        {!text && variant === "dots" && (
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
