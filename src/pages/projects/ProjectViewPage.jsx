/* eslint-disable no-unused-vars */
import { Edit3, CheckCircle, CalendarIcon, Database } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useMarkAsComplete,
  useProject,
  useProjectProgress,
} from "@/features/projects/hooks/useProjects";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/hooks/AuthContext";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useTasks } from "@/features/tasks/hooks/useTasksQuery";
import GanttComponent from "@/features/projects/components/GanttComponent";
import Comments from "@/components/client_components/Client_page/comments/Comments";
import TimelineComponent from "@/components/timeline";
import { useProjectHistory } from "@/features/projects/hooks/useProjectHistory";
import { useClient } from "@/features/clients/hooks/useClientsQuery";
import { Calendar } from "@/components/ui/calendar";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileText, Paperclip, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountDownComponent from "@/features/projects/components/CountDownComponent";
import { StatusBadge } from "@/components/StatusBadge";
import { ChartBarDefault } from "@/features/projects/components/overViewChart";

export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const { data: project, isLoading } = useProject(id);
  const { data: additionalData } = useAdditionalData(id);
  const { data: history } = useProjectHistory(id);
  const { data: tasks } = useTasks(id);

  console.log("additionalData", additionalData);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      // year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

  const doneTasks = tasks.filter((task) => task.status === "done").length || 0;

  const clientId = project?.client_id;

  const { data: client } = useClient(clientId);

  let destination = "";
  if (!additionalData) {
    destination = "additional-data/new";
  } else {
    destination = "additional-data";
  }

  const { data: progress, isLoading: progressLoading } = useProjectProgress(id);

  const [completionPercentage, setCompletionPercentage] = useState(0);
  useEffect(() => {
    const percentage = progress?.accumlated_percentage || 0;
    setCompletionPercentage(percentage);
  }, [progress]);

  const navigate = useNavigate();
  const useMarkCompleteMutate = useMarkAsComplete();
  const handleMarkAsComplete = (projectId) => {
    useMarkCompleteMutate.mutate(
      { id: projectId, data: { status: "completed" } },
      {
        onSuccess: () => {
          navigate(-1);
        },
      }
    );
  };

  const [dateRange, setDateRange] = useState({
    from: project?.start_date ? new Date(project.start_date) : new Date(),
    to: project?.estimated_end_date
      ? new Date(project.estimated_end_date)
      : new Date(),
  });

  useEffect(() => {
    if (project?.start_date && project?.estimated_end_date) {
      const startDate = new Date(project.start_date);
      const endDate = new Date(project.estimated_end_date);

      // Only update if dates are valid
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        setDateRange({
          from: startDate,
          to: endDate,
        });
      }
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  // *********************************
  const demoMembers = [
    { id: 1, name: "Alice Johnson", role: "Project Manager", avatar: "AJ" },
    { id: 2, name: "Bob Smith", role: "Developer", avatar: "BS" },
    { id: 3, name: "Carol White", role: "Designer", avatar: "CW" },
    { id: 4, name: "David Brown", role: "QA", avatar: "DB" },
  ];

  const demoTransactions = [
    {
      id: 1,
      type: "expense",
      description: "Software licenses",
      amount: "$500",
      date: "2025-01-15",
    },
    {
      id: 2,
      type: "payment",
      description: "Team payment",
      amount: "$2,500",
      date: "2025-01-10",
    },
    {
      id: 3,
      type: "expense",
      description: "Infrastructure costs",
      amount: "$350",
      date: "2025-01-05",
    },
    {
      id: 4,
      type: "payment",
      description: "Contractor payment",
      amount: "$1,200",
      date: "2024-12-28",
    },
  ];

  const demoAttachments = [
    { id: 1, name: "Project_Proposal.pdf", size: "2.4 MB", date: "2025-01-20" },
    { id: 2, name: "Design_Mockups.figma", size: "5.1 MB", date: "2025-01-18" },
    {
      id: 3,
      name: "Budget_Spreadsheet.xlsx",
      size: "1.2 MB",
      date: "2025-01-15",
    },
    { id: 4, name: "Meeting_Notes.docx", size: "340 KB", date: "2025-01-10" },
  ];

  const demoProject = {
    name: "Website Redesign",
    description:
      "Complete redesign of the company website including new UI/UX, improved performance, and enhanced mobile responsiveness. This project involves collaboration with design and development teams to deliver a modern, user-friendly interface.",
    status: "In Progress",
    progress: 65,
    budget: "$15,000",
    spent: "$9,750",
    start_date: "2025-01-01",
    estimated_end_date: "2025-03-31",
  };

  // *********************************
  const categories = [
    {
      label: "Design",
      icon: "✨",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    },
    {
      label: "Development",
      icon: "⚙️",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    },
    {
      label: "Marketing",
      icon: "📢",
      color: "bg-green-100 text-green-700 border-green-200",
    },
    {
      label: "Analytics",
      icon: "📊",
      color: "bg-orange-100 text-orange-700 border-orange-200",
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4 rounded-xl text-foreground flex w-full items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Project Preview</h1>
          <p className="text-md opacity-90">
            A quick overview of the project, its goal, and what it delivers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleMarkAsComplete(project.id)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Done
          </Button>

          <Link to={`/${role}/project/${id}/${destination}`}>
            <Button className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Additional Data
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex gap-4 w-full">
        <div className="w-[75%] h-full flex flex-col gap-4">
          <div className="flex items-end justify-end p-2 h-60 bg-background rounded-lg border border-border relative overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70"
              style={{
                backgroundImage: "url(https://picsum.photos/800/800)",
              }}
            />

            <div className=" bg-background/40 rounded-md flex items-center justify-between w-full p-2 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src="https://picsum.photos/800/800"
                  alt="Profile"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-foreground">
                      Client Name
                    </span>
                    <span className="inline-flex px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      Development
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    Project Name
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Started at
                </span>
                <span className="font-medium text-foreground">10/12/2025</span>
              </div>

              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Ends at
                </span>
                <span className="font-medium text-foreground">10/12/2025</span>
              </div>
            </div>
          </div>

          <Card className="w-full p-2 flex-1  h-[40%]">
            <CardContent className="h-full p-2">
              <Tabs defaultValue="overview" className="h-full flex flex-col">
                <TabsList className="mb-2 grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="h-full overflow-auto">
                  <div className="space-y-4">
                    <ChartBarDefault
                      startDate={project.start_date}
                      endDate={project.estimated_end_date}
                      projectId={id}
                      tasks={tasks}
                    />
                  </div>
                </TabsContent>
                <TabsContent
                  value="description"
                  className="h-full overflow-auto"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 ">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">
                          Project Description
                        </h3>
                      </div>
                      <div>
                        <StatusBadge status={project?.status}>
                          {project?.status}
                        </StatusBadge>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {project?.description}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="members" className="h-full overflow-auto">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground mb-4">
                      Team Members ({demoMembers?.length})
                    </h3>
                    <div className="space-y-3">
                      {demoMembers?.map((member) => (
                        <div
                          key={member?.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {member?.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {member?.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {member?.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="transactions"
                  className="h-full overflow-auto"
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground mb-4">
                      Transactions
                    </h3>
                    <div className="space-y-2">
                      {demoTransactions.map((tx) => (
                        <div
                          key={tx?.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {tx?.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {tx?.date}
                            </p>
                          </div>
                          <span
                            className={`text-sm font-semibold ${tx?.type === "payment" ? "text-success" : "text-destructive"}`}
                          >
                            {tx?.type === "payment" ? "+" : "-"} {tx?.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="attachments"
                  className="h-full overflow-auto"
                >
                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Paperclip className="w-5 h-5" /> Files (
                      {demoAttachments.length})
                    </h3>
                    <div className="space-y-2">
                      {demoAttachments.map((file) => (
                        <div
                          key={file?.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg border hover:bg-accent transition-colors cursor-pointer"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {file?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file?.size} • {file?.date}
                            </p>
                          </div>
                          <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                            Download
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history" className="h-full overflow-auto">
                  <TimelineComponent data={history} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="p-2 h-[40%]">
            <CardContent value="gantt" className="h-full  p-2">
              <GanttComponent tasks={tasks} projectId={id} />
            </CardContent>
          </Card>
        </div>

        <div className="w-[25%] flex flex-col gap-4">
          <div className="flex flex-col gap-4 w-full">
            <Card className="p-2 w-full">
              <CardContent className="p-2">
                <CountDownComponent
                  startDate={project?.start_date}
                  endDate={project?.estimated_end_date}
                />
              </CardContent>
            </Card>
            <Card className="p-2 w-full">
              <CardContent className="p-2 flex">
                <div className="text-3xl font-bold text-foreground">
                  {doneTasks || 0}/{tasks.length || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Tasks completed this month
                </p>
              </CardContent>
            </Card>
          </div>
          <Card className="p-2 w-full h-full">
            <CardContent className="p-2">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                disabled={() => true}
                numberOfMonths={1}
                className="w-full! flex justify-center rounded-lg border shadow-sm"
              />
            </CardContent>
          </Card>

          <Card className="p-2">
            <CardContent className="p-2">
              <Comments type={"project"} currentId={id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
