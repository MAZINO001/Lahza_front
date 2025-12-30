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

function EventDetailsDialog({ open, onOpenChange, event, onEdit, onDelete }) {
  const users = [
    {
      id: 1,
      name: "Monir El Amrani",
      email: "monir@demo.com",
    },
    {
      id: 2,
      name: "Yassine Benali",
      email: "yassine@demo.com",
    },
    {
      id: 4,
      name: "Omar Chraibi",
      email: "omar@demo.com",
    },
    {
      id: 5,
      name: "Khadija El Idrissi",
      email: "khadija@demo.com",
    },
    {
      id: 6,
      name: "Anas Bouzid",
      email: "anas@demo.com",
    },
    {
      id: 7,
      name: "Imane Zohra",
      email: "imane@demo.com",
    },
    {
      id: 8,
      name: "Hamza El Fassi",
      email: "hamza@demo.com",
    },
  ];
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
                {formatDate(event.start)}
                {!event.allDay && (
                  <span className="block text-xs">
                    {formatTime(event.start)}
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="text-foreground">End:</span>
              <p className="text-muted-foreground font-medium">
                {formatDate(event.end)}
                {!event.allDay && (
                  <span className="block text-xs">{formatTime(event.end)}</span>
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
                  const user = users.find((u) => u.id === guestId);
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
