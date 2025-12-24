"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const eventColors = [
  { name: "Meeting", color: "bg-blue-500" },
  // { name: "Deadline", color: "bg-red-500" },
  { name: "Reminder", color: "bg-yellow-500" },
  // { name: "Workshop", color: "bg-purple-500" },
  { name: "Agency", color: "bg-indigo-500" },
  // { name: "Travel", color: "bg-teal-500" },
  // { name: "Urgent", color: "bg-orange-500" },
  { name: "Holiday", color: "bg-pink-500" },
  { name: "Other", color: "bg-green-500" },
  { name: "Weekend", color: "bg-gray-400" },
];

export default function EventColorPicker({ value, onChange }) {
  console.log(value);

  const selectedColor =
    eventColors.find((c) => c.name === value) || eventColors[0];

  return (
    <div className="grid grid-cols-2 gap-3">
      {eventColors.map((color) => (
        <button
          key={color.name}
          type="button"
          onClick={() => onChange?.(color.name)}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent hover:text-accent-foreground transition-all",
            selectedColor.name === color.name && "bg-accent"
          )}
        >
          <div
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center shrink-0 ring-2 ring-offset-1",
              color.color,
              selectedColor.name === color.name
                ? "ring-ring shadow-md"
                : "ring-transparent"
            )}
          >
            {selectedColor.name === color.name && (
              <Check className="w-4 h-4 text-white drop-shadow" />
            )}
          </div>
          <span className="text-sm font-medium">{color.name}</span>
        </button>
      ))}
    </div>
  );
}
