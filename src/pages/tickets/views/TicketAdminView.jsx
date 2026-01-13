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
  Reply,
  Forward,
  Archive,
  Flag,
  PaperclipIcon,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  useTicket,
  useTicketsLegacy,
} from "@/features/tickets/hooks/useTickets";
import { useTeams } from "@/features/settings";
import { Controller, useForm } from "react-hook-form";
import SelectField from "@/components/Form/SelectField";
const categoryIcons = {
  website: "🐛",
  hosting: "🖥️",
  billing: "💳",
  general: "💬",
};

const statusColors = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-red-100 text-red-800",
  urgent: "bg-red-200 text-red-900",
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
  const {
    control,
    formState: { errors },
  } = useForm();

  const { data: teamsMembers } = useTeams();

  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const { data: ticket, isLoading } = useTicket(id);
  const { updateTicket } = useTicketsLegacy();

  const [selectedAssignee, setSelectedAssignee] = useState(
    ticket?.assigned_to?.id || ""
  );

  useEffect(() => {
    if (ticket?.assigned_to?.id) {
      setSelectedAssignee(ticket.assigned_to.id);
    }
  }, [ticket]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateTicket(id, { status: newStatus });
      toast.success(`Ticket status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Status update error:", error);
    }
  };

  const handleAssignTicket = async (assignedTo) => {
    try {
      await updateTicket(id, { assigned_to: assignedTo });
      setSelectedAssignee(assignedTo);
    } catch (error) {
      console.error("Assignment error:", error);
    }
  };

  const handleArchiveTicket = async () => {
    try {
      await updateTicket(id, { status: "resolved" });
      navigate("/admin/settings/tickets_management");
    } catch (error) {
      console.error("Archive error:", error);
    }
  };

  const handleDownloadAttachment = async (ticketId, fileId, fileName) => {
    try {
      const response = await fetch(
        `/api/tickets/${ticketId}/download/${fileId}`
      );

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  if (isLoading) {
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

  if (!ticket) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-96">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <p className="text-lg text-destructive">Ticket not found</p>
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
              {ticket.status.replace("_", " ").toUpperCase()}
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
                  {ticket.user?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.user?.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.user?.phone}
                </p>
                {ticket.user?.company && (
                  <p className="text-sm text-muted-foreground">
                    Company: {ticket.user?.company}
                  </p>
                )}
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(ticket.user?.email);
                    toast.success("Customer email copied to clipboard!");
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  copy Email Customer
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
                  {ticket.assigned_to?.name || "Unassigned"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.assigned_to?.role || "No assignee"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ticket.assigned_to?.email || "No email"}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <SelectField
                  label="Choose a team member"
                  id="user_id"
                  value={selectedAssignee}
                  onChange={handleAssignTicket}
                  options={
                    teamsMembers?.data?.map((member) => ({
                      value: member.user?.id || member.id,
                      label: member.user?.name || member.name,
                    })) || []
                  }
                  placeholder="Select team member"
                />
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {ticket.file && ticket.file.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ticket.file.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <PaperclipIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">
                            {attachment.original_name ||
                              `attachment_${attachment.id}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {attachment.size
                              ? `${(attachment.size / 1024).toFixed(1)} KB`
                              : "File"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDownloadAttachment(
                              ticket.id,
                              attachment.id,
                              attachment.original_name ||
                                `file_${attachment.id}`
                            )
                          }
                        >
                          <Download className="h-4 w-4" />
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
                  onClick={() => handleStatusChange("in_progress")}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Working
                </Button>
              )}
              {ticket.status === "in_progress" && (
                <Button
                  size="sm"
                  onClick={() => handleStatusChange("resolved")}
                  className="w-full"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as resolved
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleArchiveTicket}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
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
                    {new Date(ticket.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
