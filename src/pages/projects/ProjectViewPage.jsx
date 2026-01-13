/* eslint-disable no-unused-vars */
import {
  CheckCircle,
  Database,
  CreditCard,
  Building2,
  Wallet,
  Copy,
  Check,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useMarkAsComplete,
  useProject,
  useProjectProgress,
  useProjectTeam,
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

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import CountDownComponent from "@/features/projects/components/CountDownComponent";
import { StatusBadge } from "@/components/StatusBadge";
import { ChartBarDefault } from "@/features/projects/components/overViewChart";
import { useTransActions } from "@/features/payments/hooks/usePaymentQuery";
import { formatId } from "@/lib/utils/formatId";

export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();

  const { data: project, isLoading } = useProject(id);
  const { data: projectTeam } = useProjectTeam(id);
  const { data: additionalData } = useAdditionalData(id);
  const { data: history } = useProjectHistory(id);
  const { data: tasks } = useTasks(id);
  const { data: transactions } = useTransActions(id);

  const doneTasks = tasks?.filter((task) => task.status === "done").length || 0;

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

  // Helper functions to parse additionalData
  const getAllFiles = () => {
    if (!additionalData?.project_additional_data?.[0]) return [];

    const data = additionalData.project_additional_data[0];
    const files = [];

    // Parse media_files
    if (data.media_files) {
      try {
        const mediaFiles = JSON.parse(data.media_files);
        mediaFiles.forEach((file, index) => {
          files.push({
            name: `Media File ${index + 1}`,
            filename: file.split("/").pop(),
            path: file,
            type: "media",
          });
        });
      } catch (e) {
        console.error("Error parsing media_files:", e);
      }
    }

    // Parse specification_file
    if (data.specification_file) {
      try {
        const specFiles = JSON.parse(data.specification_file);
        specFiles.forEach((file, index) => {
          files.push({
            name: `Specification File ${index + 1}`,
            filename: file.split("/").pop(),
            path: file,
            type: "specification",
          });
        });
      } catch (e) {
        console.error("Error parsing specification_file:", e);
      }
    }

    // Add logo if exists
    if (data.logo) {
      files.push({
        name: "Logo",
        filename: data.logo.split("/").pop(),
        path: data.logo,
        type: "logo",
      });
    }

    // Parse other files
    if (data.other) {
      try {
        const otherFiles = JSON.parse(data.other);
        otherFiles.forEach((file, index) => {
          files.push({
            name: `Other File ${index + 1}`,
            filename: file.split("/").pop(),
            path: file,
            type: "other",
          });
        });
      } catch (e) {
        console.error("Error parsing other files:", e);
      }
    }

    return files;
  };

  const getAllFilesCount = () => {
    return getAllFiles().length;
  };

  // Copy RIB function for bank payments
  const copyRIB = () => {
    const rib = "Your RIB Number Here"; // Replace with actual RIB
    navigator.clipboard
      .writeText(rib)
      .then(() => {
        toast.success("RIB copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy RIB");
      });
  };

  // Handle Stripe payment redirect
  const handleStripePayment = (paymentUrl) => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    } else {
      toast.error("Payment URL not available");
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
          {role !== "client" && (
            <Button
              onClick={() => handleMarkAsComplete(project.id)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Done
            </Button>
          )}

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
                      {client?.name || "Client Name"}
                    </span>
                    <span className="inline-flex px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      Development
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-muted-foreground">
                    {project?.name || "Project Name"}
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
                  <div className="space-y-4">
                    <ChartBarDefault
                      startDate={project.start_date}
                      endDate={project.estimated_end_date}
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
                      Team Members ({projectTeam?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {projectTeam?.map((teamMember) => (
                        <div
                          key={teamMember?.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg border  transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9">
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {teamMember?.team_user?.name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "TM"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {teamMember?.team_user?.user?.name}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {teamMember?.team_user?.poste}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {teamMember?.team_user?.department ||
                                "Development"}
                            </p>
                          </div>
                        </div>
                      )) || (
                          <p className="text-muted-foreground text-center py-4">
                            No team members found
                          </p>
                        )}
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
                      {transactions?.map((tx) => (
                        <div
                          key={tx?.id}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg border transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-all hover:scale-105 ${tx?.payment_url
                                  ? "hover:bg-blue-100"
                                  : tx?.payment_method === "bank"
                                    ? "hover:bg-green-100"
                                    : "hover:bg-gray-100"
                                }`}
                              onClick={() => {
                                if (tx?.payment_url) {
                                  handleStripePayment(tx.payment_url);
                                } else if (tx?.payment_method === "bank") {
                                  copyRIB();
                                }
                              }}
                              title={
                                tx?.payment_url
                                  ? "Go to payment"
                                  : tx?.payment_method === "bank"
                                    ? "Copy RIB"
                                    : "Payment details"
                              }
                            >
                              {tx?.payment_url ? (
                                <CreditCard className="w-6 h-6 text-primary" />
                              ) : tx?.payment_method === "bank" ? (
                                <Building2 className="w-6 h-6 text-primary" />
                              ) : (
                                <Wallet className="w-6 h-6 text-primary" />
                              )}
                            </div>
                            <div className="flex flex-col gap-4">
                              <p className="text-sm font-medium text-foreground">
                                <Link
                                  to={`/${role}/invoice/${tx?.invoice_id}`}
                                  className="hover:underline"
                                >
                                  {formatId(tx?.invoice_id, "INVOICE")} -{" "}
                                </Link>
                                {tx?.percentage}% Payment
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {tx?.payment_method?.toUpperCase() || "OTHER"} •
                                {tx?.payment_method === "bank" && (
                                  <span
                                    className="ml-2 text-blue-600 hover:text-blue-700 cursor-pointer items-center gap-1 inline-flex"
                                    onClick={copyRIB}
                                  >
                                    <Copy className="w-3 h-3" />
                                    Copy RIB
                                  </span>
                                )}
                                {tx?.payment_url && (
                                  <span
                                    className="ml-2 text-blue-600 hover:text-blue-700 cursor-pointer inline-flex"
                                    onClick={() =>
                                      handleStripePayment(tx.payment_url)
                                    }
                                  >
                                    Pay Now
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span
                              className={`text-sm font-semibold ${tx?.status === "paid" ? "text-green-600" : "text-red-600"}`}
                            >
                              {tx?.status === "paid" ? "Paid" : "Pending"}
                            </span>
                            <p className="text-sm font-medium text-foreground">
                              {tx?.currency?.toUpperCase() || "MAD"}{" "}
                              {tx?.amount || "0"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              of {tx?.currency?.toUpperCase() || "MAD"}{" "}
                              {tx?.total || "0"}
                            </p>
                          </div>
                        </div>
                      )) || (
                          <p className="text-muted-foreground text-center py-4">
                            No transactions found
                          </p>
                        )}
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
                      {getAllFilesCount()})
                    </h3>
                    <div className="space-y-2">
                      {getAllFiles().map((file, index) => (
                        <div
                          key={file?.id || index}
                          className="flex items-center justify-between p-3 bg-secondary rounded-lg border  transition-colors cursor-pointer"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {file?.name ||
                                file?.filename ||
                                `File ${index + 1}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {file?.size &&
                                `${(file.size / 1024 / 1024).toFixed(1)} MB`}{" "}
                              •{" "}
                              {file?.date || file?.created_at
                                ? formatDate(file.date || file.created_at)
                                : "N/A"}
                            </p>
                          </div>
                          <span className="text-xs bg-secondary text-foreground px-2 py-1 rounded">
                            Download
                          </span>
                        </div>
                      )) || (
                          <p className="text-muted-foreground text-center py-4">
                            No attachments found
                          </p>
                        )}
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
              <GanttComponent tasks={tasks} projectId={id} role={role} />
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
            <Card className="w-full p-0 bg-background">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
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

          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            disabled={() => true}
            numberOfMonths={1}
            className="w-full! flex justify-center rounded-lg border"
          />

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
