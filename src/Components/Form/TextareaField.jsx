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
      <Label htmlFor={id} className="text-[var(--foreground)]">
        {label}
      </Label>
      <Textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 block w-full bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--ring)] transition-colors min-h-[100px]"
      />
      {error && (
        <InputError
          message={error}
          className="mt-2 text-[var(--destructive)]"
        />
      )}
    </div>
  );
}
