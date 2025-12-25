/* eslint-disable no-unused-vars */
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, Edit2, Trash2, X } from "lucide-react";
import {
  CalendarProvider,
  CalendarHeader,
  CalendarBody,
  CalendarDatePagination,
  CalendarDate,
  useCalendarMonth,
  useCalendarYear,
  CalendarEventContext, // Import the new context
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
import CalendarForm from "./calendarForm";
export default function CalendarComponent() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [month, setMonth] = useCalendarMonth();
  const [year, setYear] = useCalendarYear();
  const [open, setOpen] = useState();

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
        const limit = baseEnd ?? addDays(baseStart, 36500); // 100 years

        while (current <= limit) {
          // Skip weekends and holidays
          if (!isWeekend(current) && isHoliday(current).length === 0) {
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
          }

          // Stop if we've passed current month and limit
          if (current > currentMonthEnd && current > limit) break;

          current = addDays(current, 1);
        }
      } else if (event.repeatedly === "monthly") {
        let current = new Date(
          baseStart.getFullYear(),
          baseStart.getMonth(),
          baseStart.getDate()
        );
        const maxDate = addDays(currentMonthEnd, 365);

        while (current <= maxDate) {
          const occurrenceEnd = new Date(
            current.getFullYear(),
            current.getMonth(),
            current.getDate() + (baseEnd.getDate() - baseStart.getDate())
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

          if (current > currentMonthEnd && occurrenceOverlapsMonth === false)
            break;

          // Move to same day next month
          const nextMonth =
            current.getMonth() === 11 ? 0 : current.getMonth() + 1;
          const nextYear =
            current.getMonth() === 11
              ? current.getFullYear() + 1
              : current.getFullYear();
          current = new Date(nextYear, nextMonth, baseStart.getDate());
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

  console.log(expandedEvents);

  const eventColors = [
    { name: "Meeting", color: "#3b82f6" },
    { name: "Reminder", color: "#eab308" },
    { name: "Agency", color: "#6366f1" },
    { name: "Holiday", color: "#ec4899" },
    { name: "Other", color: "#22c55e" },
    { name: "Weekend", color: "#9ca3af" },
  ];
  const getEventColor = (event) => {
    const colorName = event.color || event.category || "Other";
    const matchingColor = eventColors.find((c) => c.name === colorName);

    return matchingColor ? matchingColor.color : "#22c55e";
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
    // Group events by their start date and assign rows
    const eventsByStartDate = new Map();

    expandedEvents.forEach((event) => {
      const startKey = format(event.start_date, "yyyy-MM-dd");
      if (!eventsByStartDate.has(startKey)) {
        eventsByStartDate.set(startKey, []);
      }
      eventsByStartDate.get(startKey).push(event);
    });

    // Track which row each event occupies across all days
    const eventRows = new Map();
    const dayRowOccupancy = new Map(); // Track which rows are occupied on each day

    // Sort events by start date to process them in order
    const sortedEvents = expandedEvents.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );

    sortedEvents.forEach((event) => {
      const eventDays = getEventDays(event);

      // Find the first available row for this event
      let assignedRow = 0;
      let foundRow = false;

      while (!foundRow) {
        let rowAvailable = true;

        // Check if this row is available for all days of the event
        for (const day of eventDays) {
          if (
            !isWithinInterval(day, {
              start: currentMonthStart,
              end: currentMonthEnd,
            })
          ) {
            continue;
          }

          const dayKey = format(day, "yyyy-MM-dd");
          if (!dayRowOccupancy.has(dayKey)) {
            dayRowOccupancy.set(dayKey, new Set());
          }

          if (dayRowOccupancy.get(dayKey).has(assignedRow)) {
            rowAvailable = false;
            break;
          }
        }

        if (rowAvailable) {
          foundRow = true;
          // Mark all days as occupied in this row
          eventDays.forEach((day) => {
            if (
              isWithinInterval(day, {
                start: currentMonthStart,
                end: currentMonthEnd,
              })
            ) {
              const dayKey = format(day, "yyyy-MM-dd");
              dayRowOccupancy.get(dayKey).add(assignedRow);
            }
          });
        } else {
          assignedRow++;
        }
      }

      eventRows.set(event.instanceId, assignedRow);
    });

    // Now create features with row assignments
    const features = [];

    expandedEvents.forEach((event) => {
      const eventDays = getEventDays(event);
      const assignedRow = eventRows.get(event.instanceId);

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
            status: { color: getEventColor(event) },
            originalEvent: event,
            isStart: index === 0,
            isEnd: index === eventDays.length - 1,
            isContinuation: index > 0,
            totalDays: eventDays.length,
            row: assignedRow, // Add row information
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

  const earliestYear =
    events && events.length > 0
      ? Math.min(
          ...events.map((e) => parseISO(e.start_date).getFullYear()),
          currentYear
        )
      : currentYear;

  const latestYear = earliestYear + 10;
  // events && events.length > 0
  //   ? Math.max(
  //       ...events.map((e) =>
  //         (e.end_date
  //           ? parseISO(e.end_date)
  //           : parseISO(e.start_date)
  //         ).getFullYear()
  //       ),
  //       currentYear
  //     )
  //   : currentYear;

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
        <CalendarEventContext.Provider value={{ handleFeatureClick }}>
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
                      "cursor-pointer",
                      isMultiDay ? "relative h-6 mb-1" : "h-6"
                    )}
                    onClick={() => handleFeatureClick(feature)}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-start py-1 px-2 text-xs text-foreground overflow-hidden",
                        isMultiDay && feature.isStart && "rounded-l",
                        isMultiDay && feature.isEnd && "rounded-r",
                        isMultiDay &&
                          !feature.isStart &&
                          !feature.isEnd &&
                          "rounded-none",
                        !isMultiDay && "rounded"
                      )}
                      style={{
                        backgroundColor: feature.status.color + "50",
                        ...(isMultiDay
                          ? {
                              position: "absolute",
                              inset: 0,
                              left: feature.isStart ? "2px" : "0",
                              right: feature.isEnd ? "2px" : "0",
                            }
                          : {}),
                      }}
                    >
                      {(feature.isStart || !isMultiDay) && (
                        <>
                          <div
                            className="mr-2 w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: feature.status.color }}
                          />
                          <p className="font-medium truncate">{feature.name}</p>
                        </>
                      )}
                    </div>
                  </div>
                );
              }}
            </CalendarBody>
          </div>
        </CalendarEventContext.Provider>

        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-background  rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="relative  border-b border-border p-4 text-muted-foreground">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 text-muted-foreground hover:bg-background/20"
                >
                  <X className="w-5 h-5" />
                </Button>
                <h3 className="text-2xl font-bold pr-8">
                  {selectedEvent.title}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "text-xs px-3 py-1 rounded-full font-medium border border-border bg-background backdrop-blur-sm"
                    )}
                  >
                    {selectedEvent.category}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900 dark:text-white">
                        {format(selectedEvent.start_date, "EEEE, MMMM d, yyyy")}
                      </div>
                      {selectedEvent.start_date !== selectedEvent.end_date && (
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Until{" "}
                          {format(
                            new Date(selectedEvent.end_date),
                            "MMMM d, yyyy"
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedEvent.start_hour && (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-500 shrink-0" />
                      <div className="font-medium text-sm text-slate-900 dark:text-white">
                        {selectedEvent.start_hour}
                        {selectedEvent.end_hour &&
                          selectedEvent.start_hour !== selectedEvent.end_hour &&
                          ` - ${selectedEvent.end_hour}`}
                      </div>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="text-sm text-slate-700 dark:text-slate-300">
                        {selectedEvent.description}
                      </div>
                    </div>
                  )}

                  {selectedEvent.type === "online" &&
                    selectedEvent.category === "Meeting" && (
                      <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <a
                          href={selectedEvent.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 underline break-all hover:opacity-80"
                        >
                          {selectedEvent.url}
                        </a>
                      </div>
                    )}

                  {selectedEvent.url &&
                    selectedEvent.url !== "http://test.com" && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <LinkIcon className="w-5 h-5 text-green-500 shrink-0" />
                        <a
                          href={selectedEvent.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate"
                        >
                          {selectedEvent.url}
                        </a>
                      </div>
                    )}

                  {selectedEvent.repeatedly !== "none" &&
                    selectedEvent.repeatedly && (
                      <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <div className="text-amber-500">↻</div>
                        </div>
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Repeats: {selectedEvent.repeatedly}
                        </div>
                      </div>
                    )}

                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        selectedEvent.status === "pending" && "bg-yellow-500",
                        selectedEvent.status === "completed" && "bg-green-500",
                        selectedEvent.status === "cancelled" && "bg-red-500"
                      )}
                    />
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                      {selectedEvent.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-sm">
                    <DialogHeader>
                      <DialogTitle>Create a new event</DialogTitle>
                      <DialogDescription>
                        Fill the form to create the event.
                      </DialogDescription>
                    </DialogHeader>

                    <CalendarForm
                      EventID={selectedEvent.id}
                      onSuccess={() => setOpen(false)}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border">
          <div className="flex flex-wrap gap-6 text-sm">
            {eventColors.map((event) => (
              <div key={event.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: event.color }}
                />
                <span className="text-muted-foreground">
                  {event.name === "Weekend" ? "Weekend/Holiday" : event.name}
                </span>
              </div>
            ))}
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
