import { Label } from "../../Components/ui/label";
import { Input } from "../../Components/ui/input";
import ErrorMessage from "../../Components/Form/ErrorMessage";

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  errors,
  placeholder,
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
        className="mt-1 block w-full border border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-colors"
      />
      {errors && <ErrorMessage errors={errors} field={id} />}
    </div>
  );
}
