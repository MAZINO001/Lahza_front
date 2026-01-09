// src/features/tickets/hooks/useTickets.js
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
const mockTickets = [
    {
        id: 1,
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
        id: 2,
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
        id: 3,
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
        id: 4,
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

export const useTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all tickets
    const fetchTickets = async () => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setTickets(mockTickets);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    };

    // Fetch single ticket
    const fetchTicket = async (id) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            const ticket = mockTickets.find(t => t.id === id);
            if (!ticket) {
                throw new Error("Ticket not found");
            }
            return ticket;
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch ticket");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create new ticket
    const createTicket = async (ticketData) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const newTicket = {
                ...ticketData,
                id: `TKT-${Date.now()}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setTickets(prev => [newTicket, ...prev]);
            toast.success("Ticket created successfully");
            return newTicket;
        } catch (err) {
            setError(err.message);
            toast.error("Failed to create ticket");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update ticket
    const updateTicket = async (id, ticketData) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            setTickets(prev =>
                prev.map(ticket =>
                    ticket.id === id
                        ? { ...ticket, ...ticketData, updatedAt: new Date().toISOString() }
                        : ticket
                )
            );

            toast.success("Ticket updated successfully");
            return { ...ticketData, id };
        } catch (err) {
            setError(err.message);
            toast.error("Failed to update ticket");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete ticket
    const deleteTicket = async (id) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setTickets(prev => prev.filter(ticket => ticket.id !== id));
            toast.success("Ticket deleted successfully");
        } catch (err) {
            setError(err.message);
            toast.error("Failed to delete ticket");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Search tickets
    const searchTickets = async (query) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            const filtered = mockTickets.filter(ticket =>
                ticket.title.toLowerCase().includes(query.toLowerCase()) ||
                ticket.description.toLowerCase().includes(query.toLowerCase()) ||
                ticket.id.toLowerCase().includes(query.toLowerCase())
            );

            return filtered;
        } catch (err) {
            setError(err.message);
            toast.error("Failed to search tickets");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get ticket statistics
    const getTicketStats = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 200));

            const totalTickets = tickets.length;
            const openTickets = tickets.filter(t => t.status === 'open').length;
            const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
            const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
            const closedTickets = tickets.filter(t => t.status === 'closed').length;

            return {
                totalTickets,
                openTickets,
                inProgressTickets,
                resolvedTickets,
                closedTickets,
                highPriorityTickets: tickets.filter(t => t.priority === 'high').length,
                criticalPriorityTickets: tickets.filter(t => t.priority === 'critical').length,
            };
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch statistics");
            throw err;
        }
    };

    // Initialize data on mount
    useEffect(() => {
        fetchTickets();
    }, []);

    return {
        data: tickets,
        loading,
        error,
        fetchTickets,
        fetchTicket,
        createTicket,
        updateTicket,
        deleteTicket,
        searchTickets,
        getTicketStats,
    };
};