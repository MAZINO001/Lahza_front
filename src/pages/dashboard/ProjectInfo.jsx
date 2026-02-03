import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { useAllTasks } from "@/features/tasks/hooks/useTasksQuery";
import { useDocuments } from "@/features/documents/hooks/useDocuments/useDocuments";

const mockUser = {
  id: "client-001-uuid-here",
  email: "demo@example.com",
  name: "Demo User",
};

const services = ["Hosting", "Logo Design", "Web App Creation"];

export default function ProjectInfo() {
  const [selectedDate, setSelectedDate] = useState(null);

  // Use real hooks to fetch data
  const { data: tasks = [], isLoading: tasksLoading, error: tasksError } = useAllTasks();
  const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError } = useDocuments("invoices");
  const { data: quotes = [], isLoading: quotesLoading, error: quotesError } = useDocuments("quotes");

  const loading = tasksLoading || invoicesLoading || quotesLoading;
  const error = tasksError || invoicesError || quotesError;

  const activeProjects = tasks.filter(
    (task) => task.status === "in_progress" || task.status === "planning"
  );
  const pendingQuotes = quotes.filter((q) => q.status === "pending");
  const pendingInvoices = invoices.filter((i) => i.status === "pending");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-4">
      <Card className="border shadow-sm py-4 px-4">
        <CardContent className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/5 rounded-xl overflow-hidden">
            <img
              src="https://picsum.photos/500/500"
              alt="Project Preview"
              className="w-full h-60 lg:h-[90%] object-cover rounded-xl"
            />
          </div>

          <div className="w-full lg:w-3/5 flex flex-col justify-between">
            <ScrollArea className="max-h-80 pr-2">
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No tasks yet
                </p>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 10).map((task) => (
                    <Card
                      key={task.id}
                      className="p-4 border hover:bg-accent transition-all"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium">{task.title || task.name}</h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-muted-foreground">
                          <StatusBadge status={task.status} />
                          {task.assigned_to && (
                            <span>Assigned to: {task.assigned_to}</span>
                          )}
                          {task.due_date && (
                            <span>
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </span>
                          )}
                          {task.project_id && (
                            <span>Project ID: {task.project_id}</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator className="my-2" />

            <div className="text-sm">
              <span className="font-semibold mr-2">Services:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {services.map((service) => (
                  <Badge key={service} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 sticky top-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Calendar</h2>
        <p>a calnedar will be here </p>
      </Card>
    </div>
  );
}
