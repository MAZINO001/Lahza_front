import { useId } from "react";
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import { Button } from "@headlessui/react";
import InputError from "./InputError";

export default function SelectField({
  label,
  items = [],
  valueKey = "id",
  labelKey = "name",
  value,
  error,
  onChange,
  required = false,
  placeholder = "Select an option",
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <Label htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}

      <SelectNative
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      >
        <option value="">{placeholder}</option>

        {items.map((item) => (
          <option key={item[valueKey]} value={item[valueKey]}>
            {item[labelKey]}
          </option>
        ))}
      </SelectNative>
      {error && <InputError message={error} className="text-destructive" />}
    </div>
  );
}
