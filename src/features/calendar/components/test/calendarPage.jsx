/* eslint-disable no-unused-vars */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
// Import shadcn components for modals, buttons, etc.
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import EventDetailsDialog from "./EventDetailsDialog";
import "./calendar.css";
import { Plus } from "lucide-react";

function CalendarPage() {
  const [events, setEvents] = useState([
    { title: "Meeting", start: "2025-12-25", color: "#3b82f6" },
    {
      id: 20,
      title: "New Year",
      start: "2025-01-01",
      end: "2025-01-01",
      description: "New Year public holiday in Morocco",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 21,
      title: "Independence Manifesto Day",
      start: "2025-01-11",
      end: "2025-01-11",
      description: "Independence Manifesto Day",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 22,
      title: "Labour Day",
      start: "2025-05-01",
      end: "2025-05-01",
      description: "International Workers Day",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 23,
      title: "Throne Day",
      start: "2025-07-30",
      end: "2025-07-30",
      description: "Throne Day of Morocco",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 24,
      title: "Oued Ed-Dahab Day",
      start: "2025-08-14",
      end: "2025-08-14",
      description: "Oued Ed-Dahab Day",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 25,
      title: "Revolution of the King and the People",
      start: "2025-08-20",
      end: "2025-08-20",
      description: "Revolution of the King and the People",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 26,
      title: "Youth Day",
      start: "2025-08-21",
      end: "2025-08-21",
      description: "Youth Day - King's Birthday",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 27,
      title: "Green March",
      start: "2025-11-06",
      end: "2025-11-06",
      description: "Green March Day",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 28,
      title: "Independence Day",
      start: "2025-11-18",
      end: "2025-11-18",
      description: "Independence Day of Morocco",
      category: "Holiday",
      status: "pending",
      type: "offline",
      repeatedly: "yearly",
    },
    {
      id: 41,
      title: "test001",
      start: "2025-12-25",
      end: "2025-12-25",
      description: "test/test/test/test/test/test/",
      category: "Agency",
      status: "pending",
      type: "online",
      repeatedly: "daily",
      url: "http://test.com",
    },
    {
      id: 42,
      title: "test001",
      start: "2025-12-25",
      end: "2025-12-25",
      description: "test/test/test/test/test/test/",
      category: "Other",
      status: "pending",
      type: "online",
      repeatedly: "weekly",
      url: "http://test.com",
    },
    {
      id: 43,
      title: "test001",
      start: "2025-12-25",
      end: "2025-12-25",
      description: "test/test/test/test/test/test/",
      category: "Other",
      status: "pending",
      type: "online",
      repeatedly: "monthly",
      url: "http://test.com",
    },
    {
      id: 45,
      title: "test001",
      start: "2025-12-25",
      end: "2026-01-10",
      description: "test/test/test/test/test/test/",
      category: "Other",
      status: "pending",
      type: "online",
      repeatedly: "none",
      url: "http://test.com",
    },
    {
      id: 46,
      title: "test001",
      start: "2025-12-25",
      end: "2025-12-25",
      description: "test/test/test/test/test/test/",
      category: "Agency",
      status: "pending",
      type: "online",
      repeatedly: "daily",
      url: "http://test.com",
    },
    {
      id: 47,
      title: "test001",
      start: "2025-12-01",
      end: "2025-12-01",
      description: "test/test/test/test/test/test/",
      category: "Other",
      status: "pending",
      type: "online",
      repeatedly: "weekly",
      url: "http://test.com",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setOpen(true);
  };

  const handleEventCreate = (newEventOrEvents) => {
    if (Array.isArray(newEventOrEvents)) {
      setEvents([...events, ...newEventOrEvents]);
    } else {
      setEvents([...events, newEventOrEvents]);
    }
  };

  //   const handleViewChange = (view) => {
  //     setCurrentView(view);
  //   };

  const handleEventClick = (info) => {
    const event = events.find((e) => e.id === parseInt(info.event.id));
    if (event) {
      setSelectedEvent(event);
      setDetailsOpen(true);
    }
  };

  const handleEventEdit = (event) => {
    setDetailsOpen(false);
    console.log("Edit event:", event);
  };

  const handleEventDelete = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      setEvents(events.filter((e) => e.id !== event.id));
      setDetailsOpen(false);
    }
  };

  const handleEventPreview = (event) => {
    console.log("Preview event:", event);
  };

  return (
    <div className="calendar-container min-h-[800px]">
      <div className="flex justify-end items-center">
        <div className="flex gap-4 items-center absolute top-4">
          <Button onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            New event
          </Button>
        </div>
      </div>

      <div className="calendar-container">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView="dayGridMonth"
          firstDay={1} // 1 = Monday, 0 = Sunday
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
          }}
          events={events.map((event) => {
            const { url, ...eventWithoutUrl } = event;
            return {
              ...eventWithoutUrl,
              id: event.id?.toString() || Date.now().toString(),
              className: `fc-event-${event.category?.toLowerCase() || "default"}`,
              "data-category": event.category,
            };
          })}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>

      <EventForm
        open={open}
        onOpenChange={setOpen}
        selectedDate={selectedDate}
        onEventCreate={handleEventCreate}
      />

      <EventDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={selectedEvent}
        onEdit={handleEventEdit}
        onDelete={handleEventDelete}
        onPreview={handleEventPreview}
      />
    </div>
  );
}

export default CalendarPage;
