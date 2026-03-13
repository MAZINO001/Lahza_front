import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const upcomingMeetings = [
  { day: "TUE", date: 10, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
  { day: "THU", date: 13, title: "Client call — Riad Zitoun", type: "Meeting" },
];

export default function UpcomingMeetingsCard() {
  // Group by date for better visual separation (optional improvement)
  const grouped = upcomingMeetings.reduce((acc, meeting) => {
    const key = `${meeting.day} ${meeting.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(meeting);
    return acc;
  }, {});

  return (
    <Card className="w-full max-w-md overflow-hidden border-border/60 shadow-sm">
      <CardHeader className="bg-muted/40 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Upcoming
          </CardTitle>
          <div className="text-sm text-muted-foreground">March 2026</div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-1">
        <div className="divide-y divide-border/60">
          {Object.entries(grouped).map(([dateKey, meetings]) => (
            <div
              key={dateKey}
              className="px-4 py-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Day pill */}
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {dateKey.split(" ")[0]}
                  </span>
                  <span className="text-2xl font-bold leading-none">
                    {dateKey.split(" ")[1]}
                  </span>
                </div>

                {/* Meetings */}
                <div className="flex-1 space-y-2.5 pt-1">
                  {meetings.map((meeting, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium leading-tight">
                          {meeting.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>Client call</span>
                          {meeting.type && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "ml-1.5 h-5 px-1.5 text-xs",
                                meeting.type === "Meeting" &&
                                  "bg-blue-50 text-blue-700 border-blue-200",
                              )}
                            >
                              {meeting.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* If you want to show there's more */}
        {upcomingMeetings.length > 5 && (
          <div className="py-3 text-center text-sm text-muted-foreground border-t">
            +{upcomingMeetings.length - 5} more events
          </div>
        )}
      </CardContent>
    </Card>
  );
}
