import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getActivityTitle = (tableName) => {
  const titles = {
    payments: "Payment Activity",
    emails: "Email Sent",
    projects: "Project Activity",
    invoices: "Invoice Activity",
    quotes: "Quote Activity",
    clients: "Client Update",
  };
  return titles[tableName] || "Activity";
};

export default function Component({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-1">No History Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          There are no history records available for this client at the moment.
        </p>
      </div>
    );
  }

  return (
    <Timeline>
      {data?.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="sm:group-data-[orientation=vertical]/timeline:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="sm:group-data-[orientation=vertical]/timeline:absolute sm:group-data-[orientation=vertical]/timeline:-left-32 sm:group-data-[orientation=vertical]/timeline:w-20 sm:group-data-[orientation=vertical]/timeline:text-right">
              {formatDate(item.created_at)}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">
              {getActivityTitle(item.table_name, item.action)}
            </TimelineTitle>
            <TimelineIndicator className="bg-blue-500" />
          </TimelineHeader>
          <TimelineContent>
            <div className="space-y-1">
              {item.new_values && (
                <p className="text-sm text-foreground">{item.new_values}</p>
              )}
              {!item.new_values && item.old_values && (
                <p className="text-sm text-foreground">{item.old_values}</p>
              )}
              {!item.new_values && !item.old_values && (
                <p className="text-sm text-muted-foreground">
                  Activity recorded
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                <span className="capitalize">{item.user_role}</span>
                <span>•</span>
                <span>{item.device}</span>
              </div>
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
