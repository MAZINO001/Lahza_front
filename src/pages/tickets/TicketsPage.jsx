import { useState } from "react";
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
  Trash,
} from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  useTicketsLegacy,
  useDeleteTicket,
  useUpdateTicket,
} from "@/features/tickets/hooks/useTickets";
import { toast } from "sonner";

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "low":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "urgent":
      return "bg-red-200 text-red-900 border-red-300";
    case "critical":
      return "bg-red-200 text-red-900 border-red-300";
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

export default function TicketsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignment, setFilterAssignment] = useState("all");
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const { role } = useAuthContext();
  const { data: tickets = [], loading, error } = useTicketsLegacy();
  const deleteTicket = useDeleteTicket();
  const updateTicket = useUpdateTicket();

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || ticket.priority === filterPriority;
    const matchesAssignment =
      filterAssignment === "all" ||
      (filterAssignment === "assigned" && ticket.assigned_to !== null) ||
      (filterAssignment === "unassigned" && ticket.assigned_to === null);

    return (
      matchesSearch && matchesStatus && matchesPriority && matchesAssignment
    );
  });

  const handleCreateTicket = () => {
    navigate("/client/ticket/new");
  };

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
    navigate(`/${role}/ticket/${ticketId}/edit`);
  };

  const handleEditTicket = (ticketId) => {
    navigate(`/${role}/ticket/${ticketId}/edit`);
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTickets([]);
      setSelectAll(false);
    } else {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id));
      setSelectAll(true);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTickets.length === 0) {
      toast.error("No tickets selected");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ${selectedTickets.length} ticket(s)? This action cannot be undone.`
      )
    ) {
      try {
        for (const ticketId of selectedTickets) {
          await deleteTicket.mutate(ticketId);
        }
        setSelectedTickets([]);
        setSelectAll(false);
        toast.success(
          `Deleted ${selectedTickets.length} ticket(s) successfully`
        );
      } catch (error) {
        toast.error("Failed to delete tickets");
        console.error("Bulk delete error:", error);
      }
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedTickets.length === 0) {
      toast.error("No tickets selected");
      return;
    }

    try {
      for (const ticketId of selectedTickets) {
        await updateTicket.mutate(ticketId, { status: newStatus });
      }
      setSelectedTickets([]);
      setSelectAll(false);
      toast.success(
        `Updated ${selectedTickets.length} ticket(s) to ${newStatus}`
      );
    } catch (error) {
      toast.error("Failed to update tickets");
      console.error("Bulk status update error:", error);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Support Tickets
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your support tickets in one place
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={handleCreateTicket}>
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tickets..."
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
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterAssignment}
              onChange={(e) => setFilterAssignment(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">All Assignment</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
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
                filterPriority !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first support ticket"}
              </p>
              <Button onClick={handleCreateTicket}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="hover:shadow-md transition-shadow cursor-pointer w-full"
              onClick={() => handleEditTicket(ticket.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-3 w-full">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={() => handleSelectTicket(ticket.id)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <div className="flex-1 ">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground text-lg">
                          {ticket.title}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {ticket.priority}
                          </Badge>
                          <Badge className={getCategoryColor(ticket.category)}>
                            {ticket.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {ticket.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">#{ticket.id}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{ticket.user?.name || "Unknown"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            Created{" "}
                            {new Date(ticket.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            Updated{" "}
                            {new Date(ticket.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewTicket(ticket.id);
                        }}
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
