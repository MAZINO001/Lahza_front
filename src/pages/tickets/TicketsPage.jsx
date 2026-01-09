import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  User
} from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";

const mockTickets = [
  {
    id: "TKT-001",
    title: "Login page not loading properly",
    description: "Users are reporting that the login page is stuck on loading screen",
    category: "website",
    status: "open",
    priority: "high",
    createdAt: "2024-01-08",
    updatedAt: "2024-01-08",
    createdBy: "John Doe"
  },
  {
    id: "TKT-002",
    title: "Payment method update request",
    description: "Customer wants to update their payment method on file",
    category: "billing",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-01-07",
    updatedAt: "2024-01-08",
    createdBy: "Jane Smith"
  },
  {
    id: "TKT-003",
    title: "Server downtime notification",
    description: "Scheduled maintenance for server upgrade",
    category: "hosting",
    status: "resolved",
    priority: "low",
    createdAt: "2024-01-06",
    updatedAt: "2024-01-07",
    createdBy: "Admin"
  },
  {
    id: "TKT-004",
    title: "Feature request: Dark mode support",
    description: "User requesting dark mode for better accessibility",
    category: "general",
    status: "open",
    priority: "low",
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
    createdBy: "Mike Johnson"
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case "open": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200";
    case "resolved": return "bg-green-100 text-green-800 border-green-200";
    case "closed": return "bg-gray-100 text-gray-800 border-gray-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-800 border-red-200";
    case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
    case "low": return "bg-gray-100 text-gray-800 border-gray-200";
    case "critical": return "bg-red-200 text-red-900 border-red-300";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryColor = (category) => {
  switch (category) {
    case "website": return "bg-red-50 text-red-700 border-red-200";
    case "hosting": return "bg-orange-50 text-orange-700 border-orange-200";
    case "billing": return "bg-blue-50 text-blue-700 border-blue-200";
    case "general": return "bg-green-50 text-green-700 border-green-200";
    default: return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

export default function TicketsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus;
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTicket = () => {
    navigate("/client/ticket/new");
  };

  const handleViewTicket = (ticketId) => {
    const { role } = useAuthContext();
    navigate(`/${role}/ticket/${ticketId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
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
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tickets found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterStatus !== "all" || filterPriority !== "all"
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
            <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{ticket.title}</h3>
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
                        <span>{ticket.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created {ticket.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {ticket.updatedAt}</span>
                      </div>
                    </div>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {filteredTickets.length > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredTickets.length} of {mockTickets.length} tickets
          </p>
        </div>
      )}
    </div>
  );
}
