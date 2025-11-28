import { Label } from "../../Components/ui/label";
import { Textarea } from "../../Components/ui/textarea";
import InputError from "../../Components/InputError";

export default function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full  ${error ? "border-destructive" : "border-border"} text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring transition-colors min-h-[100px]`}
      />
      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
