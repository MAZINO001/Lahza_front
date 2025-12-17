/* eslint-disable no-unused-vars */
// ProjectViewPage.jsx

import { format } from "date-fns";
import {
  ArrowLeft,
  Edit3,
  CheckCircle,
  Clock,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useProject,
  useProjectProgress,
} from "@/features/projects/hooks/useProjects";
import { StatusBadge } from "@/components/StatusBadge";
import { useEffect, useState } from "react";
import { Database, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Mail,
  ExternalLink,
  Briefcase,
  ListTodo,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthContext } from "@/hooks/AuthContext";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useTasks } from "@/features/tasks/hooks/useTasksQuery";
import GanttComponent from "@/features/projects/components/GanttComponent";
import Comments from "@/components/project_components/Comments";
import ProjectHistory from "@/components/project_components/ProjectHistory";
export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const { data: project, isLoading } = useProject(id);
  const { data: additionalData } = useAdditionalData(id);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background ">
      <div className="w-full bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-17 h-17 rounded-xl overflow-hidden shadow-md ring-2 ring-gray-100 transition-all duration-200">
                  <img
                    src={project.logo || "https://picsum.photos/600/400"}
                    alt={`${project.name} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0  rounded-xl transition-all duration-200 flex items-center justify-center opacity-0  cursor-pointer">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    {project.name}
                  </h1>
                </div>
                <StatusBadge status={project.statu} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {" "}
              <Button variant="outline" className="flex items-center gap-2">
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
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-4 w-full mb-4">
          <Card className="w-[40%]">
            <CardHeader className="flex items-start justify-between">
              <CardTitle>Client Information</CardTitle>
              <Link
                to={`/${role}/project/${id}/edit`}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Client Name
                </p>
                <p className="text-foreground font-medium">Admin User</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a className="inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  admin@lahza.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="w-[60%]">
            <CardHeader className="flex items-start justify-between">
              <CardTitle>Project Description</CardTitle>
              <Link
                to={`/${role}/project/${id}/edit`}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {project.description ||
                  "No description available for this project."}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex w-full gap-4">
          <Card className="w-[50%]">
            <CardContent className="space-y-4">
              {tasks?.map((task) => (
                <div
                  key={task.id}
                  className="bg-gray-70 border border-border p-2 rounded-md flex items-center justify-between"
                >
                  <div>
                    <span className="inline-block text-xs px-2 py-1 rounded-full min-w-70">
                      {task.title}
                    </span>
                  </div>
                  <div>
                    <span className="inline-block text-xs px-2 py-1 rounded-full">
                      <StatusBadge status={task.status} />
                    </span>
                  </div>
                  <div>
                    <span className="inline-block text-xs px-2 py-1 rounded-full">
                      {formatDate(task.start_date)}-{formatDate(task.end_date)}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="w-[50%]">
            <CardHeader>
              <CardTitle>Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {progressLoading ? (
                <p className="text-muted-foreground">Loading progress...</p>
              ) : progress?.message === "Project progress not avaible" ? (
                <p className="text-muted-foreground">No tasks available yet</p>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-blue-600">
                      {completionPercentage}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {progress?.done_tasks_count || 0} of{" "}
                      {progress?.tasks_count || 0} tasks completed
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-500"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                    <p>
                      Total Tasks:{" "}
                      <span className="font-medium text-foreground">
                        {progress?.tasks_count}
                      </span>
                    </p>
                    <p>
                      Completed:{" "}
                      <span className="font-medium text-green-600">
                        {progress?.done_tasks_count}
                      </span>
                    </p>
                    <p>
                      Pending:{" "}
                      <span className="font-medium text-red-600">
                        {progress?.tasks_count - progress?.done_tasks_count ||
                          0}
                      </span>
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="w-full mt-4 h-130 p-0">
          <CardContent className="h-full p-4">
            <Tabs defaultValue="gantt" className="h-full flex flex-col">
              <TabsList className="mb-2">
                <TabsTrigger value="gantt">Gantt</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="gantt" className="h-full">
                <GanttComponent tasks={tasks} projectId={id} />
              </TabsContent>

              <TabsContent value="comments" className="h-full overflow-auto">
                <Comments />
              </TabsContent>

              <TabsContent value="history" className="h-full overflow-auto">
                <ProjectHistory />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
