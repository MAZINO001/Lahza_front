// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import InputError from "../InputError";
// import { Eye, EyeOff } from "lucide-react";
// import { useState } from "react";

// export default function FormField({
//   id,
//   label,
//   type = "text",
//   value,
//   onChange,
//   error,
//   placeholder,
//   className = "",
// }) {
//   const [showPassword, setShowPassword] = useState(false);
//   const isPassword = type === "password";

//   return (
//     <div>
//       <Label htmlFor={id} className="text-foreground">
//         {label}
//         {id === "portfolio" && (
//           <p className="text-xs opacity-50">
//             (Instagram, Bechance, Portfolio…)
//           </p>
//         )}
//       </Label>
//       <div className="relative">
//         <Input
//           id={id}
//           type={isPassword ? (showPassword ? "text" : "password") : type}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className={`mt-1 block w-full border bg-background ${error ? "border-destructive" : "border-border"} text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-colors ${isPassword ? "pr-10" : ""} ${className}`}
//         />
//         {isPassword && (
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
//           >
//             {showPassword ? (
//               <EyeOff className="w-4 h-4" />
//             ) : (
//               <Eye className="w-4 h-4" />
//             )}
//           </button>
//         )}
//       </div>
//       {error && (
//         <InputError message={error} className="mt-2 text-destructive" />
//       )}
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import InputError from "../InputError";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FormField({
  id,
  label,
  type = "text",
  value = "",
  onChange,
  error,
  placeholder,
  disabled = false,
  className,
  hint,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={cn("", className)}>
      <div className="flex flex-col gap-0.5">
        <Label
          htmlFor={id}
          className="mb-0.5 text-sm font-medium text-foreground"
        >
          {label}
        </Label>

        {/* Optional hint / subtext under label */}
        {(hint || id === "portfolio") && (
          <p className="text-xs text-muted-foreground">
            {hint || "(Instagram, Behance, Portfolio…)"}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            // Base styling (shadcn Input already has most of this)
            "bg-background",
            // Error state
            error && "border-destructive focus-visible:ring-destructive",
            // Focus ring – matches shadcn pattern
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            // Disabled
            disabled && "opacity-50 cursor-not-allowed",
            // Extra padding for password toggle
            isPassword && "pr-10",
            // Keep any custom className overrides
            className,
          )}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            disabled={disabled}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "text-muted-foreground hover:text-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {error && (
        <InputError
          message={error}
          className="text-sm text-destructive pt-0.5"
        />
      )}
    </div>
  );
}
