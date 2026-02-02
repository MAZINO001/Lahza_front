import { Clock } from "lucide-react";
import * as React from "react";
import { format, setHours, setMinutes } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import InputError from "../InputError";

export default function TimeField({
  id,
  label,
  value = "",
  onChange,
  error,
  placeholder = "Select time",
  className,
  disabled = false,
}) {
  const [open, setOpen] = React.useState(false);

  const parsedTime = React.useMemo(() => {
    if (!value?.trim()) return null;
    try {
      const [hStr, mStr] = value.split(":");
      const h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10);
      if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59)
        return null;
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d;
    } catch {
      return null;
    }
  }, [value]);

  const displayTime = React.useMemo(() => {
    return parsedTime ? format(parsedTime, "HH:mm") : "";
  }, [parsedTime]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const handleHourChange = (hour) => {
    const base = parsedTime ?? new Date();
    const updated = setHours(base, hour);
    onChange(format(updated, "HH:mm"));
  };

  const handleMinuteChange = (minute) => {
    const base = parsedTime ?? new Date();
    const updated = setMinutes(base, minute);
    onChange(format(updated, "HH:mm"));
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start font-normal",
              !displayTime && "text-muted-foreground italic",
              error && "border-destructive focus-visible:ring-destructive/30",
              disabled && "opacity-60 cursor-not-allowed",
            )}
            disabled={disabled}
          >
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            {displayTime || placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[200px] p-4" align="start">
          <div onWheel={(e) => e.stopPropagation()} className="flex gap-3">
            {/* HOURS column */}
            <div className="flex-1">
              <div className="text-xs font-medium text-muted-foreground text-center mb-2">
                Hours
              </div>
              <ScrollArea className="h-64 rounded-md border bg-background">
                <div className="py-2 px-1 flex flex-col items-center">
                  {hours.map((h) => {
                    const isSelected = parsedTime?.getHours() === h;
                    return (
                      <Button
                        key={h}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-10 h-9 text-base font-medium rounded-md my-0.5",
                          isSelected
                            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                            : "hover:bg-accent",
                        )}
                        onClick={() => handleHourChange(h)}
                      >
                        {h.toString().padStart(2, "0")}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* MINUTES column */}
            <div onWheel={(e) => e.stopPropagation()} className="flex-1">
              <div className="text-xs font-medium text-muted-foreground text-center mb-2">
                Minutes
              </div>
              <ScrollArea className="h-64 rounded-md border bg-background">
                <div className="py-2 px-1 flex flex-col items-center overflow-auto">
                  {minutes.map((m) => {
                    const isSelected = parsedTime?.getMinutes() === m;
                    return (
                      <Button
                        key={m}
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "w-10 h-9 text-base font-medium rounded-md my-0.5",
                          isSelected
                            ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground shadow-sm"
                            : "hover:bg-accent",
                        )}
                        onClick={() => handleMinuteChange(m)}
                      >
                        {m.toString().padStart(2, "0")}
                      </Button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {error && (
        <InputError
          message={error}
          className="mt-1.5 text-sm text-destructive"
        />
      )}
    </div>
  );
}
