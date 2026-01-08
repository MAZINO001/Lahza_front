import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { TasksForm } from "@/features/tasks/components/TasksForm";
import { Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TasksTable } from "@/features/tasks/components/TasksTable";
import { useParams } from "react-router-dom";

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("info");
  const [members, setMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      role: "Project Manager",
      email: "john@example.com",
    },
    { id: 2, name: "Jane Smith", role: "Developer", email: "jane@example.com" },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 1,
      number: "INV-001",
      amount: 5000,
      status: "Paid",
      date: "2024-01-15",
    },
    {
      id: 2,
      number: "INV-002",
      amount: 3500,
      status: "Pending",
      date: "2024-01-20",
    },
  ]);

  const [services, setServices] = useState([
    {
      id: 1,
      name: "Web Development",
      description: "Frontend and backend development",
    },
    {
      id: 2,
      name: "UI/UX Design",
      description: "User interface and experience design",
    },
  ]);

  const [editingMember, setEditingMember] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  const removeMember = (id) => setMembers(members.filter((m) => m.id !== id));
  const removeInvoice = (id) =>
    setInvoices(invoices.filter((i) => i.id !== id));
  const removeService = (id) =>
    setServices(services.filter((s) => s.id !== id));

  const updateMember = (id, field, value) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const updateInvoice = (id, field, value) => {
    setInvoices(
      invoices.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="w-full bg-background p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="grid w-[40%] grid-cols-3 mb-2">
          <TabsTrigger value="info">Project Information</TabsTrigger>
          <TabsTrigger value="parameters">Project Parameters</TabsTrigger>
          <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card className="p-4">
            <CardHeader className="px-0">
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                View and edit basic project information
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <ProjectForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card className="p-4">
            <CardHeader className="px-0 mb-4">
              <CardTitle>Project Members</CardTitle>
              <CardDescription>
                Manage team members assigned to this project
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    {editingMember === member.id ? (
                      <div className="space-y-2">
                        <Input
                          value={member.name}
                          onChange={(e) =>
                            updateMember(member.id, "name", e.target.value)
                          }
                          placeholder="Name"
                          className="h-8 text-sm"
                        />
                        <Input
                          value={member.role}
                          onChange={(e) =>
                            updateMember(member.id, "role", e.target.value)
                          }
                          placeholder="Role"
                          className="h-8 text-sm"
                        />
                        <Input
                          value={member.email}
                          onChange={(e) =>
                            updateMember(member.id, "email", e.target.value)
                          }
                          placeholder="Email"
                          className="h-8 text-sm"
                        />
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.role}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingMember(
                          editingMember === member.id ? null : member.id
                        )
                      }
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMember(member.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* INVOICES CARD */}
          <Card className="p-4">
            <CardHeader className="px-0 mb-4">
              <CardTitle>Project Invoices</CardTitle>
              <CardDescription>
                Manage invoices associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    {editingInvoice === invoice.id ? (
                      <div className="space-y-2">
                        <Input
                          value={invoice.number}
                          onChange={(e) =>
                            updateInvoice(invoice.id, "number", e.target.value)
                          }
                          placeholder="Invoice Number"
                          className="h-8 text-sm"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            value={invoice.amount}
                            onChange={(e) =>
                              updateInvoice(
                                invoice.id,
                                "amount",
                                e.target.value
                              )
                            }
                            placeholder="Amount"
                            type="number"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={invoice.date}
                            onChange={(e) =>
                              updateInvoice(invoice.id, "date", e.target.value)
                            }
                            placeholder="Date"
                            type="date"
                            className="h-8 text-sm"
                          />
                          <Input
                            value={invoice.status}
                            onChange={(e) =>
                              updateInvoice(
                                invoice.id,
                                "status",
                                e.target.value
                              )
                            }
                            placeholder="Status"
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium text-sm">{invoice.number}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            ${invoice.amount}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}
                          >
                            {invoice.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {invoice.date}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEditingInvoice(
                          editingInvoice === invoice.id ? null : invoice.id
                        )
                      }
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInvoice(invoice.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="px-0 mb-4">
              <CardTitle>Related Services</CardTitle>
              <CardDescription>
                Add or remove services associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(service.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card className="p-4">
            <CardHeader className="px-0">
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>Manage tasks for this project</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <TasksForm projectId={id} />
            </CardContent>
          </Card>
          <Card className="p-0 overflow-hidden">
            <CardContent className="px-4">
              <TasksTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
