/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { mockProjectTasks, mockInvoices } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";

const mockUser = {
  id: "client-001-uuid-here",
  email: "demo@example.com",
  name: "Demo User",
};

const services = ["Hosting", "Logo Design", "Web App Creation"];

export default function ProjectInfo() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [projects, setProjects] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [mockUser]);

  const loadDashboardData = async () => {
    if (!mockUser) return;
    setTasks(mockProjectTasks);
    setInvoices(mockInvoices);
    setLoading(false);
  };

  const activeProjects = projects.filter(
    (p) => p.status === "in_progress" || p.status === "planning"
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[75%_25%] gap-4">
      {/* Project Overview */}
      <Card className="border shadow-sm py-4 px-4">
        {/* <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Lahza Web App</CardTitle>
              <CardDescription>
                Overview of current project progress.
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>12/12/20</span>
              <span>→</span>
              <span>01/02/21</span>
            </div>
          </div>
        </CardHeader> */}

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
                          <h4 className="text-sm font-medium">{task.title}</h4>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-xs text-muted-foreground">
                          <StatusBadge status={task.status} />
                          <span>Assigned to: {task.assigned_to}</span>
                          <span>
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </span>
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

      {/* Calendar Side */}
      <Card className="p-4 sticky top-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Calendar</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full [&_button]:h-8 [&_button]:w-8"
        />
      </Card>
    </div>
  );
}
