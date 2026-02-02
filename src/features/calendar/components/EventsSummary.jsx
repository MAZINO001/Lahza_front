import React from "react";
import { Calendar, Users, AlertTriangle, ChevronDown } from "lucide-react";
import { useEvents } from "../hooks/useCalendarQuery";

export default function EventsSummary() {
  const { data: events = [] } = useEvents();

  // Get today's date for filtering
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate upcoming events (next 7 days)
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_date || event.start);
      return eventDate >= today && eventDate <= nextWeek;
    })
    .slice(0, 5); // Show max 5 events

  // Calculate urgent events (today)
  const urgentEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_date || event.start);
      return eventDate.toDateString() === today.toDateString();
    })
    .slice(0, 3); // Show max 3 urgent events

  const sections = [
    {
      label: "Upcoming Events",
      value: upcomingEvents.length,
      icon: <Calendar className="h-5 w-5" />,
      items: upcomingEvents.map((event) => {
        const eventDate = new Date(event.start_date || event.start);
        const dateStr = eventDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        return `${event.title} – ${dateStr}`;
      }),
    },
    {
      label: "Urgent Today",
      value: urgentEvents.length,
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
      items: urgentEvents.map((event) => {
        const eventDate = new Date(event.start_date || event.start);
        const timeStr = eventDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `${event.title} – ${timeStr}`;
      }),
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
