import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function CountDownComponent({ startDate, endDate }) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [textColor, setTextColor] = useState("text-green-600");

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const end = new Date(endDate);
      const start = new Date(startDate);
      const totalDuration = end - start;
      const elapsed = now - start;
      const remaining = end - now;

      if (remaining <= 0) {
        setTimeRemaining(0);
        setTextColor("text-red-600");
        return;
      }

      setTimeRemaining(remaining);

      // Calculate progress percentage
      const progressPercentage = (elapsed / totalDuration) * 100;

      // 4 stages: Green, Yellow, Orange, Red
      if (progressPercentage < 25) {
        setTextColor("text-green-600");
      } else if (progressPercentage < 50) {
        setTextColor("text-yellow-600");
      } else if (progressPercentage < 75) {
        setTextColor("text-orange-600");
      } else {
        setTextColor("text-red-600");
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const formatTime = (ms) => {
    if (ms === null || ms === 0) return "00:00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className=" text-center">
      <div className={`text-3xl font-bold ${textColor}`}>
        {formatTime(timeRemaining)}
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        {timeRemaining === 0
          ? "Project has ended!"
          : timeRemaining > 0
            ? "Time remaining until project end"
            : "Project not started yet"}
      </p>
    </div>
  );
}
