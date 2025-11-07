"use client";

import { useState } from "react";
import { HeadphonesIcon, Plus, Send } from "lucide-react";
import { StatusBadge } from "@/Components/StatusBadge";
import { mockTickets, mockMessages } from "@/lib/mockData";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Tickets() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketMessages, setTicketMessages] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "technique", // 'service', 'facturation', 'technique'
    priority: "medium", // 'low', 'medium', 'high', 'urgent'
    message: "",
  });

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    const messagesForTicket = mockMessages.filter(
      (m) => m.ticketId === ticket.id
    );
    setTicketMessages(messagesForTicket);
  };

  const handleCreateTicket = () => {
    const ticketId = Date.now().toString();
    const newTicketObj = {
      id: ticketId,
      ticket_number: `TK-${ticketId}`,
      subject: newTicket.subject,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "open",
      created_at: new Date().toISOString(),
    };
    setTickets([newTicketObj, ...tickets]);

    if (newTicket.message) {
      setTicketMessages([
        ...ticketMessages,
        {
          id: Date.now().toString(),
          ticketId: ticketId,
          message: newTicket.message,
          is_staff: false,
          created_at: new Date().toISOString(),
        },
      ]);
    }

    setShowCreateModal(false);
    setNewTicket({
      subject: "",
      category: "technique",
      priority: "medium",
      message: "",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const msg = {
      id: Date.now().toString(),
      ticketId: selectedTicket.id,
      message: newMessage,
      is_staff: false,
      created_at: new Date().toISOString(),
    };
    setTicketMessages([...ticketMessages, msg]);
    setNewMessage("");
  };

  return (
    <div className="space-y-4 py-4 px-4">
      {/* Header */}
      <div className="rounded-xl flex items-center justify-between space-y-4">
        <Input
          placeholder="Search tickets..."
          className="max-w-md w-full mb-0"
          onChange={(e) => {
            const query = e.target.value.toLowerCase();
            const filtered = mockTickets.filter(
              (ticket) =>
                ticket.subject.toLowerCase().includes(query) ||
                ticket.ticket_number.toLowerCase().includes(query)
            );
            setTickets(filtered);
          }}
        />
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Ticket
        </Button>
      </div>

      {/* No tickets */}
      {tickets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <HeadphonesIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            No support tickets
          </h3>
          <p className="text-slate-600 mb-4">
            Create a ticket to get help from our team
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center mx-auto"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Ticket
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => handleViewTicket(ticket)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">
                    {ticket.subject}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {ticket.ticket_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <StatusBadge status={ticket.status} />
                <StatusBadge status={ticket.priority} />
              </div>
              <div className="text-xs text-slate-500">
                Created {new Date(ticket.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <Input
              placeholder="Subject"
              value={newTicket.subject}
              onChange={(e) =>
                setNewTicket({ ...newTicket, subject: e.target.value })
              }
            />
            <Textarea
              placeholder="Message"
              rows={4}
              value={newTicket.message}
              onChange={(e) =>
                setNewTicket({ ...newTicket, message: e.target.value })
              }
            />

            <Select
              value={newTicket.category}
              onValueChange={(value) =>
                setNewTicket({ ...newTicket, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="facturation">Facturation</SelectItem>
                <SelectItem value="technique">Technique</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newTicket.priority}
              onValueChange={(value) =>
                setNewTicket({ ...newTicket, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                disabled={!newTicket.subject || !newTicket.message}
                onClick={handleCreateTicket}
              >
                Create Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Chat Modal */}
      {selectedTicket && (
        <Dialog
          open={!!selectedTicket}
          onOpenChange={() => setSelectedTicket(null)}
        >
          <DialogContent className="sm:max-w-4xl rounded-2xl h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedTicket.subject}</DialogTitle>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-sm text-slate-600">
                  {selectedTicket.ticket_number}
                </span>
                <StatusBadge status={selectedTicket.status} />
                <StatusBadge status={selectedTicket.priority} />
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {ticketMessages.length === 0 ? (
                <p className="text-center text-slate-500 py-8">
                  No messages yet
                </p>
              ) : (
                ticketMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_staff ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-4 ${
                        message.is_staff
                          ? "bg-slate-100"
                          : "bg-slate-900 text-white"
                      }`}
                    >
                      <p className="text-sm mb-2">{message.message}</p>
                      <p
                        className={`text-xs ${message.is_staff ? "text-slate-500" : "text-slate-300"}`}
                      >
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex space-x-3 mt-4">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="flex items-center"
              >
                <Send className="w-4 h-4 mr-2" /> Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
