/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";

export default function CountDownComponent({ startDate, endDate }) {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [textColor, setTextColor] = useState("text-blue-600");

  const calculateTimeRemaining = () => {
    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (isNaN(start) || isNaN(end)) {
      setTimeRemaining(0);
      setTextColor("text-red-600");
      return;
    }

    const totalDuration = end - start;
    const remaining = end - now;

    if (remaining <= 0) {
      setTimeRemaining(0);
      setTextColor("text-red-600");
      return;
    }

    setTimeRemaining(remaining);

    const remainingPercentage = (remaining / totalDuration) * 100;
    if (remainingPercentage > 75) setTextColor("text-blue-600");
    else if (remainingPercentage > 50) setTextColor("text-green-600");
    else if (remainingPercentage > 25) setTextColor("text-orange-600");
    else setTextColor("text-red-600");
  };

  useEffect(() => {
    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  };

  const time = formatTime(timeRemaining);
  return (
    <div className="text-center">
      <div className={`${textColor} transition-colors duration-500`}>
        <div className="grid grid-cols-4 gap-2 mb-2">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              {String(time.days).padStart(2, "0")}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide mt-1">
              {time.days === 1 ? "Day" : "Days"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              {String(time.hours).padStart(2, "0")}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide mt-1">
              {time.hours === 1 ? "Hour" : "Hours"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              {String(time.minutes).padStart(2, "0")}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide mt-1">
              {time.minutes === 1 ? "Min" : "Mins"}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold">
              {String(time.seconds).padStart(2, "0")}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wide mt-1">
              {time.seconds === 1 ? "Sec" : "Secs"}
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mt-4">
        {timeRemaining <= 0
          ? "Project has ended"
          : "Time remaining until project ends"}
      </p>
    </div>
  );
}
