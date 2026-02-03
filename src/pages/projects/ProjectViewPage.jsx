import { CheckCircle, Database, Download, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { saveAs } from "file-saver";

import {
  useMarkAsComplete,
  useProject,
  useProjectProgress,
  useProjectTeam,
} from "@/features/projects/hooks/useProjects/useProjectsData";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/hooks/AuthContext";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useTasks } from "@/features/tasks/hooks/useTasksQuery";
import GanttComponent from "@/features/projects/components/projectView/GanttComponent";
import Comments from "@/components/client_components/Client_page/comments/Comments";
import { useProjectHistory } from "@/features/projects/hooks/useProjectHistory";
import { useClient } from "@/features/clients/hooks/useClients/useClients";
import { Calendar } from "@/components/ui/calendar";
import {
  Overview,
  Members,
  Transactions,
  Attachments,
  History,
} from "@/features/projects/components/projectView";

import { Button } from "@/components/ui/button";
import CountDownComponent from "@/features/projects/components/projectView/CountDownComponent";
import { useTransActions } from "@/features/payments/hooks/usePayments/usePaymentsData";
import { useMultipleFileSearch } from "@/features/additional_data/hooks/multipeSearchHook";
import AlertDialogConfirmation from "@/components/alert-dialog-confirmation-6";
import { StatusBadge } from "@/components/StatusBadge";
import { FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";
import api from "@/lib/utils/axios";
import { normalizeExistingFiles } from "@/utils/normalizeFiles";

export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();

  const { data: project, isLoading } = useProject(id);
  const { data: projectTeam } = useProjectTeam(id);
  const { data: additionalData } = useAdditionalData(id);
  const { data: history = [] } = useProjectHistory(id);
  const { data: tasks } = useTasks(id);
  const { data: transactions } = useTransActions(id);

  const {
    logoFiles,
    mediaFiles,
    otherFiles,
    specificFiles,
    isLoading: filesLoading,
  } = useMultipleFileSearch(
    "App\\Models\\ProjectAdditionalData",
    additionalData?.id,
  );

  const doneTasks = tasks?.filter((task) => task.status === "done").length || 0;

  const clientId = project?.client_id;

  const { data: client } = useClient(clientId);

  let destination = "";
  if (!additionalData) {
    destination = "additional-data/new";
  } else {
    destination = "additional-data";
  }

  const navigate = useNavigate();
  const useMarkCompleteMutate = useMarkAsComplete();
  const handleMarkAsComplete = (projectId) => {
    useMarkCompleteMutate.mutate(projectId, {
      onSuccess: () => {
        navigate(-1);
      },
    });
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

  const backendOrigin = (() => {
    const base = import.meta.env.VITE_BACKEND_URL;
    const fallback = "http://localhost:8000";
    if (!base) return fallback;
    try {
      const url = new URL(base);
      const origin = `${url.protocol}//${url.host}`;
      return origin || fallback;
    } catch {
      const cleaned = String(base)
        .replace(/\/api\/?$/, "")
        .replace(/\/$/, "");
      if (/^https?:\/\//i.test(cleaned)) return cleaned;
      return fallback;
    }
  })();

  const downloadFile = async (fileUrl, filename) => {
    if (!fileUrl) {
      toast.error("No file URL provided");
      return;
    }

    const safeFilename = filename || fileUrl.split("/").pop() || "download";

    try {
      const urlObj = new URL(fileUrl);
      let path = urlObj.pathname.replace(/^\/storage/, "/storage");

      const response = await api.get(path, {
        responseType: "blob",
      });

      saveAs(response.data, safeFilename);
      toast.success("file downloaded");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    return date ? formatted : "—";
  };

  const theTasks = new Array(tasks?.length);

  const TheProgress = theTasks?.length
    ? Math.round((doneTasks / tasks?.length) * 100)
    : 0;

  console.log("logoFiles", logoFiles);
  console.log("mediaFiles", mediaFiles);
  console.log("otherFiles", otherFiles);
  console.log("specificFiles", specificFiles);
  console.log("backendOrigin", backendOrigin);
  console.log("filesLoading", filesLoading);

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
          <Link to={`/${role}/project/${id}/${destination}`}>
            <Button variant="outline">
              <Database className="w-4 h-4" />
              Additional Data
            </Button>
          </Link>
          {role === "admin" && (
            <>
              <Link to={`/${role}/project/${id}/settings`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Project Settings
                </Button>
              </Link>
              <AlertDialogConfirmation
                triggerButton={
                  <Button
                    className="flex items-center gap-2"
                    title={
                      tasks?.length > 0 && doneTasks < tasks?.length
                        ? "All tasks must be completed before marking the project as done"
                        : "Mark project as complete"
                    }
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark As Done
                  </Button>
                }
                title="Mark Project as Complete?"
                description="Are you sure you want to mark this project as completed? This action will change the project status to 'done' and cannot be undone easily."
                icon={CheckCircle}
                iconBgColor="bg-green-100 dark:bg-green-900"
                iconColor="text-green-600 dark:text-green-400"
                cancelText="Cancel"
                actionText="Mark as Complete"
                onAction={() => handleMarkAsComplete(project.id)}
              />
            </>
          )}
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

            <div className=" bg-background/70 rounded-md flex items-center justify-between w-full p-2 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src="https://picsum.photos/800/800"
                  alt="Profile"
                  className="h-11 w-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-foreground">
                      {client?.client?.company || client?.client?.name}
                    </span>

                    <span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge>Development</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Development Department</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    {client?.client?.user?.name}
                  </span>
                </div>
              </div>

              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Started at
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(project?.start_date)}
                </span>
              </div>

              <div className="flex flex-col text-sm">
                <span className="text-muted-foreground text-xs uppercase tracking-wide">
                  Ends at
                </span>
                <span className="font-medium text-foreground">
                  {formatDate(project?.estimated_end_date)}
                </span>
              </div>
            </div>
          </div>

          <Card className="w-full p-2 flex-1 h-[40%]">
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
                  <Overview project={project} tasks={tasks} />
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
                  <Members
                    projectTeam={projectTeam}
                    role={role}
                    projectId={id}
                  />
                </TabsContent>
                <TabsContent
                  value="transactions"
                  className="h-full overflow-auto"
                >
                  <Transactions transactions={transactions} role={role} />
                </TabsContent>
                <TabsContent
                  value="attachments"
                  className="h-full overflow-auto"
                >
                  <Attachments
                    logoFiles={logoFiles}
                    mediaFiles={mediaFiles}
                    otherFiles={otherFiles}
                    specificFiles={specificFiles}
                    backendOrigin={backendOrigin}
                    downloadFile={downloadFile}
                    normalizeExistingFiles={normalizeExistingFiles}
                    filesLoading={filesLoading}
                  />
                </TabsContent>
                <TabsContent value="history" className="h-full overflow-auto">
                  <History history={history} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="p-2 h-[40%]">
            <CardContent value="gantt" className="h-full  p-2">
              <GanttComponent tasks={tasks} projectId={id} role={role} />
            </CardContent>
          </Card>
        </div>

        <div className="w-[25%] flex flex-col gap-4">
          <div className="flex flex-col gap-4 w-full">
            <Card>
              <CardContent>
                <CountDownComponent
                  startDate={project?.start_date}
                  endDate={project?.estimated_end_date}
                />
              </CardContent>
            </Card>
            <Card className="w-full bg-background">
              <CardContent>
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 100 100"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-blue-100"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - TheProgress / 100)}`}
                          className="text-blue-600 transition-all duration-500"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-700">
                          {TheProgress}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">
                          {doneTasks || 0}
                        </span>
                        <span className="text-lg text-muted-foreground">
                          / {tasks?.length || 0}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tasks completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tasks?.length - doneTasks || 0} remaining
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent>
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                disabled={() => true}
                numberOfMonths={1}
                className="w-full! flex justify-center rounded-lg bg-background"
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
