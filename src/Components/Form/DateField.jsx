// components/DateField.tsx
"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import InputError from "../InputError";

export default function DateField({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = "Pick a date",
  className = "",
  disabled = false,
  fromYear = 2000,
  toYear = new Date().getFullYear() + 10,
}) {
  const [open, setOpen] = React.useState(false);

  // Convert string to Date for display
  const displayDate = value ? new Date(value) : null;

  // Handle date selection - convert to string format
  const handleDateChange = (date) => {
    if (date) {
      const dateString = format(date, "yyyy-MM-dd");
      onChange(dateString);
      setOpen(false); // Close popover after selection
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className="text-foreground">
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal border bg-background",
              !displayDate && "text-muted-foreground",
              error && "border-destructive",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayDate ? (
              format(displayDate, "PPP")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-4" align="start">
          <Calendar
            mode="single"
            selected={displayDate}
            onSelect={handleDateChange}
            disabled={
              disabled
                ? () => true
                : (date) =>
                    date < new Date(fromYear, 0, 1) ||
                    date > new Date(toYear, 11, 31)
            }
            initialFocus
            captionLayout="dropdown-buttons"
            fromYear={fromYear}
            toYear={toYear}
          />
        </PopoverContent>
      </Popover>

      {error && (
        <InputError message={error} className="mt-2 text-destructive" />
      )}
    </div>
  );
}
