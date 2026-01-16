import { useState } from "react";
import TimelineComponent from "@/components/timeline";

export default function ProjectHistory() {
  const [history, setHistory] = useState([
    { id: 1, date: "2025-12-09", user: "Alice", action: "Created the project" },
    {
      id: 2,
      date: "2025-12-10",
      user: "Bob",
      action: "Added Gantt chart",
    },
    {
      id: 3,
      date: "2025-12-11",
      user: "Alice",
      action: "Updated timeline",
    },
  ]);

  return (
    <div className="w-full overflow-x-auto py-6">
      <TimelineComponent />
    </div>
  );
}
