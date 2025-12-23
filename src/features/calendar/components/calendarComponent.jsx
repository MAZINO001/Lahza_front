/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  format,
  parseISO,
  addDays,
  addWeeks,
  isWithinInterval,
  getDay,
} from "date-fns";
import { Clock, X } from "lucide-react";
import {
  CalendarProvider,
  CalendarHeader,
  CalendarBody,
  CalendarDatePagination,
  CalendarDate,
  useCalendarMonth,
  useCalendarYear,
} from "@/components/kibo-ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeleteEvent, useEvents } from "../hooks/useCalendarQuery";

export default function CalendarComponent() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [month, setMonth] = useCalendarMonth();
  const [year, setYear] = useCalendarYear();

  const { data: events, isLoading } = useEvents();

  const currentMonthStart = useMemo(
    () => new Date(year, month, 1),
    [year, month]
  );
  const currentMonthEnd = useMemo(
    () => new Date(year, month + 1, 0),
    [year, month]
  );

  const isWeekend = (date) => {
    const day = getDay(date);
    return day === 0 || day === 6;
  };

  const isHoliday = (date) => {
    if (!events || events.length === 0) return [];

    const target = date.toISOString().split("T")[0];

    return events.filter(
      (event) =>
        event.category === "holiday" &&
        target >= event.start_date &&
        target <= event.end_date
    );
  };

  const isNonWorkingDay = (date) => {
    return isWeekend(date) || isHoliday(date);
  };
  const expandedEvents = useMemo(() => {
    const instances = [];

    if (!events || events.length === 0) return instances;

    events.forEach((event) => {
      const baseStart = parseISO(event.start_date);
      const baseEnd = event.end_date ? parseISO(event.end_date) : baseStart;

      if (event.repeatedly === "none" || event.repeatedly === "") {
        const eventOverlapsMonth =
          baseStart <= currentMonthEnd && baseEnd >= currentMonthStart;

        if (eventOverlapsMonth) {
          instances.push({
            ...event,
            start_date: baseStart,
            end_date: baseEnd,
            instanceId: event.id,
          });
        }
      } else if (event.repeatedly === "daily") {
        let current = baseStart;
        const limit = baseEnd ?? addDays(currentMonthEnd, 365);

        while (current <= limit && current <= currentMonthEnd) {
          if (
            isWithinInterval(current, {
              start: currentMonthStart,
              end: currentMonthEnd,
            })
          ) {
            instances.push({
              ...event,
              start_date: current,
              end_date: new Date(current.getTime() + (baseEnd - baseStart)),
              instanceId: `${event.id}-${format(current, "yyyy-MM-dd")}`,
            });
          }
          current = addDays(current, 1);
        }
      } else if (event.repeatedly === "weekly") {
        let current = baseStart;
        const maxDate = addWeeks(currentMonthEnd, 52);
        while (current <= maxDate) {
          const occurrenceEnd = new Date(
            current.getTime() + (baseEnd - baseStart)
          );
          const occurrenceOverlapsMonth =
            current <= currentMonthEnd && occurrenceEnd >= currentMonthStart;

          if (occurrenceOverlapsMonth) {
            instances.push({
              ...event,
              start_date: current,
              end_date: occurrenceEnd,
              instanceId: `${event.id}-${format(current, "yyyy-MM-dd")}`,
            });
          }

          if (current > currentMonthEnd) break;
          current = addWeeks(current, 1);
        }
      } else if (event.repeatedly === "yearly") {
        for (let y = year - 1; y <= year + 1; y++) {
          const candidate = new Date(
            y,
            baseStart.getMonth(),
            baseStart.getDate()
          );
          const candidateEnd = event.end_date
            ? new Date(y, baseEnd.getMonth(), baseEnd.getDate())
            : candidate;

          const occurrenceOverlapsMonth =
            candidate <= currentMonthEnd && candidateEnd >= currentMonthStart;

          if (occurrenceOverlapsMonth) {
            instances.push({
              ...event,
              start_date: candidate,
              end_date: candidateEnd,
              instanceId: `${event.id}-${y}`,
            });
          }
        }
      }
    });

    return instances;
  }, [events, year, month, currentMonthStart, currentMonthEnd]);
  const getCategoryColor = (category) => {
    switch (category) {
      case "meeting":
        return "#3b82f6";
      case "deadline":
        return "#ef4444";
      case "reminder":
        return "#eab308";
      case "holiday":
        return "#f5f5f4";
      case "other":
      default:
        return "#22c55e";
    }
  };

  const getEventDays = (event) => {
    const start = new Date(event.start_date);
    const end = event.end_date ? new Date(event.end_date) : start;
    const days = [];

    let current = new Date(start);
    while (current <= end) {
      days.push(new Date(current));
      current = addDays(current, 1);
    }

    return days;
  };

  const calendarFeatures = useMemo(() => {
    const features = [];

    expandedEvents.forEach((event) => {
      const eventDays = getEventDays(event);

      eventDays.forEach((day, index) => {
        if (
          isWithinInterval(day, {
            start: currentMonthStart,
            end: currentMonthEnd,
          })
        ) {
          features.push({
            id: `${event.instanceId}-${format(day, "yyyy-MM-dd")}`,
            name: event.title,
            start_date: day,
            endAt: day,
            status: { color: getCategoryColor(event.category) },
            originalEvent: event,
            isStart: index === 0,
            isEnd: index === eventDays.length - 1,
            isContinuation: index > 0,
            totalDays: eventDays.length,
          });
        }
      });
    });

    return features;
  }, [expandedEvents, currentMonthStart, currentMonthEnd]);

  const handleFeatureClick = (feature) => {
    setSelectedEvent(feature.originalEvent);
  };

  const deleteEventMutation = useDeleteEvent();

  const handleDeleteEvent = (id) => {
    if (!id) return console.warn("No event ID provided");

    console.log("Deleting event with ID:", id);

    deleteEventMutation.mutate(
      { id },
      {
        onSuccess: () => {
          console.log("Event deleted successfully");
          setSelectedEvent(null);
        },
        onError: (error) => {
          console.error("Failed to delete event:", error);
        },
      }
    );
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Loading events...</p>
      </div>
    );
  }
  const currentYear = new Date().getFullYear();
  const earliestYear = events && events.length > 0
    ? Math.min(
      ...events.map((e) => parseISO(e.start_date).getFullYear()),
      currentYear
    )
    : currentYear;
  const latestYear = events && events.length > 0
    ? Math.max(
      ...events.map((e) =>
        (e.end_date ? parseISO(e.end_date) : parseISO(e.start_date)).getFullYear()
      ),
      currentYear
    )
    : currentYear;
  const years = Array.from(
    { length: latestYear - earliestYear + 1 },
    (_, i) => earliestYear + i
  );

  return (
    <div className="w-full h-screen">
      <CalendarProvider
        className={cn(
          "bg-background rounded-lg border border-border shadow-lg"
        )}
      >
        <CalendarDate>
          <div className="flex items-center gap-3">
            <Select
              value={month.toString()}
              onValueChange={(v) => setMonth(parseInt(v))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={year.toString()}
              onValueChange={(v) => setYear(parseInt(v))}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDatePagination />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date();
                setMonth(today.getMonth());
                setYear(today.getFullYear());
              }}
            >
              Today
            </Button>
          </div>
        </CalendarDate>

        <div className="flex flex-col flex-1">
          <CalendarHeader />

          <CalendarBody features={calendarFeatures} key={calendarFeatures.id}>
            {({ feature }) => {
              const isMultiDay = feature.totalDays > 1;

              return (
                <div
                  className={cn(
                    "cursor-pointer relative",
                    isMultiDay && "h-6 mb-1"
                  )}
                  onClick={() => handleFeatureClick(feature)}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center absolute inset-0 py-3 text-xs text-foreground overflow-hidden ",
                      feature.isStart && "rounded-l",
                      feature.isEnd && "rounded-r",
                      !feature.isStart && !feature.isEnd && "rounded-none"
                    )}
                    style={{
                      backgroundColor: feature.status.color,
                      left: feature.isStart ? "2px" : "0",
                      right: feature.isEnd ? "2px" : "0",
                    }}
                  >
                    {feature.isStart && (
                      <span className="font-medium truncate">
                        {feature.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            }}
          </CalendarBody>
        </div>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedEvent.title}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {format(selectedEvent.start_date, "MMMM d, yyyy")}
                    {selectedEvent.start_hour &&
                      ` at ${selectedEvent.start_hour}`}
                    {selectedEvent.end_hour && ` - ${selectedEvent.end_hour}`}
                  </span>
                </div>

                {selectedEvent.repeatedly !== "none" &&
                  selectedEvent.repeatedly && (
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      Repeats: {selectedEvent.repeatedly}
                    </div>
                  )}

                {selectedEvent.other_notes && (
                  <p className="text-muted-foreground">
                    {selectedEvent.other_notes}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full text-white",
                      selectedEvent.category === "meeting" && "bg-blue-500",
                      selectedEvent.category === "deadline" && "bg-red-500",
                      selectedEvent.category === "reminder" && "bg-yellow-500",
                      selectedEvent.category === "other" && "bg-green-500"
                    )}
                  >
                    {selectedEvent.category}
                  </span>
                  {isNonWorkingDay(selectedEvent.start_date) && (
                    <span className="text-xs px-3 py-1 rounded-full bg-stone-500 text-white">
                      {isWeekend(selectedEvent.start_date)
                        ? "Weekend"
                        : "Holiday"}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  variant="destructive"
                  className="flex-1"
                >
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="p-4 border-t border-border">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-muted-foreground">Meeting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-muted-foreground">Deadline</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-muted-foreground">Reminder</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-muted-foreground">Other</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-stone-400"></div>
              <span className="text-muted-foreground">Weekend/Holiday</span>
            </div>
          </div>
        </div>
      </CalendarProvider>

      <style jsx>{`
        .bg-stone-100 {
          background-color: #f5f5f4;
        }
        .dark .bg-stone-900/30 {
          background-color: rgba(28, 25, 23, 0.3);
        }
      `}</style>
    </div>
  );
}
