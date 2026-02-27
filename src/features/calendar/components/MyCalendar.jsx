import { useState, useEffect } from "react";
import { IlamyCalendar } from "@ilamy/calendar";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import EventForm from "./EventForm";
import EventDetailsDialog from "./EventDetailsDialog.jsx";
import {
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "../hooks/useCalendarQuery";
import {
  ramadanEvents,
  eidAlFitrEvents,
  eidAlAdhaEvents,
} from "@/lib/CalendarData";
import EventsSummary from "./EventsSummary";
import OfferPlacementSlot from "@/features/offers/components/OfferPlacementSlot";
import { useAuthContext } from "@/hooks/AuthContext";

export default function MyCalendar() {
  const { data: events } = useEvents();
  const { role } = useAuthContext();

  const parseRrule = (rrule) => {
    if (!rrule) return null;

    if (typeof rrule === "object") {
      return rrule;
    }

    if (typeof rrule === "string") {
      try {
        const parsed = JSON.parse(rrule);

        if (parsed.dtstart && typeof parsed.dtstart === "string") {
          parsed.dtstart = new Date(parsed.dtstart);
        }
        return parsed;
      } catch (error) {
        console.error("Error parsing rrule:", error);
        return null;
      }
    }

    return null;
  };

  const [holidays, setHolidays] = useState([]);

  const generateRecurringEvents = async () => {
    const year = new Date().getFullYear();

    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/MA`,
      );
      const holidaysData = await response.json();

      const formattedHolidays = holidaysData.map((holiday) => ({
        title: holiday.localName || holiday.name,
        start_date: holiday.date,
        end_date: holiday.date,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: holiday.name,
        guests: null,
        url: null,
        other_notes: `Country: ${holiday.countryCode}`,
        repeatedly: "yearly",
        rrule: {
          freq: 0,
          interval: 1,
          dtstart: new Date(holiday.date),
        },
      }));

      setHolidays(formattedHolidays);
      return formattedHolidays;
    } catch (error) {
      console.error("Error fetching holidays:", error);
      return [
        {
          title: "New Year's Day",
          start_date: `${year}-01-01`,
          end_date: `${year}-01-01`,
          start_hour: "00:00",
          end_hour: "23:59",
          all_day: 1,
          category: "holiday",
          status: "pending",
          type: "offline",
          color: "#ec4899",
          description: "New Year's Day",
          guests: null,
          url: null,
          other_notes: null,
          repeatedly: "yearly",
          rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-01-01`) },
        },
      ];
    }
  };

  useEffect(() => {
    generateRecurringEvents();
  }, []);

  const transformedEvents =
    events?.map((event) => {
      if (event.start && event.end) {
        return event;
      }

      const [startYear, startMonth, startDay] = event.start_date
        ? event.start_date.split("-").map(Number)
        : [null, null, null];
      const [startHour, startMinute] = event.start_hour
        ? event.start_hour.split(":").map(Number)
        : [0, 0];

      const [endYear, endMonth, endDay] = event.end_date
        ? event.end_date.split("-").map(Number)
        : [null, null, null];
      const [endHour, endMinute] = event.end_hour
        ? event.end_hour.split(":").map(Number)
        : [0, 0];

      const startDateTime = event.start_date
        ? new Date(
          startYear,
          startMonth - 1,
          startDay,
          startHour || 9,
          startMinute || 0,
        )
        : new Date();

      const endDateTime = event.end_date
        ? new Date(endYear, endMonth - 1, endDay, endHour || 10, endMinute || 0)
        : new Date(startDateTime.getTime() + 60 * 60 * 1000);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn("Invalid date for event:", event.title, {
          startDateTime,
          endDateTime,
        });
        return null;
      }

      return {
        ...event,
        start: startDateTime,
        end: endDateTime,
        allDay: event.all_day === 1 || event.allDay === true,
        title: event.title || "Untitled Event",
        description: event.description || "",
        rrule: parseRrule(event.rrule),
      };
    }) || [];

  const recurringEvents = holidays.map((event, index) => {
    const [startYear, startMonth, startDay] = event.start_date
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = event.end_date.split("-").map(Number);
    const [startHour, startMinute] = event.start_hour.split(":").map(Number);
    const [endHour, endMinute] = event.end_hour.split(":").map(Number);

    const startDateTime = new Date(
      startYear,
      startMonth - 1,
      startDay,
      startHour,
      startMinute,
    );
    const endDateTime = new Date(
      endYear,
      endMonth - 1,
      endDay,
      endHour,
      endMinute,
    );

    return {
      ...event,
      id: `holiday_${index}`, // Add unique ID for holiday events
      start: startDateTime,
      end: endDateTime,
      allDay: event.all_day === 1 || event.allDay === true,
      isReadOnly: true, // Mark as read-only to prevent drag/drop
    };
  });

  /************* START OF ISLAMIC HOLIDAYS *************/

  const generateIslamicHolidays = () => {
    const currentYear = new Date().getFullYear();
    const islamicHolidays = [];

    const ramadanForYear = ramadanEvents.find((event) =>
      event.start_date.startsWith(currentYear.toString()),
    );

    if (ramadanForYear) {
      const startDate = new Date(ramadanForYear.start_date);

      islamicHolidays.push({
        title: "Ramadan Start",
        start_date: startDate.toISOString().split("T")[0],
        end_date: startDate.toISOString().split("T")[0],
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#10b981", // Green for Islamic events
        description: "Start of the holy month of Ramadan",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: startDate },
      });
    }

    const eidAlFitrForYear = eidAlFitrEvents.find((event) =>
      event.start_date.startsWith(currentYear.toString()),
    );

    if (eidAlFitrForYear) {
      const startDate = new Date(eidAlFitrForYear.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 2); // +2 to make it 3 days total (start, +1, +2)

      islamicHolidays.push({
        title: "Eid al-Fitr",
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#10b981", // Green for Islamic events
        description: "Celebration marking the end of Ramadan - 3 days",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: startDate },
      });
    }

    const eidAlAdhaForYear = eidAlAdhaEvents.find((event) =>
      event.start_date.startsWith(currentYear.toString()),
    );

    if (eidAlAdhaForYear) {
      const startDate = new Date(eidAlAdhaForYear.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // +6 to make it 7 days total (start, +1, +2, +3, +4, +5, +6)

      islamicHolidays.push({
        title: "Eid al-Adha",
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#10b981", // Green for Islamic events
        description:
          "Festival of Sacrifice commemorating Prophet Ibrahim's devotion - 7 days",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: startDate },
      });
    }

    return islamicHolidays;
  };
  /************* END OF ISLAMIC HOLIDAYS *************/

  // Get Islamic holidays and transform them
  const islamicEvents = generateIslamicHolidays().map((event, index) => {
    const [startYear, startMonth, startDay] = event.start_date
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = event.end_date.split("-").map(Number);
    const [startHour, startMinute] = event.start_hour.split(":").map(Number);
    const [endHour, endMinute] = event.end_hour.split(":").map(Number);

    const startDateTime = new Date(
      startYear,
      startMonth - 1,
      startDay,
      startHour,
      startMinute,
    );
    const endDateTime = new Date(
      endYear,
      endMonth - 1,
      endDay,
      endHour,
      endMinute,
    );

    return {
      ...event,
      id: `islamic_${index}`, // Add unique ID for Islamic events
      start: startDateTime,
      end: endDateTime,
      allDay: event.all_day === 1 || event.allDay === true,
      isReadOnly: true, // Mark as read-only to prevent drag/drop
    };
  });

  // Combine regular events with recurring and Islamic events
  const allEvents = [
    ...transformedEvents,
    ...recurringEvents,
    ...islamicEvents,
  ];

  // Filter out any null events from invalid dates
  const validEvents = allEvents.filter((event) => event !== null);

  const DeleteMutation = useDeleteEvent();
  const updateMutation = useUpdateEvent();

  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Get locale from localStorage and map to calendar locale
  const getCalendarLocale = () => {
    const storedLocale = localStorage.getItem("i18nextLng");
    if (!storedLocale) return "fr"; // default fallback

    const localeMap = {
      "en-US": "en",
      en: "en",
      "fr-FR": "fr",
      fr: "fr",
    };

    return localeMap[storedLocale] || "fr"; // default to 'fr' if not found
  };

  const calendarLocale = getCalendarLocale();

  const translator = (key, options) => {
    const translations = {
      today: "Aujourd'hui",
      month: "Mois",
      week: "Semaine",
      day: "Jour",
      year: "Année",
      previous: "Précédent",
      next: "Suivant",
      create: "Créer",
      edit: "Modifier",
      delete: "Supprimer",
      save: "Enregistrer",
      cancel: "Annuler",
      noEvents: "Aucun événement",
      allDay: "Toute la journée",
      time: "Heure",
      date: "Date",
      title: "Titre",
      description: "Description",
    };

    if (options && options.count && key === "events") {
      return options.count === 1 ? "événement" : "événements";
    }

    return translations[key] || key;
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleEventEdit = (event) => {
    setSelectedEvent(event);
    setEditMode(true);
    setShowEventDetails(false);
    setShowEventForm(true);
  };

  const handleCellClick = (info) => {
    if (role === "client") {
      console.log("Clients cannot create events");
      return;
    }
    console.log("info", info);
    const startDate = info.start ? info.start.toDate() : new Date();
    const endDate = info.end
      ? info.end.toDate()
      : new Date(startDate.getTime() + 60 * 60 * 1000);
    const startDateFormatted = startDate.toLocaleDateString("en-CA");
    const endDateFormatted = endDate.toLocaleDateString("en-CA");
    const startTimeFormatted = startDate.toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const endTimeFormatted = endDate.toLocaleTimeString("en-CA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const isAllDay = info.allDay === true;

    const eventData = {
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
      allDay: isAllDay,
    };

    setSelectedDate(eventData);
    setSelectedEvent(null);
    setEditMode(false);
    setShowEventForm(true);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleEventUpdate = (updatedEvent) => {
    // Prevent updates on read-only events (holidays, Islamic events) or events without proper database IDs
    if (updatedEvent.isReadOnly || !updatedEvent.id || typeof updatedEvent.id !== 'number') {
      console.log("Cannot update read-only event or event without valid ID:", updatedEvent.title);
      return;
    }

    console.log("Drag and drop update data:", updatedEvent);
    console.log("Event start:", updatedEvent.start);
    console.log("Event end:", updatedEvent.end);

    // Convert Date objects back to backend format
    const formatDateTimeForBackend = (date) => {
      const d = new Date(date);
      const dateStr = d.toLocaleDateString("en-CA"); // YYYY-MM-DD format
      const timeStr = d.toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }); // HH:MM format
      return { date: dateStr, time: timeStr };
    };

    const startData = formatDateTimeForBackend(updatedEvent.start);
    const endData = formatDateTimeForBackend(updatedEvent.end);

    // Only send the fields that the backend expects for updates
    const backendData = {
      title: updatedEvent.title,
      start_date: startData.date,
      start_hour: startData.time,
      end_date: endData.date,
      end_hour: endData.time,
      all_day: updatedEvent.allDay ? 1 : 0,
    };

    // Only include description if it exists
    if (updatedEvent.description) {
      backendData.description = updatedEvent.description;
    }

    console.log("Cleaned backend data:", backendData);

    updateMutation.mutate({ id: updatedEvent.id, data: backendData });
  };

  const handleEventDelete = (deletedEvent) => {
    // Prevent deletion of read-only events (holidays, Islamic events)
    if (deletedEvent.isReadOnly) {
      console.log("Cannot delete read-only event:", deletedEvent.title);
      return;
    }

    DeleteMutation.mutate(deletedEvent.id);
    setShowEventDetails(false);
  };

  // const handleEventComplete = (updatedEvent) => {
  //   const data = {
  //     title: updatedEvent.title,
  //     start_date: updatedEvent.start_date,
  //     end_date: updatedEvent.end_date,
  //     status: "completed",
  //   };

  //   updateMutation.mutate({ id: updatedEvent.id, data });
  //   setShowEventDetails(false); // Close the dialog after updating
  // };

  const handleEventComplete = (updatedEvent) => {
    const newStatus =
      updatedEvent.status === "pending" ? "completed" : "pending";
    const data = {
      title: updatedEvent.title,
      start_date: updatedEvent.start_date,
      end_date: updatedEvent.end_date,
      status: newStatus,
    };

    updateMutation.mutate({ id: updatedEvent.id, data });
    setShowEventDetails(false);
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const renderEvent = (event, view) => {
    const eventColor = event.color || "#3b82f6";

    const now = new Date();
    const eventEnd =
      event.end instanceof Date ? event.end : new Date(event.end);
    const isPast = eventEnd < now;
    const isCompleted = event.status === "completed";
    const isFinished = isPast || isCompleted;

    const bgColor = isFinished ? `rgba(128, 128, 128, 0.3)` : `${eventColor}4d`;

    const borderColor = isFinished ? "#808080" : eventColor;
    const opacity = isFinished ? "opacity-50" : "";

    const formatTime = (date) => {
      if (!date) return "";
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false,
      });
    };

    const startTime = formatTime(event.start);
    const endTime = formatTime(event.end);
    const timeDisplay = startTime && endTime ? `${startTime} → ${endTime}` : "";

    if (view === "month" || view === "week" || view === "day") {
      return (
        <div
          className={`p-1 text-xs font-medium truncate ${opacity} ${isFinished ? "line-through" : ""}`}
          style={{
            backgroundColor: bgColor,
            borderLeft: `2px solid ${borderColor}`,
            color: isFinished ? "#666666" : "text-foreground",
            height: "100%",
          }}
        >
          <span className="truncate">{event.title}</span>
        </div>
      );
    }

    return (
      <div
        className={`p-2 text-sm font-medium ${opacity}`}
        style={{
          backgroundColor: bgColor,
          color: isFinished ? "#666666" : "dark:text-white text-black",
          height: "100%",
        }}
      >
        <div className="flex items-center gap-2">
          {event.urgency === "high" && !isFinished && <span>🔥</span>}
          <span className={`truncate ${isFinished ? "line-through" : ""}`}>
            {event.title}
          </span>
        </div>

        {timeDisplay && (
          <p
            className={`text-xs mt-1 opacity-80 ${isFinished ? "opacity-50" : ""}`}
          >
            {timeDisplay}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 flex gap-4 w-full overflow-auto">
        <div className="w-[70%]">
          <IlamyCalendar
            stickyViewHeader={false}
            // renderEventForm={(props) => <EventForm {...props} />}
            renderEventForm={(props) =>
              role === "client" ? null : <EventForm {...props} />
            }
            viewHeaderClassName="bg-background"
            disableEventCreation={role === "client"}
            headerClassName="bg-blue-50 bg-background text-blue-900 border-2 border-border p-4 rounded-t-md"
            events={validEvents}
            renderEvent={(event) => renderEvent(event, currentView)}
            locale="fr"
            timezone="Europe/Paris"
            firstDayOfWeek="monday"
            initialView="month"
            translator={translator}
            timeFormat="24-hour"
            onEventClick={handleEventClick}
            onCellClick={handleCellClick}
            onViewChange={handleViewChange}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
            onDateChange={handleDateChange}
            dayMaxEvents={8}
            eventSpacing={2}
          />
        </div>
        <div className="flex flex-col w-[30%]">
          <div>
            <EventsSummary />
          </div>
          <OfferPlacementSlot
            placement="calendar"
            maxOffers={1}
            showAnimated={true}
          />
        </div>
      </div>

      <EventDetailsDialog
        open={showEventDetails}
        onOpenChange={setShowEventDetails}
        event={selectedEvent}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
        onUpdate={handleEventComplete}
      />

      <EventForm
        open={showEventForm}
        onClose={() => setShowEventForm(false)}
        selectedDate={selectedDate}
        editMode={editMode}
        selectedEvent={selectedEvent}
        onEventEdit={handleEventEdit}
      />
    </div>
  );
}
