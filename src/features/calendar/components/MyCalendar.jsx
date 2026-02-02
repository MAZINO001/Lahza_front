import { useState } from "react";
import { IlamyCalendar } from "@ilamy/calendar";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import EventForm from "./EventForm";
import EventDetailsDialog from "./EventDetailsDialog.jsx";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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

export default function MyCalendar() {
  const { data: events } = useEvents();

  const generateRecurringEvents = () => {
    const year = new Date().getFullYear();

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
      {
        title: "Proclamation of Independence",
        start_date: `${year}-01-11`,
        end_date: `${year}-01-11`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Proclamation of Independence Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-01-11`) },
      },
      {
        title: "Amazigh New Year (Yennayer)",
        start_date: `${year}-01-14`,
        end_date: `${year}-01-14`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Amazigh New Year",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-01-14`) },
      },
      {
        title: "Labour Day",
        start_date: `${year}-05-01`,
        end_date: `${year}-05-01`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Labour Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-05-01`) },
      },
      {
        title: "Throne Day",
        start_date: `${year}-07-30`,
        end_date: `${year}-07-30`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Throne Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-07-30`) },
      },
      {
        title: "Oued Ed-Dahab Day",
        start_date: `${year}-08-14`,
        end_date: `${year}-08-14`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Oued Ed-Dahab Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-08-14`) },
      },
      {
        title: "Revolution of the King and the People",
        start_date: `${year}-08-20`,
        end_date: `${year}-08-20`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Revolution of the King and the People",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-08-20`) },
      },
      {
        title: "Youth Day",
        start_date: `${year}-08-21`,
        end_date: `${year}-08-21`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Youth Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-08-21`) },
      },
      {
        title: "Green March Day",
        start_date: `${year}-11-06`,
        end_date: `${year}-11-06`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Green March Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-11-06`) },
      },
      {
        title: "Independence Day",
        start_date: `${year}-11-18`,
        end_date: `${year}-11-18`,
        start_hour: "00:00",
        end_hour: "23:59",
        all_day: 1,
        category: "holiday",
        status: "pending",
        type: "offline",
        color: "#ec4899",
        description: "Independence Day",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: new Date(`${year}-11-18`) },
      },
    ];
  };

  // Transform events to IlamyCalendar format
  const transformedEvents =
    events?.map((event) => {
      // If event already has start/end properties, use as-is
      if (event.start && event.end) {
        return event;
      }

      // Parse date components more robustly
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

      // Create Date objects (month is 0-indexed in JavaScript Date constructor)
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
        : new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default to 1 hour after start

      // Validate the dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        console.warn("Invalid date for event:", event.title, {
          startDateTime,
          endDateTime,
        });
        return null;
      }

      console.log(
        "Event:",
        event.title,
        "Start:",
        startDateTime.toISOString(),
        "End:",
        endDateTime.toISOString(),
      );

      return {
        ...event,
        start: startDateTime,
        end: endDateTime,
        allDay: event.all_day === 1 || event.allDay === true, // FIX: Map all_day property to allDay
        title: event.title || "Untitled Event",
        description: event.description || "",
      };
    }) || [];

  // Get recurring events and transform them
  const recurringEvents = generateRecurringEvents().map((event) => {
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
      start: startDateTime,
      end: endDateTime,
      allDay: event.all_day === 1 || event.allDay === true,
    };
  });

  /************* START OF ISLAMIC HOLIDAYS *************/

  const generateIslamicHolidays = () => {
    const currentYear = new Date().getFullYear();
    const islamicHolidays = [];

    // Process Ramadan events - just the start date (single day)
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
        color: "#10b981", // Green for Ramadan
        description: "Start of the holy month of Ramadan",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: startDate },
      });
    }

    // Process Eid al-Fitr events - single 3-day event
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
        color: "#f59e0b", // Amber for Eid al-Fitr
        description: "Celebration marking the end of Ramadan - 3 days",
        guests: null,
        url: null,
        other_notes: null,
        repeatedly: "yearly",
        rrule: { freq: 0, interval: 1, dtstart: startDate },
      });
    }

    // Process Eid al-Adha events - single 7-day event
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
        color: "#ef4444", // Red for Eid al-Adha
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
  const islamicEvents = generateIslamicHolidays().map((event) => {
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
      start: startDateTime,
      end: endDateTime,
      allDay: event.all_day === 1 || event.allDay === true,
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

  console.log("Transformed events:", validEvents);

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

    // Map only French and English locale codes
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
    console.log("✅ Event clicked:", event);
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleAddNew = () => {
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setEditMode(false);
    setShowEventForm(true);
  };

  const handleEventEdit = (event) => {
    console.log("✏️ Editing event:", event);
    setSelectedEvent(event);
    setEditMode(true);
    setShowEventDetails(false);
    setShowEventForm(true);
  };

  const handleCellClick = (info) => {
    console.log("📅 Cell clicked:", {
      start: info.start?.format("YYYY-MM-DD HH:mm"),
      end: info.end?.format("YYYY-MM-DD HH:mm"),
      resourceId: info.resourceId,
    });
    // Open event form for new event
    setSelectedDate(info.start ? info.start.toDate() : new Date());
    setSelectedEvent(null);
    setEditMode(false);
    setShowEventForm(true);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleEventUpdate = (updatedEvent) => {
    updateMutation.mutate(updatedEvent);
  };

  const handleEventDelete = (deletedEvent) => {
    DeleteMutation.mutate(deletedEvent.id);
    setShowEventDetails(false);
  };

  const handleEventComplete = (updatedEvent) => {
    updateMutation.mutate(updatedEvent);
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
  };

  const renderEvent = (event, view) => {
    const eventColor = event.color || "#3b82f6";

    // const bgColor = `${eventColor}1a`; //10%
    // const bgColor = `${eventColor}33`; //20%
    const bgColor = `${eventColor}4d`; //30%

    // Format time for display
    const formatTime = (date) => {
      if (!date) return "";

      // Convert to Date object if it's not already
      const dateObj = date instanceof Date ? date : new Date(date);

      // Check if it's a valid date
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

    // In month view, show simpler layout
    if (view === "month") {
      return (
        <div
          className="p-1 text-xs font-medium truncate"
          style={{
            backgroundColor: bgColor,
            borderLeft: `2px solid ${eventColor}`,
            color: `text-foreground`,
          }}
        >
          <span className="truncate">{event.title}</span>
        </div>
      );
    }

    // In week/day view, show full details
    return (
      <div
        className=" p-2 text-sm font-medium"
        style={{
          backgroundColor: bgColor,
          // borderLeft: `4px solid ${eventColor}`,
          color: `dark:text-white text-black`,
          // color: eventColor,
          height: `100%`,
        }}
      >
        <div className="flex items-center gap-2">
          {event.urgency === "high" && <span>🔥</span>}
          <span className="truncate">{event.title}</span>
        </div>

        {timeDisplay && (
          <p className="text-xs mt-1 opacity-80">{timeDisplay}</p>
        )}

        {/* {event.description && (
          <p className="text-xs mt-1 truncate opacity-80">
            {event.description}
          </p>
        )} */}
      </div>
    );
  };

  // const renderCurrentTimeIndicator = (context) => {
  //   const { time, isVisible } = context;

  //   if (!isVisible) return null;

  //   return (
  //     <div
  //       className="absolute w-full border-t-2 border-red-500 z-10 pointer-events-none"
  //       style={{
  //         top: context.top || "0px",
  //         left: "0px",
  //       }}
  //     >
  //       <div className="flex items-center gap-2 text-red-500 text-xs font-semibold">
  //         <div className="w-3 h-3 rounded-full bg-red-500"></div>
  //         <span>{time?.format("HH:mm") || "Now"}</span>
  //       </div>
  //     </div>
  //   );
  // };

  // const businessHours = [
  //   {
  //     daysOfWeek: [0], // Sunday - off
  //     start: "00:00",
  //     end: "00:00",
  //   },
  //   {
  //     daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
  //     start: "09:00",
  //     end: "18:00",
  //   },
  //   {
  //     daysOfWeek: [6], // Saturday - off
  //     start: "00:00",
  //     end: "00:00",
  //   },
  // ];

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-1 overflow-auto bg-background overflow-none">
        <IlamyCalendar
          stickyViewHeader={false}
          renderEventForm={(props) => <EventForm {...props} />}
          viewHeaderClassName="top-16 bg-background z-40 rounded-t-2xl"
          headerClassName="bg-blue-50 bg-background text-blue-900 border-2 border-blue-200 p-4 rounded-t-md"
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

      <div className="bg-background border-border border-t border-l border-r p-4 rounded-b-md">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>
                Haute priorité:
                {validEvents?.filter((e) => e.priority === "high").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span>
                Priorité moyenne:
                {validEvents?.filter((e) => e.priority === "medium").length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>
                Basse priorité:
                {validEvents?.filter((e) => e.priority === "low").length}
              </span>
            </div>
          </div>
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
