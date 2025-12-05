/* eslint-disable no-unused-vars */
// ProjectViewPage.jsx
import { format } from "date-fns";
import { ArrowLeft, Edit3, CheckCircle, Clock, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProject } from "@/features/projects/hooks/useProjects";
import { StatusBadge } from "@/components/StatusBadge";

export default function ProjectViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading } = useProject(id);
  console.log(project);

  if (isLoading || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading project...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/projects/${id}/tasks`)}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                View Tasks
              </button>

              <button
                onClick={() => navigate(`/projects/${id}/edit`)}
                className="px-5 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {project.name}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">Status</p>
            </div>
            <StatusBadge status={project.status}>{project.status}</StatusBadge>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Client</p>
            <p className="text-lg font-semibold text-gray-900">
              {project.client?.name || "No client assigned"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">Start Date</p>
            </div>
            <p className="text-lg font-semibold">
              {project.start_date
                ? format(new Date(project.start_date), "MMM dd, yyyy")
                : "—"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">Estimated End</p>
            </div>
            <p className="text-lg font-semibold">
              {project.estimated_end_date
                ? format(new Date(project.estimated_end_date), "MMM dd, yyyy")
                : "—"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Invoice</p>
            <p className="text-lg font-semibold text-indigo-600">
              {project.invoice_id ? `#INV-${project.invoice_id}` : "No invoice"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <p className="text-sm font-medium text-gray-600 mb-2">Created</p>
            <p className="text-lg font-semibold">
              {format(new Date(project.created_at), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-8">
            Description
          </h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {project.description || "No description provided."}
          </p>
        </div>

        <div className="mt-10 bg-white rounded-xl shadow-sm p-8 border border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <button
              onClick={() => navigate(`/projects/${id}/tasks`)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all tasks →
            </button>
          </div>
          <p className="text-gray-600">
            Click the button above or the "View Tasks" button at the top to
            manage tasks for this project.
          </p>
        </div>
      </div>
    </div>
  );
}
