/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from "react";
import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  addWeeks,
  addYears,
  isWithinInterval,
} from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  X,
} from "lucide-react";
import {
  CalendarProvider,
  CalendarHeader,
  CalendarBody,
  CalendarDatePagination,
  CalendarDate,
  CalendarItem,
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
import { useEvents } from "../hooks/useCalendarQuery";

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

  const expandedEvents = useMemo(() => {
    const instances = [];

    events?.forEach((event) => {
      const baseStart = parseISO(event.start_date);
      const baseEnd = event.end_date ? parseISO(event.end_date) : baseStart;

      if (event.repeatedly === "none" || event.repeatedly === "") {
        if (
          isWithinInterval(baseStart, {
            start: currentMonthStart,
            end: currentMonthEnd,
          })
        ) {
          instances.push({
            ...event,
            start_date: baseStart,
            end_date: baseEnd,
            instanceId: event.id,
          });
        }
      } else if (event.repeatedly === "daily") {
        let current = baseStart;
        const limit = baseEnd ?? currentMonthEnd;

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
        while (current <= maxDate && current <= currentMonthEnd) {
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
          current = addWeeks(current, 1);
        }
      } else if (event.repeatedly === "yearly") {
        const candidate = new Date(
          year,
          baseStart.getMonth(),
          baseStart.getDate()
        );
        if (
          isWithinInterval(candidate, {
            start: currentMonthStart,
            end: currentMonthEnd,
          })
        ) {
          instances.push({
            ...event,
            start_date: candidate,
            end_date: event.end_date
              ? new Date(year, baseEnd.getMonth(), baseEnd.getDate())
              : candidate,
            instanceId: `${event.id}-${year}`,
          });
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
      case "other":
      default:
        return "#22c55e";
    }
  };

  const calendarFeatures = useMemo(() => {
    return expandedEvents.map((event) => ({
      id: event.instanceId,
      name: event.title,
      start_date: event.start_date,
      endAt: event.end_date || event.start_date,
      status: { color: getCategoryColor(event.category) },
      originalEvent: event,
    }));
  }, [expandedEvents]);

  const handleFeatureClick = (feature) => {
    setSelectedEvent(feature.originalEvent);
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
  const earliestYear = Math.min(
    ...events.map((e) => parseISO(e.start_date).getFullYear()),
    new Date().getFullYear()
  );
  const latestYear = Math.max(
    ...events.map((e) =>
      (e.end_date ? parseISO(e.end_date) : parseISO(e.start_date)).getFullYear()
    ),
    new Date().getFullYear()
  );
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

        <div className="flex flex-col flex-1 ">
          <CalendarHeader />

          <CalendarBody features={calendarFeatures}>
            {({ feature }) => {
              return (
                <div
                  className="cursor-pointer"
                  onClick={() => handleFeatureClick(feature)}
                >
                  <CalendarItem feature={feature} key={feature.id} />
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
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="destructive" className="flex-1">
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
          </div>
        </div>
      </CalendarProvider>
    </div>
  );
}
