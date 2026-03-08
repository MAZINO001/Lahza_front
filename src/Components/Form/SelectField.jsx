
"use client";

import { cn } from "@/lib/utils"; // ← make sure you have this!
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputError from "../InputError"; // your custom error component

export default function SelectField({
  id,
  label,
  value = "",
  onChange,
  options = [],
  placeholder = "",
  error,
  disabled = false,
  className,
}) {
  return (
    // <div className={cn(className)}>
    <div
      className={cn("flex items-start justify-between flex-col ", className)}
    >
      <Label htmlFor={id} className="text-sm font-medium text-foreground ">
        {label}
      </Label>

      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={id}
          aria-invalid={!!error}
          className={cn(
            "h-10 w-full bg-background ",
            error && "border-destructive  focus-visible:ring-destructive",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        >
          <SelectValue
            placeholder={
              <span className="text-muted-foreground">{placeholder}</span>
            }
          />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && <InputError message={error} className="text-sm" />}
    </div>
  );
}
