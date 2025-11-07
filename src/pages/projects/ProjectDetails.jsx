/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { StatusBadge } from "@/Components/StatusBadge";
import { mockProjects } from "@/lib/mockData";
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  PlayCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const mockUser = {
  id: "client-001-uuid-here",
  email: "demo@example.com",
  name: "Demo User",
};
const historyItems = [
  { id: 1, title: "Quote Sent", date: "2025-10-21", color: "bg-blue-500" },
  { id: 2, title: "Quote Approved", date: "2025-10-23", color: "bg-green-500" },
  {
    id: 3,
    title: "Project Started",
    date: "2025-10-25",
    color: "bg-amber-500",
  },
  {
    id: 4,
    title: "Final Payment",
    date: "2025-10-29",
    color: "bg-emerald-500",
  },
  {
    id: 5,
    title: "Project Completed",
    date: "2025-11-01",
    color: "bg-green-700",
  },
  {
    id: 6,
    title: "Feedback Received",
    date: "2025-11-03",
    color: "bg-purple-500",
    description: "Client provided initial feedback on deliverables.",
  },
  {
    id: 7,
    title: "Revisions Submitted",
    date: "2025-11-05",
    color: "bg-orange-500",
    description: "Revised deliverables sent for client review.",
  },
];

export default function ProjectDetails() {
  const [project, setProject] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    if (!mockUser) return;
    await new Promise((resolve) => setTimeout(resolve, 500)); // fake loading
    const foundProject = mockProjects.find((p) => String(p.id) === id);
    setProject(foundProject || null);
    setLoading(false);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 border-slate-200 p-4 rounded-lg">
      <div className="flex flex-row md:flex-col sm:flex-col gap-4 w-full md:w-[70%] h-full ">
        {/* the project info part  */}
        <div className="  h-[50%] rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div
              key={project.id}
              className="bg-white border border-slate-200 p-6 transition-all w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {project.name}
                </h3>
                <StatusBadge status={project.status} />
              </div>

              <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                {project.description}
              </p>

              <div className="space-y-3">
                {/* <div>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      {project.progress_percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-slate-900 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress_percentage}%` }}
                    ></div>
                  </div>
                </div> */}

                <div className="flex items-center justify-between text-sm text-slate-600 ">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.start_date).toLocaleDateString()}
                  </div>
                  {project.end_date && (
                    <div className="flex items-center">
                      Due: {new Date(project.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* the task timeline part  */}
        <div className="bg-red-500 h-[50%]">left-bottom</div>
      </div>
      {/* the history part  */}
      <div className="  border border-slate-200 p-6 rounded-2xl shadow-sm bg-white">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-semibold text-slate-800">
            Project History
          </h3>
        </div>

        <div className="relative pl-6">
          <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-slate-200"></div>
          <div className="space-y-5">
            {historyItems.map((item, index) => (
              <div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${item.color} absolute left-0 -translate-x-1.5 mt-2`}
                ></div>

                <div className="flex flex-col pl-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg p-3 w-full">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-slate-800">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(item.date)}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-sm text-slate-600">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
