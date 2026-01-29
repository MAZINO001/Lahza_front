import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import EventForm from "./EventForm";
import EventDetailsDialog from "./EventDetailsDialog";
import "./calendar.css";
import { Plus } from "lucide-react";
import {
  useCreateEvent,
  useDeleteEvent,
  useEvents,
  useUpdateEvent,
} from "../hooks/useCalendarQuery";
import { processRepeatingEvents } from "../utils/repeatEventProcessor";
import EventsSummary from "./EventsSummary";

export default function CalendarPage() {
  const { data: events, isLoading, error } = useEvents();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const processedEvents = processRepeatingEvents(events);

  // Debug: Log processed events to verify they're formatted correctly
  console.log('Raw events:', events);
  console.log('Processed events for calendar:', processedEvents);

  if (isLoading) {
    return (
      <div className="calendar-container min-h-[800px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-container min-h-[800px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-2">Failed to load calendar</p>
          <p className="text-muted-foreground text-sm">Please try again later</p>
        </div>
      </div>
    );
  }

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setEditMode(false);
    setOpen(true);
  };

  const handleEventCreate = (newEventOrEvents) => {
    const eventsToCreate = Array.isArray(newEventOrEvents)
      ? newEventOrEvents
      : [newEventOrEvents];

    eventsToCreate.forEach((event) => {
      createMutation.mutate(event);
    });
  };

  const handleEventClick = (info) => {
    const event = processedEvents?.find((e) => e.id === info.event.id);
    if (!event.color) {
      return;
    }

    if (event) {
      setSelectedEvent(event);
      setDetailsOpen(true);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setDetailsOpen(false);
    setOpen(true);
  };

  const handleEventEdit = (event) => {
    const baseId = event.id.includes("-")
      ? parseInt(event.id.split("-")[0])
      : parseInt(event.id);

    updateMutation.mutate(
      { id: baseId, data: event },
      {
        onSuccess: () => {
          setDetailsOpen(false);
          setOpen(false);
        },
      },
    );
  };

  const handleEventDelete = (event) => {
    const baseId = event.id.includes("-")
      ? parseInt(event.id.split("-")[0])
      : parseInt(event.id);

    deleteMutation.mutate(
      { id: baseId },
      {
        onSuccess: () => {
          setDetailsOpen(false);
          setOpen(false);
        },
      },
    );
  };

  return (
    <div className="calendar-container min-h-[800px] ">
      <div className="flex justify-end items-center">
        <div className="flex gap-4 items-center absolute top-8">
          <Button
            onClick={() => {
              setSelectedDate(null);
              setEditMode(false);
              setOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
            New event
          </Button>
        </div>
      </div>

      <div className="calendar-container flex gap-4">
        <div className="w-[70%]">
          <FullCalendar
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView="dayGridMonth"
            firstDay={1}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            events={processedEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            slotMinTime="06:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={true}
            allDayText="All Day"
            scrollTime="08:00:00"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            displayEventEnd={true}
            slotEventOverlap={true}
            eventMaxStack={4}
            dayMaxEventRows={true}
            dayMaxEvents={true}
            weekNumbers={false}
            nowIndicator={true}
          />
        </div>
        <div className="w-[30%] mt-2">
          <EventsSummary />
        </div>
      </div>

      <EventForm
        open={open}
        onOpenChange={setOpen}
        selectedDate={selectedDate}
        onEventCreate={handleEventCreate}
        editMode={editMode}
        selectedEvent={editMode ? selectedEvent : null}
        onEventEdit={handleEventEdit}
      />

      <EventDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={selectedEvent}
        onEdit={handleEditClick}
        onDelete={handleEventDelete}
      />
    </div>
  );
}
