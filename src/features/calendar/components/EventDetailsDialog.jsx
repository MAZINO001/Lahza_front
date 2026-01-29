import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import "./calendar.css";
import { useUsers } from "@/features/settings/hooks/useUsersQuery";

function EventDetailsDialog({ open, onOpenChange, event, onEdit, onDelete }) {
  const { data: usersResponse = [] } = useUsers();

  // Debug: Log the structure of usersResponse
  console.log('Users response structure in dialog:', usersResponse);

  // Handle different possible response structures
  let usersData = [];
  if (Array.isArray(usersResponse)) {
    usersData = usersResponse;
  } else if (usersResponse && usersResponse.data && Array.isArray(usersResponse.data)) {
    usersData = usersResponse.data;
  } else if (usersResponse && usersResponse.users && Array.isArray(usersResponse.users)) {
    usersData = usersResponse.users;
  } else {
    console.warn('Unexpected users data structure in dialog:', usersResponse);
    usersData = [];
  }
  if (!event) return null;

  console.log(event);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    // Handle both ISO datetime strings and date strings
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(event.repeatedly);

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle both FullCalendar format and database format
  const getEventStart = () => {
    if (event.start) {
      return event.start; // FullCalendar format
    }
    // Database format
    if (event.start_date && event.start_hour) {
      return `${event.start_date}T${event.start_hour}`;
    }
    if (event.start_date) {
      return event.start_date;
    }
    return null;
  };

  const getEventEnd = () => {
    if (event.end) {
      return event.end; // FullCalendar format
    }
    // Database format
    if (event.end_date && event.end_hour) {
      return `${event.end_date}T${event.end_hour}`;
    }
    if (event.end_date) {
      return event.end_date;
    }
    if (event.start_date) {
      return event.start_date; // Fallback to start date
    }
    return null;
  };

  const isAllDay = () => {
    if (event.allDay !== undefined) {
      return event.allDay; // FullCalendar format
    }
    return Boolean(event.all_day); // Database format
  };

  const eventStart = getEventStart();
  const eventEnd = getEventEnd();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: event.color || "#3b82f6" }}
            />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            {event.category} • {event.status}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-foreground">Start:</span>
              <p className="text-muted-foreground font-medium">
                {formatDate(eventStart)}
                {!isAllDay() && eventStart && (
                  <span className="block text-xs">
                    {formatTime(eventStart)}
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="text-foreground">End:</span>
              <p className="text-muted-foreground font-medium">
                {formatDate(eventEnd)}
                {!isAllDay() && eventEnd && (
                  <span className="block text-xs">{formatTime(eventEnd)}</span>
                )}
              </p>
            </div>
          </div>

          {event.description && (
            <div>
              <span className="text-muted-foreground text-sm">
                Description:
              </span>
              <p className="text-muted-foreground mt-1">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Type:</span>
              <p className="text-muted-foreground font-medium capitalize">
                {event.type}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Repeat:</span>
              <p className="text-muted-foreground font-medium capitalize">
                {event.repeatedly}
              </p>
            </div>
          </div>

          {event.url && (
            <div>
              <span className="text-muted-foreground text-sm">URL:</span>
              <p className="text-blue-400 mt-1">{event.url}</p>
            </div>
          )}

          {event.guests && event.guests.length > 0 && (
            <div>
              <span className="text-muted-foreground text-sm">Guests:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {event.guests.map((guestId, index) => {
                  const user = usersData.find((u) => u.id === guestId);
                  return (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                    >
                      {user ? user.name : `ID: ${guestId}`}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(event)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(event)}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EventDetailsDialog;
