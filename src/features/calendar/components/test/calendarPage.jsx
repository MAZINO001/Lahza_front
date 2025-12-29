// /* eslint-disable no-unused-vars */
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import listPlugin from "@fullcalendar/list";
// import interactionPlugin from "@fullcalendar/interaction";
// import { useState } from "react";
// // Import shadcn components for modals, buttons, etc.
// import { Button } from "@/components/ui/button";
// import EventForm from "./EventForm";
// import EventDetailsDialog from "./EventDetailsDialog";
// import "./calendar.css";
// import { Plus } from "lucide-react";
// import {
//   useCreateEvent,
//   useDeleteEvent,
//   useEvents,
//   useUpdateEvent,
// } from "../../hooks/useCalendarQuery";

// export default function CalendarPage() {
//   const { data: events } = useEvents();
//   const [open, setOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   const handleDateClick = (arg) => {
//     setSelectedDate(arg.date);
//     setOpen(true);
//   };

//   const handleEventCreate = (newEventOrEvents) => {
//     const createMutation = useCreateEvent();

//     const eventsToCreate = Array.isArray(newEventOrEvents)
//       ? newEventOrEvents
//       : [newEventOrEvents];

//     eventsToCreate.forEach((event) => {
//       createMutation.mutate(event);
//     });
//   };

//   const handleEventClick = (info) => {
//     const event = events.find((e) => e.id === parseInt(info.event.id));
//     if (event) {
//       setSelectedEvent(event);
//       setDetailsOpen(true);
//     }
//   };

//   const handleEventEdit = (event) => {
//     const updateMutation = useUpdateEvent();

//     updateMutation.mutate(
//       { id: event.id, data: event },
//       {
//         onSuccess: () => {
//           setDetailsOpen(false);
//         },
//       }
//     );
//   };

//   const handleEventDelete = (event) => {
//     if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
//       const deleteMutation = useDeleteEvent();

//       deleteMutation.mutate(
//         { id: event.id },
//         {
//           onSuccess: () => {
//             setDetailsOpen(false);
//           },
//         }
//       );
//     }
//   };

//   const handleEventPreview = (event) => {
//     console.log("Preview event:", event);
//   };

//   return (
//     <div className="calendar-container min-h-[800px]">
//       <div className="flex justify-end items-center">
//         <div className="flex gap-4 items-center absolute top-4">
//           <Button onClick={() => setOpen(true)}>
//             <Plus className="w-4 h-4" />
//             New event
//           </Button>
//         </div>
//       </div>

//       <div className="calendar-container">
//         <FullCalendar
//           plugins={[
//             dayGridPlugin,
//             timeGridPlugin,
//             listPlugin,
//             interactionPlugin,
//           ]}
//           initialView="dayGridMonth"
//           firstDay={1} // 1 = Monday, 0 = Sunday
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
//           }}
//           events={events.map((event) => {
//             const { url, ...eventWithoutUrl } = event;
//             return {
//               ...eventWithoutUrl,
//               id: event.id?.toString() || Date.now().toString(),
//               className: `fc-event-${event.category?.toLowerCase() || "default"}`,
//               "data-category": event.category,
//             };
//           })}
//           dateClick={handleDateClick}
//           eventClick={handleEventClick}
//           height="auto"
//         />
//       </div>

//       <EventForm
//         open={open}
//         onOpenChange={setOpen}
//         selectedDate={selectedDate}
//         onEventCreate={handleEventCreate}
//       />

//       <EventDetailsDialog
//         open={detailsOpen}
//         onOpenChange={setDetailsOpen}
//         event={selectedEvent}
//         onEdit={handleEventEdit}
//         onDelete={handleEventDelete}
//         onPreview={handleEventPreview}
//       />
//     </div>
//   );
// }

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
} from "../../hooks/useCalendarQuery";
import { processRepeatingEvents } from "../../utils/repeatEventProcessor";

export default function CalendarPage() {
  const { data: events } = useEvents();
  const createMutation = useCreateEvent(); // ✅ Move hook to top level
  const updateMutation = useUpdateEvent(); // ✅ Move hook to top level
  const deleteMutation = useDeleteEvent(); // ✅ Move hook to top level

  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Process events to handle repeating patterns
  const processedEvents = processRepeatingEvents(events);

  const handleDateClick = (arg) => {
    setSelectedDate(arg.date);
    setOpen(true);
  };

  const handleEventCreate = (newEventOrEvents) => {
    const eventsToCreate = Array.isArray(newEventOrEvents)
      ? newEventOrEvents
      : [newEventOrEvents];

    eventsToCreate.forEach((event) => {
      console.log(event);
      createMutation.mutate(event);
    });
  };

  const handleEventClick = (info) => {
    const event = events?.find((e) => e.id === parseInt(info.event.id));
    if (event) {
      setSelectedEvent(event);
      setDetailsOpen(true);
    }
  };

  const handleEventEdit = (event) => {
    updateMutation.mutate(
      { id: event.id, data: event },
      {
        onSuccess: () => {
          setDetailsOpen(false);
        },
      }
    );
  };

  const handleEventDelete = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      deleteMutation.mutate(
        { id: event.id },
        {
          onSuccess: () => {
            setDetailsOpen(false);
          },
        }
      );
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
