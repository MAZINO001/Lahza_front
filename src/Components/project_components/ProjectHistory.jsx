/* eslint-disable no-unused-vars */
import { useState } from "react";

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
      <div className="relative flex items-center min-w-max">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>

        {history.map((item, idx) => {
          const isAbove = idx % 2 === 0;
          return (
            <div
              key={item.id}
              className="flex flex-col items-center px-8 relative"
            >
              <div
                className={`text-center w-32 ${
                  isAbove ? "mb-5 order-1" : "mt-4 order-2"
                }`}
              >
                <p className="text-sm font-medium text-gray-800">
                  {item.action}
                </p>
                <p className="text-xs text-gray-500">{item.user}</p>
                <p className="text-xs text-gray-400">{item.date}</p>
              </div>

              <div className="w-4 h-4 mb-18 bg-blue-500 rounded-full z-10 order-2"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
