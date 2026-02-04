import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CalendarDays,
  Clock,
  Users,
  Repeat,
  Link2,
  Tag,
  FileText,
} from "lucide-react";
import { useUsers } from "@/features/settings/hooks/useUsersQuery";
import { cn } from "@/lib/utils";

function EventDetailsDialog({
  open,
  onOpenChange,
  event,
  onEdit,
  onDelete,
  onUpdate,
}) {
  const { data: usersResponse } = useUsers();
  console.log(event);
  // Normalize users data
  const users = Array.isArray(usersResponse)
    ? usersResponse
    : (usersResponse?.data ?? usersResponse?.users ?? []);

  if (!event) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime24 = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStartDateTime = () => {
    if (event.start) return event.start;
    if (event.start_date && event.start_hour) {
      return `${event.start_date}T${event.start_hour}`;
    }
    return event.start_date || null;
  };

  const getEndDateTime = () => {
    if (event.end) return event.end;
    if (event.end_date && event.end_hour) {
      return `${event.end_date}T${event.end_hour}`;
    }
    return event.end_date || event.start_date || null;
  };

  const isAllDayEvent = event.allDay ?? event.all_day ?? false;

  const start = getStartDateTime();
  const end = getEndDateTime();

  const startTime = formatTime24(start);
  const endTime = formatTime24(end);

  const showTime = !isAllDayEvent && (startTime || endTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-linear-to-b from-background to-background/95 backdrop-blur-sm border shadow-xl">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full ring-1 ring-offset-2 ring-offset-background shrink-0"
              style={{ backgroundColor: event.color || "#3b82f6" }}
            />
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {event.title || "Untitled Event"}
            </DialogTitle>
          </div>

          <DialogDescription className="flex items-center gap-2 mt-1.5 text-sm">
            <Tag className="h-3.5 w-3.5" />
            <span className="capitalize">{event.category || "—"}</span>
            <span className="text-muted-foreground">•</span>
            <span className="capitalize font-medium">
              {event.status || "—"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Date & Time */}
          <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-3 text-sm">
            <div className="flex items-start gap-2 text-muted-foreground pt-0.5">
              <CalendarDays className="h-4 w-4 mt-0.5" />
              <span>Date</span>
            </div>
            <div className="space-y-1">
              <div className="font-medium">
                {formatDate(start)}
                {start !== end && end && <> → {formatDate(end)}</>}
              </div>

              {showTime && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {startTime}
                    {endTime && startTime !== endTime && <> – {endTime}</>}
                  </span>
                  {isAllDayEvent && (
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">
                      All day
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Type & Repeat */}
            <div className="flex items-start gap-2 text-muted-foreground pt-0.5">
              <Repeat className="h-4 w-4 mt-0.5" />
              <span>Repeat</span>
            </div>
            <div className="font-medium capitalize">
              {event.repeatedly || event.recurrence || "Does not repeat"}
            </div>

            {/* Type */}
            <div className="flex items-start gap-2 text-muted-foreground pt-0.5">
              <Tag className="h-4 w-4 mt-0.5" />
              <span>Type</span>
            </div>
            <div className="font-medium capitalize">{event.type || "—"}</div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <FileText className="h-4 w-4" />
                <span>Description</span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap border-l-2 border-muted pl-3 py-0.5">
                {event.description}
              </p>
            </div>
          )}

          {/* Guests */}
          {event.guests?.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="h-4 w-4" />
                <span>Guests ({event.guests.length})</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {event.guests.map((guestId) => {
                  const user = users.find((u) => u.id === guestId);
                  const name = user?.name || user?.email || `User ${guestId}`;
                  return (
                    <div
                      key={guestId}
                      className={cn(
                        "text-xs font-medium px-2.5 py-1 rounded-full",
                        "bg-secondary text-secondary-foreground",
                        "border border-border/60",
                      )}
                    >
                      {name}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* URL */}
          {event.url && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Link2 className="h-4 w-4" />
                <span>Link</span>
              </div>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {event.url}
              </a>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onUpdate(event)}>
            Done
          </Button>
          <Button variant="outline" onClick={() => onEdit(event)}>
            Edit Event
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
