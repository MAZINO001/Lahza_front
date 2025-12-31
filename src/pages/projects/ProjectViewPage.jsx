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

export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const { data: project, isLoading } = useProject(id);
  const { data: additionalData } = useAdditionalData(id);
  const { data: history } = useProjectHistory(id);
  console.log(history);
  const { data: tasks } = useTasks(id);
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      // year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };

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
        <div className="w-[60%] h-full flex flex-col gap-4">
          <Card className="flex items-center justify-center p-2 h-[10%]">
            <CardContent className="flex items-center justify-between w-full p-2">
              <div className="flex gap-2 items-center">
                <div>
                  <img
                    src="https://picsum.photos/800/800"
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover "
                  />
                </div>
                <div className="flex flex-col">
                  <span>project name</span>
                  <span>client name</span>
                </div>
              </div>
              <div className="flex gap-2 flex-col">
                <span>Created</span>
                <span>10/12/2025</span>
              </div>
              <div className="flex gap-2 flex-col">
                <span>Created</span>
                <span>10/12/2025</span>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full p-2 flex-1  h-[40%]">
            <CardContent className="h-full p-2">
              <Tabs defaultValue="overview" className="h-full flex flex-col">
                <TabsList className="mb-4 grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="attachments">Attachments</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="h-full overflow-auto">
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600">
                            Timeline
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Jan 1 - Mar 31, 2025
                        </p>
                      </div>
                      <div className="p-4 bg-linear-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-600">
                            Team Size
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {demoMembers?.length} Members
                        </p>
                      </div>
                      <div className="p-4 bg-linear-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-gray-600">
                            Budget
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {demoProject?.budget}
                        </p>
                      </div>
                      <div className="p-4 bg-linear-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-600">
                            Spent
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {demoProject?.spent}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-sm font-medium mb-3 text-gray-700">
                        Progress
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${demoProject?.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        {demoProject?.progress}% Complete
                      </p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent
                  value="description"
                  className="h-full overflow-auto"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <h3 className="font-semibold text-gray-700">
                        Project Description
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {demoProject?.description}
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Status
                      </p>
                      <Badge className="bg-blue-600">
                        {demoProject?.status}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="members" className="h-full overflow-auto">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Team Members ({demoMembers?.length})
                    </h3>
                    <div className="space-y-3">
                      {demoMembers?.map((member) => (
                        <div
                          key={member?.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-blue-600 text-white">
                                {member?.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {member?.name}
                              </p>
                              <p className="text-xs text-gray-500">
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
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-700 mb-4">
                      Transactions
                    </h3>
                    <div className="space-y-2">
                      {demoTransactions.map((tx) => (
                        <div
                          key={tx?.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {tx?.description}
                            </p>
                            <p className="text-xs text-gray-500">{tx?.date}</p>
                          </div>
                          <span
                            className={`text-sm font-semibold ${tx?.type === "payment" ? "text-green-600" : "text-red-600"}`}
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
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Paperclip className="w-5 h-5" /> Files (
                      {demoAttachments.length})
                    </h3>
                    <div className="space-y-2">
                      {demoAttachments.map((file) => (
                        <div
                          key={file?.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {file?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {file?.size} • {file?.date}
                            </p>
                          </div>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
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

        <div className="w-[40%] flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <Card className="p-2 w-full">
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  12:59:48
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Hours:Minutes:Seconds
                </p>
              </CardContent>
            </Card>
            <Card className="p-2 w-full">
              <CardContent className="p-2">
                <div className="text-3xl font-bold text-gray-900">16/30</div>
                <p className="text-xs text-gray-500 mt-2">
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
                numberOfMonths={2}
                className="w-full h-full rounded-lg border shadow-sm"
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
