import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  useDeleteTicket,
  useTickets,
} from "@/features/tickets/hooks/useTickets";
import EmptySearch1 from "@/components/empty-search-1";
import { Label } from "@/components/ui/label";
import SelectField from "@/components/Form/SelectField";
import FormField from "@/components/Form/FormField";
import { cn } from "@/lib/utils";
import { formatId } from "@/lib/utils/formatId";

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

  console.log("Tickets:", tickets);
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
    try {
      await deleteTicket.mutate(ticketId);
      // Ticket will be automatically removed from the list due to React Query cache invalidation
    } catch (error) {
      // Error is already handled by the hook with toast notification
      console.error("Failed to delete ticket:", error);
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
        : [...prev, ticketId],
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets?.length === filteredTickets?.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets?.map((t) => t.id));
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priority" },
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "website", label: "Website" },
    { value: "hosting", label: "Hosting" },
    { value: "billing", label: "Billing" },
    { value: "general", label: "General" },
  ];

  const assignedOptions = [
    { value: "all", label: "All Assignment" },
    { value: "assigned", label: "Assigned" },
    { value: "unassigned", label: "Unassigned" },
  ];

  return (
    <div className="w-full p-4  space-y-4 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none bg-card/60 backdrop-blur-sm hover:bg-card transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Tickets</p>
                <p className="mt-1.5 text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/60 backdrop-blur-sm hover:bg-card transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Open & In Progress
                </p>
                <p className="mt-1.5 text-2xl font-bold">
                  {stats.open + stats.inProgress}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-500/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/60 backdrop-blur-sm hover:bg-card transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Urgent Issues</p>
                <p className="mt-1.5 text-2xl font-bold">{stats.urgent}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500/70" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-card/60 backdrop-blur-sm hover:bg-card transition-colors">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Unassigned</p>
                <p className="mt-1.5 text-2xl font-bold">{stats.unassigned}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500/70" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-[50%]">
              <Label
                htmlFor="search"
                className="text-sm font-medium text-foreground block "
              >
                Search
              </Label>
              <div className="w-full">
                <FormField
                  id="search"
                  placeholder="Search tickets, customers, or emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 min-w-[150px]">
              <SelectField
                id="status-filter"
                label="Status"
                value={filterStatus}
                onChange={setFilterStatus}
                options={statusOptions}
                placeholder="All Status"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <SelectField
                id="priority-filter"
                label="Priority"
                value={filterPriority}
                onChange={setFilterPriority}
                options={priorityOptions}
                placeholder="All Priority"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <SelectField
                id="category-filter"
                label="Category"
                value={filterCategory}
                onChange={setFilterCategory}
                options={categoryOptions}
                placeholder="All Categories"
              />
            </div>

            <div className="flex-1 min-w-[150px]">
              <SelectField
                id="assigned-filter"
                label="Assignment"
                value={filterAssigned}
                onChange={setFilterAssigned}
                options={assignedOptions}
                placeholder="All Assignment"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedTickets?.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent>
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

      <div className="space-y-6">
        {filteredTickets?.length === 0 ? (
          searchTerm ||
          filterStatus !== "all" ||
          filterPriority !== "all" ||
          filterCategory !== "all" ||
          filterAssigned !== "all" ? (
            <EmptySearch1 />
          ) : (
            <Card className="border-border bg-card/60">
              <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tickets found
                </h3>
                <p className="text-base text-muted-foreground">
                  There are no tickets in the system yet.
                </p>
              </CardContent>
            </Card>
          )
        ) : (
          <>
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="flex items-center gap-3 py-3 px-4">
                <Checkbox
                  id="select-all"
                  checked={selectedTickets?.length === filteredTickets?.length}
                  onCheckedChange={handleSelectAll}
                  className="h-5 w-5 rounded border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium text-muted-foreground cursor-pointer"
                >
                  Select All ({filteredTickets?.length})
                </label>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredTickets?.map((ticket) => (
                <Card
                  key={ticket.id}
                  className={cn(
                    "border-border bg-card shadow-sm hover:shadow-md transition-shadow",
                    selectedTickets?.includes(ticket.id) &&
                      "ring-2 ring-primary/50",
                  )}
                >
                  <CardContent>
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <Checkbox
                        checked={selectedTickets?.includes(ticket.id)}
                        onCheckedChange={() => handleSelectTicket(ticket.id)}
                        className="mt-1.5 h-5 w-5 rounded border-input data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-foreground truncate">
                                {ticket.title}
                              </h3>

                              <div className="flex flex-wrap gap-2">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "px-2.5 py-0.5 text-xs font-medium",
                                    getStatusColor(ticket.status),
                                  )}
                                >
                                  {ticket.status.replace("-", " ")}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "px-2.5 py-0.5 text-xs font-medium",
                                    getPriorityColor(ticket.priority),
                                  )}
                                >
                                  {ticket.priority}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "px-2.5 py-0.5 text-xs font-medium",
                                    getCategoryColor(ticket.category),
                                  )}
                                >
                                  {ticket.category}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {ticket.description}
                            </p>
                          </div>

                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewTicket(ticket.id)}
                              className="gap-1.5"
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTicket(ticket.id);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-muted-foreground">
                              {formatId(ticket.id, "TICKET")}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <time className="text-muted-foreground">
                              {new Date(ticket.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </time>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {ticket.user?.name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {ticket.assigned_to?.name || "Unassigned"}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {ticket.assigned_to?.role || "No assignee"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {ticket.attachments > 0 && (
                          <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Paperclip className="h-3.5 w-3.5" />
                            <span>
                              {ticket.attachments} attachment
                              {ticket.attachments > 1 ? "s" : ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
