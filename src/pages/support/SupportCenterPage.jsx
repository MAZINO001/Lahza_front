import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    Server,
    CreditCard,
    MessageSquare,
    Plus,
    Clock,
    CheckCircle,
    HelpCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

const ticketCategories = [
    {
        id: "website",
        title: "Website Issues",
        description: "Bugs, broken pages, UI problems, slow loading",
        icon: AlertCircle,
        color: "text-red-600 bg-red-50 border-red-200",
        badgeColor: "bg-red-100 text-red-800"
    },
    {
        id: "hosting",
        title: "Hosting & Server Issues",
        description: "Downtime, server errors, performance issues",
        icon: Server,
        color: "text-orange-600 bg-orange-50 border-orange-200",
        badgeColor: "bg-orange-100 text-orange-800"
    },
    {
        id: "billing",
        title: "Account & Billing Issues",
        description: "Login problems, payments, subscriptions",
        icon: CreditCard,
        color: "text-blue-600 bg-blue-50 border-blue-200",
        badgeColor: "bg-blue-100 text-blue-800"
    },
    {
        id: "general",
        title: "General Support & Feature Requests",
        description: "Questions, feedback, suggestions",
        icon: MessageSquare,
        color: "text-green-600 bg-green-50 border-green-200",
        badgeColor: "bg-green-100 text-green-800"
    }
];

const recentTickets = [
    {
        id: "TKT-001",
        title: "Login page not loading",
        category: "website",
        status: "open",
        createdAt: "2024-01-08",
        priority: "high"
    },
    {
        id: "TKT-002",
        title: "Payment method update",
        category: "billing",
        status: "resolved",
        createdAt: "2024-01-07",
        priority: "medium"
    }
];

const getStatusColor = (status) => {
    switch (status) {
        case "open": return "bg-yellow-100 text-yellow-800";
        case "in-progress": return "bg-blue-100 text-blue-800";
        case "resolved": return "bg-green-100 text-green-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

const getPriorityColor = (priority) => {
    switch (priority) {
        case "high": return "bg-red-100 text-red-800";
        case "medium": return "bg-orange-100 text-orange-800";
        case "low": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
    }
};

export default function SupportCenterPage() {
    const navigate = useNavigate();
    const { role } = useAuthContext();
    const [selectedCategory, setSelectedCategory] = useState(null);

    const handleCreateTicket = (category) => {
        navigate(`/${role}/ticket/new${category ? `?category=${category}` : ''}`);
    };

    const handleViewTicket = (ticketId) => {
        navigate(`/${role}/ticket/${ticketId}`);
    };

    const handleViewAllTickets = () => {
        navigate(`/${role}/tickets`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <HelpCircle className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-foreground">Support Center</h1>
                </div>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We're here to help! Create a support ticket and our team will get back to you as soon as possible.
                </p>
                <div className="flex gap-3 justify-center mt-4">
                    <Button
                        onClick={() => handleCreateTicket()}
                        size="lg"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Ticket
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleViewAllTickets}
                        size="lg"
                    >
                        View All Tickets
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Open Tickets</p>
                                <p className="text-2xl font-bold text-foreground">3</p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                                <p className="text-2xl font-bold text-foreground">2</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                                <p className="text-2xl font-bold text-foreground">12</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Categories */}
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Select Issue Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ticketCategories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Card
                                    key={category.id}
                                    className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${selectedCategory === category.id
                                        ? category.color
                                        : 'border-border hover:border-primary/50'
                                        }`}
                                    onClick={() => {
                                        setSelectedCategory(category.id);
                                        handleCreateTicket(category.id);
                                    }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${category.color}`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg">{category.title}</CardTitle>
                                                </div>
                                            </div>
                                            <Badge className={category.badgeColor}>
                                                Quick Create
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm">
                                            {category.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Tickets */}
            {recentTickets.length > 0 && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Tickets</h2>
                        <div className="space-y-4">
                            {recentTickets.map((ticket) => (
                                <Card key={ticket.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                                                    <Badge className={getStatusColor(ticket.status)}>
                                                        {ticket.status}
                                                    </Badge>
                                                    <Badge className={getPriorityColor(ticket.priority)}>
                                                        {ticket.priority}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <span>#{ticket.id}</span>
                                                    <span>•</span>
                                                    <span>{ticket.category}</span>
                                                    <span>•</span>
                                                    <span>{ticket.createdAt}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewTicket(ticket.id)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Help Section */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                <CardContent className="p-8 text-center">
                    <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Need immediate help?</h3>
                    <p className="text-muted-foreground mb-4">
                        Check our FAQ section or contact our support team directly for urgent matters.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline">View FAQ</Button>
                        <Button>Contact Support</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
