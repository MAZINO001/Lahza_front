import { Label } from "../ui/label";
import { Input } from "../ui/input";
import InputError from "../InputError";

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
  return (
    <div>
      <Label htmlFor={id} className="text-foreground">
        {label}
        {id === "portfolio" && (
          <p className="text-xs opacity-50">(Instagram, Behance, Portfolio…)</p>
        )}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full border ${error ? "border-destructive" : "border-border"} text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-colors ${className}`}
      />
      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
