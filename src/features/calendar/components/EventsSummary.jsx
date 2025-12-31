import React from "react";
import { Calendar, Users, Clock, CheckCircle, XCircle } from "lucide-react";

export default function EventsSummary() {
  const stats = [
    {
      label: "Total Events",
      value: 42,
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Upcoming Events",
      value: 18,
      icon: <Clock className="h-5 w-5" />,
    },
    {
      label: "Attendees",
      value: 320,
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Completed Events",
      value: 21,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
    },
    {
      label: "Cancelled",
      value: 3,
      icon: <XCircle className="h-5 w-5 text-red-500" />,
    },
  ];

  return (
    <div className="rounded-xl border bg-background p-4 ">
      <h2 className="mb-4 text-lg font-semibold">Events Summary</h2>

      <div className="flex flex-col gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-lg border p-4"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
              {stat.icon}
            </div>

            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
