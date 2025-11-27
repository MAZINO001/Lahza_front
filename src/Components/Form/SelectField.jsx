import { Label } from "../../Components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../Components/ui/select";
import InputError from "../../Components/InputError";

export default function SelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder,
  error,
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className="mt-1 block w-full h-10 px-3  border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-primary relative items-center transition-colors"
        >
          <SelectValue
            placeholder={placeholder || "-- Sélectionnez une option --"}
          />
        </SelectTrigger>

        <SelectContent className="z-50 max-h-60 overflow-auto rounded-md shadow-md border border-border bg-popover text-popover-foreground">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer py-2 px-3 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
