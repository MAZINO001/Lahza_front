"use client";

import { useState } from "react";
import { Check } from "lucide-react";

const colors = [
  { name: "Meeting", color: "bg-blue-500" },
  { name: "Deadline", color: "bg-red-500" },
  { name: "Reminder", color: "bg-yellow-500" },
  { name: "Other", color: "bg-green-500" },
  { name: "Holiday", color: "bg-stone-400" },
  { name: "weekend", color: "bg-stone-400" },
  { name: "Workshop", color: "bg-purple-500" },
  { name: "Personal", color: "bg-indigo-500" },
  { name: "Travel", color: "bg-teal-500" },
  { name: "Urgent", color: "bg-orange-500" },
];

export default function ColorPicker() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div className="p-4 border rounded-lg shadow-sm w-full max-w-md">
      <h3 className="text-sm font-medium mb-3">Pick a color</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {colors.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => setSelectedColor(c)}
            className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer hover:shadow-md transition ${
              selectedColor.name === c.name
                ? "border-border dark:border-white"
                : "border-transparent"
            }`}
          >
            <div
              className={`w-5 h-5 rounded ${c.color} flex items-center justify-center`}
            >
              {selectedColor.name === c.name && (
                <Check className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="text-sm text-muted-foreground">{c.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Selected: <span className="font-semibold">{selectedColor.name}</span>
      </p>
    </div>
  );
}
