/* eslint-disable no-unused-vars */
// ProjectViewPage.jsx
import { format } from "date-fns";
import { ArrowLeft, Edit3, CheckCircle, Clock, Calendar } from "lucide-react";
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
import { useAuthContext } from "@/hooks/AuthContext";
export default function ProjectViewPage() {
  const { id } = useParams();
  const { role } = useAuthContext();
  const { data: project, isLoading } = useProject(id);
  console.log(project);

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
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="w-17 h-17 rounded-xl overflow-hidden shadow-md ring-2 ring-gray-100 transition-all duration-200">
                  <img
                    src={project.logo}
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
                  <Edit3 className="w-4 h-4" />
                  Edit Tasks
                </Button>
              </Link>
              <Link>
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
            <CardTitle>progress bar</CardTitle>
          </CardHeader>
          <CardContent>addition data wil be here</CardContent>
        </Card>
        <Card className="mt-4" style={{ height: "30vh" }}>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <div className="w-full h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <p className="text-gray-400 text-sm">
                Gantt Chart Component will be placed here
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
