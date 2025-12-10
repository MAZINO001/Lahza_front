/* eslint-disable react-hooks/rules-of-hooks */
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
import { useProject } from "@/features/projects/hooks/useProjects";
import { StatusBadge } from "@/components/StatusBadge";
import { useState } from "react";
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
export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const { data: project, isLoading } = useProject(id);
  const { data: additionalData } = useAdditionalData(id);

  let destination = "";
  if (!additionalData) {
    destination = "additional-data/new";
  } else {
    destination = "additional-data";
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading project...</p>
      </div>
    );
  }

  // *******************************************************
  // TESTING ZONE
  const mockTasks = [
    { id: 1, title: "Design Homepage", status: "completed", percentage: 100 },
    { id: 2, title: "Setup Database", status: "completed", percentage: 100 },
    { id: 3, title: "API Integration", status: "in_progress", percentage: 60 },
    { id: 4, title: "Testing Phase", status: "pending", percentage: 0 },
    { id: 5, title: "Deployment", status: "pending", percentage: 0 },
  ];
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Alice",
      date: "2025-12-10",
      text: "Initial project setup done.",
    },
    {
      id: 2,
      user: "Bob",
      date: "2025-12-11",
      text: "Added main Gantt chart component.",
    },
  ]);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        user: "You",
        date: new Date().toLocaleDateString(),
        text: newComment,
      },
    ]);
    setNewComment("");
  };

  const [history, setHistory] = useState([
    { id: 1, date: "2025-12-09", user: "Alice", action: "Created the project" },
    {
      id: 2,
      date: "2025-12-10",
      user: "Bob",
      action: "Added Gantt chart",
    },
    {
      id: 3,
      date: "2025-12-11",
      user: "Alice",
      action: "Updated timeline",
    },
  ]);

  // *******************************************************

  const totalTasks = mockTasks.length;
  const completedTasks = mockTasks.filter(
    (task) => task.status === "completed"
  ).length;

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white border-b shadow-sm">
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
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {project.name}
                  </h1>
                </div>
                <StatusBadge status={project.statu} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to={`/${role}/project/${id}/tasks`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" />
                  Tasks
                </Button>
              </Link>
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

      <div className="max-w-7xl p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Client Name</p>
                <p className="text-gray-900 font-medium">Admin User</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <a
                  // href={`mailto:${project.client.email}`}
                  className="inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  admin@lahza.com
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {project.description ||
                  "No description available for this project."}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Additional Data</CardTitle>
          </CardHeader>
          <CardContent>addition data wil be here</CardContent>
        </Card>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-blue-600">
                {completionPercentage}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 h-70 p-0">
          <CardContent className="h-full p-4">
            <Tabs defaultValue="gantt" className="h-full flex flex-col">
              <TabsList className="mb-2">
                <TabsTrigger value="gantt">Gantt</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="gantt" className="h-full">
                <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    Gantt Chart Component will be placed here
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="h-full overflow-auto">
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-auto p-2 space-y-2">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gray-100 p-2 rounded-md"
                      >
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>{comment.user}</span>
                          <span>{comment.date}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 flex gap-2">
                    <textarea
                      className="flex-1 p-2 border rounded-md resize-none text-sm"
                      rows={2}
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="history" className="h-full overflow-auto">
                <div className="w-full overflow-x-auto py-6">
                  <div className="relative flex items-center min-w-max">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>

                    {history.map((item, idx) => {
                      const isAbove = idx % 2 === 0;
                      return (
                        <div
                          key={item.id}
                          className="flex flex-col items-center px-8 relative"
                        >
                          <div
                            className={`text-center w-32 ${
                              isAbove ? "mb-5 order-1" : "mt-4 order-2"
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-800">
                              {item.action}
                            </p>
                            <p className="text-xs text-gray-500">{item.user}</p>
                            <p className="text-xs text-gray-400">{item.date}</p>
                          </div>

                          <div className="w-4 h-4 mb-18 bg-blue-500 rounded-full z-10 order-2"></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
