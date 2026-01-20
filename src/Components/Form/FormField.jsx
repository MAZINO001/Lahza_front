import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../InputError";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <Label htmlFor={id} className="text-foreground">
        {label}
        {id === "portfolio" && (
          <p className="text-xs opacity-50">(Instagram, Behance, Portfolio…)</p>
        )}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 block w-full border bg-background ${error ? "border-destructive" : "border-border"} text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-colors ${isPassword ? "pr-10" : ""} ${className}`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
