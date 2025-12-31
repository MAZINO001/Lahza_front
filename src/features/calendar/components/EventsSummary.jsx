import React from "react";
import { Calendar, Users, AlertTriangle, ChevronDown } from "lucide-react";

export default function EventsSummary() {
  const sections = [
    {
      label: "Upcoming Events",
      value: 18,
      icon: <Calendar className="h-5 w-5" />,
      items: [
        "Team meeting – Jan 2",
        "Client presentation – Jan 4",
        "Design review – Jan 6",
      ],
    },
    {
      label: "Urgent Today",
      value: 3,
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      items: [
        "Invoice deadline – 5 PM",
        "Event setup – 3 PM",
        "Send reminders",
      ],
    },
  ];

  return (
    <div className="rounded-xl border bg-background p-4">
      <h2 className="text-lg font-semibold">Events Overview</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Quick snapshot of what’s coming up, who’s involved, and what needs
        immediate attention today.
      </p>

      <div className="space-y-3">
        {sections.map((section) => (
          <details key={section.label} className="group rounded-lg border">
            <summary className="flex cursor-pointer items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                  {section.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{section.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {section.value} total
                  </p>
                </div>
              </div>

              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>

            <div className="border-t px-4 pb-4 pt-2 overflow-auto max-h-70">
              <ul className="space-y-2 text-sm ">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
