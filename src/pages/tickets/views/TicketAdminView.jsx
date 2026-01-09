/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Paperclip,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pause,
  Play,
  Download,
  Eye,
  Reply,
  Forward,
  Archive,
  Flag,
  PaperclipIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";

const mockTicketData = {
  "TKT-001": {
    id: "TKT-001",
    title: "Login page not loading properly",
    description:
      "Users are reporting that the login page is stuck on loading screen. This issue started happening after the latest deployment. Multiple users have reported this issue across different browsers and devices. The loading spinner appears indefinitely and never completes the authentication process.",
    category: "website",
    subcategory: "bug",
    status: "open",
    priority: "high",
    createdAt: "2024-01-08T10:30:00Z",
    updatedAt: "2024-01-08T14:45:00Z",
    createdBy: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      avatar: null,
    },
    assignedTo: {
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Senior Developer",
    },
    attachments: [
      { name: "screenshot-loading.png", size: 245760, type: "image/png" },
      { name: "browser-console.log", size: 1536, type: "text/plain" },
    ],
    tags: ["urgent", "frontend", "authentication"],
    internalNotes:
      "Issue appears to be related to the new authentication middleware. Investigating the token refresh mechanism.",
    resolution: null,
    resolutionTime: null,
    estimatedTime: "2-3 hours",
    actualTime: null,
  },
  "TKT-002": {
    id: "TKT-002",
    title: "Payment method update request",
    description:
      "Customer wants to update their payment method on file. They need to change from credit card to bank transfer for their monthly subscription. They've provided their new banking details and want this changed before the next billing cycle.",
    category: "billing",
    subcategory: "payment",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-01-07T09:15:00Z",
    updatedAt: "2024-01-08T11:20:00Z",
    createdBy: {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1-555-0124",
      avatar: null,
    },
    assignedTo: {
      name: "Mike Wilson",
      email: "mike.w@company.com",
      role: "Billing Specialist",
    },
    attachments: [
      { name: "bank-details.pdf", size: 524288, type: "application/pdf" },
    ],
    tags: ["billing", "payment-method", "customer-request"],
    internalNotes:
      "Customer verified identity through security questions. Awaiting payment processor confirmation.",
    resolution: null,
    resolutionTime: null,
    estimatedTime: "1 hour",
    actualTime: "45 minutes",
  },
};

const statusColors = {
  open: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
  critical: "bg-red-200 text-red-900",
};

const categoryIcons = {
  website: "🐛",
  hosting: "🖥️",
  billing: "💳",
  general: "💬",
};

const getCategoryColor = (category) => {
  switch (category) {
    case "website":
      return "bg-red-50 text-red-700 border-red-200";
    case "hosting":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "billing":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "general":
      return "bg-green-50 text-green-700 border-green-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function TicketAdminView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicketData = () => {
      setLoading(true);

      setTimeout(() => {
        const ticketData = mockTicketData[id];
        if (ticketData) {
          setTicket(ticketData);
        } else {
          toast.error("Ticket not found");
          navigate("/admin/settings/tickets_management");
        }
        setLoading(false);
      }, 1000);
    };

    loadTicketData();
  }, [id, navigate]);

  const handleStatusChange = (newStatus) => {
    setTicket((prev) => ({
      ...prev,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }));
    toast.success(`Ticket status updated to ${newStatus}`);
  };

  const handleAssignTicket = () => {
    toast.success("Ticket assigned successfully");
  };

  const handleDeleteTicket = () => {
    if (
      confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    ) {
      toast.success("Ticket deleted successfully");
      navigate("/admin/settings/tickets_management");
    }
  };

  const handleDownloadAttachment = (attachment) => {
    toast.success(`Downloading ${attachment.name}`);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-muted-foreground">
            Loading ticket details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-4">
      {/* Header */}
      <Button
        variant="ghost"
        onClick={() => navigate("/admin/settings/tickets_management")}
      >
        <ArrowLeft className="h-4 w-4" />
        return
      </Button>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex  items-center justify-between w-full gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {ticket.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              Ticket ID: {ticket.id}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge className={statusColors[ticket.status]}>
              {ticket.status.replace("-", " ").toUpperCase()}
            </Badge>
            <Badge className={priorityColors[ticket.priority]}>
              {ticket.priority.toUpperCase()} PRIORITY
            </Badge>
            <Badge variant="outline">
              {categoryIcons[ticket.category]}{" "}
              {ticket.category.charAt(0).toUpperCase() +
                ticket.category.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {/* Status and Priority Badges */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Ticket Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {ticket.createdBy.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.createdBy.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.createdBy.phone}
                </p>
                {ticket.createdBy.company && (
                  <p className="text-sm text-muted-foreground">
                    Company: {ticket.createdBy.company}
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Customer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {ticket.assignedTo.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.assignedTo.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.assignedTo.email}
                </p>
              </div>
              <Separator />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAssignTicket}
                className="w-full"
              >
                Reassign
              </Button>
            </CardContent>
          </Card>

          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {attachment.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {(attachment.size / 1024).toFixed(1)} KB •{" "}
                            {attachment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadAttachment(attachment)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ticket.status === "open" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("in-progress")}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Working
                </Button>
              )}
              {ticket.status === "in-progress" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("resolved")}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
              )}
              <Button variant="outline" size="sm" className="w-full">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </CardContent>
          </Card>

          {/* Time Tracking */}
          <Card>
            <CardHeader>
              <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Estimated:
                </span>
                <span className="text-sm font-medium">
                  {ticket.estimatedTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Actual:</span>
                <span className="text-sm font-medium">
                  {ticket.actualTime || "Not tracked"}
                </span>
              </div>
              <Separator />
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Tags */}
          {ticket.tags && ticket.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
