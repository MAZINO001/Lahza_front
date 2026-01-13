/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  User,
  Download,
  RefreshCw,
  BarChart3,
  Users,
  TrendingUp,
  Mail,
  Phone,
  MessageSquare,
  Edit,
  Trash2,
  Archive,
  Flag,
  MoreHorizontal,
  Paperclip,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  useDeleteTicket,
  useTickets,
} from "@/features/tickets/hooks/useTickets";

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "urgent":
      return "bg-red-200 text-red-900 border-red-300";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
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

export default function AdminTicketsPage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterAssigned, setFilterAssigned] = useState("all");
  const [selectedTickets, setSelectedTickets] = useState([]);

  const { data: tickets } = useTickets();

  // Calculate statistics
  const stats = {
    total: tickets?.length,
    open: tickets?.filter((t) => t.status === "open").length,
    inProgress: tickets?.filter((t) => t.status === "in_progress").length,
    resolved: tickets?.filter((t) => t.status === "resolved").length,
    urgent: tickets?.filter((t) => t.priority === "urgent").length,
    unassigned: tickets?.filter((t) => t.user.name === "Unassigned").length,
    avgResolutionTime: "2.5 hours",
    satisfactionRate: 4.2,
  };

  const filteredTickets = tickets?.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user?.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || ticket.category === filterCategory;
    const matchesAssigned =
      filterAssigned === "all" ||
      (filterAssigned === "unassigned" && ticket.user.name === "Unassigned") ||
      (filterAssigned === "assigned" && ticket.user.name !== "Unassigned");

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority &&
      matchesCategory &&
      matchesAssigned
    );
  });
  const deleteTicket = useDeleteTicket();
  const handleDeleteTicket = async (ticketId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this ticket? This action cannot be undone."
      )
    ) {
      try {
        await deleteTicket.mutate(ticketId);
        // Ticket will be automatically removed from the list due to React Query cache invalidation
      } catch (error) {
        // Error is already handled by the hook with toast notification
        console.error("Failed to delete ticket:", error);
      }
    }
  };

  const handleViewTicket = (ticketId) => {
    navigate(`/${role}/ticket/${ticketId}`);
  };

  const handleBulkAction = (action) => {
    if (selectedTickets?.length === 0) {
      toast.error("Please select tickets first");
      return;
    }

    toast.success(`${action} ${selectedTickets?.length} ticket(s)`);
    setSelectedTickets([]);
  };

  const handleExportTickets = () => {
    toast.success("Exporting tickets to CSV...");
  };

  const handleRefresh = () => {
    toast.success("Tickets refreshed");
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets?.length === filteredTickets?.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets?.map((t) => t.id));
    }
  };

  return (
    <div className="w-full  space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Tickets
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Open & In Progress
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.open + stats.inProgress}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  urgent Issues
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.urgent}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Unassigned
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {stats.unassigned}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets, customers, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">resolved</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Priority</option>
              <option value="urgent">urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Categories</option>
              <option value="website">Website</option>
              <option value="hosting">Hosting</option>
              <option value="billing">Billing</option>
              <option value="general">General</option>
            </select>
            <select
              value={filterAssigned}
              onChange={(e) => setFilterAssigned(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Assignment</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTickets?.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 p-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-800">
                  {selectedTickets?.length} ticket(s) selected
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Assign")}
                >
                  <User className="h-4 w-4 mr-2" />
                  Assign
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Update Status")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("Delete")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No tickets found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                filterStatus !== "all" ||
                filterPriority !== "all" ||
                filterCategory !== "all" ||
                filterAssigned !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "No tickets in the system yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="p-0 ">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedTickets?.length === filteredTickets?.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-muted-foreground">
                    Select All ({filteredTickets?.length})
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Cards */}
            {filteredTickets?.map((ticket) => (
              <Card
                key={ticket.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedTickets?.includes(ticket.id)}
                        onChange={() => handleSelectTicket(ticket.id)}
                        className="rounded border-border mt-1"
                      />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {ticket.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status.replace("-", " ")}
                              </Badge>
                              <Badge
                                className={getPriorityColor(ticket.priority)}
                              >
                                {ticket.priority}
                              </Badge>
                              <Badge
                                className={getCategoryColor(ticket.category)}
                              >
                                {ticket.category}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Ticket Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">
                            #{ticket.id}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {ticket.user?.name}
                            </p>
                            <p className="text-muted-foreground">
                              {ticket.user?.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">
                              {ticket.assigned_to?.name || "Unassigned"}
                            </p>
                            <p className="text-muted-foreground">
                              {ticket.assigned_to?.role || "No assignee"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        {ticket.attachments > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Paperclip className="h-3 w-3" />
                            <span>{ticket.attachments} attachment(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
