import { CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";

const meetings = [
  {
    day: "TUE",
    date: 10,
    title: "Client call — Riad Zitoun",
    type: "Meeting",
    muted: true,
  },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
];

export default function UpcomingMeetingsCard() {
  return (
    <Card className="rounded-xl border border-border/60 bg-background overflow-hidden h-full">
      <CardHeader>
        <CardTitle>Upcoming</CardTitle>
        <CardDescription>March 2026</CardDescription>
      </CardHeader>

      <CardContent className="divide-y divide-border/40 overflow-y-auto max-h-[420px]">
        {meetings.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors",
              m.muted && "opacity-40",
            )}
          >
            {/* Day + Date */}
            <div className="flex flex-col items-center w-8 shrink-0">
              <span className="text-xs text-muted-foreground uppercase">
                {m.day}
              </span>
              <span className="text-base font-bold leading-tight">
                {m.date}
              </span>
            </div>

            {/* Title + badge */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.title}</p>
              <Badge
                variant="outline"
                className="mt-1 h-5 px-1.5 text-xs bg-blue-500/10 text-blue-400 border-blue-500/30"
              >
                {m.type}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
