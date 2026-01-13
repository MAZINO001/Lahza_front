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
import { Input } from "@/components/ui/input";
import { TasksTable } from "@/features/tasks/components/TasksTable";
import { useParams } from "react-router-dom";
import { useProjectTeamMembers, useProjectInvoices, useProjectServices, useDeleteProjectService, useRemoveProjectTeamMember, useDeleteProjectInvoice } from "@/features/projects/hooks/useProjectSettings";
import { Loader2 } from "lucide-react";

export default function ProjectSettingsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("info");

  // Fetch data from API
  const { data: members = [], isLoading: membersLoading, error: membersError } = useProjectTeamMembers(id);
  const { data: invoices = [], isLoading: invoicesLoading, error: invoicesError } = useProjectInvoices(id);
  const { data: services = [], isLoading: servicesLoading, error: servicesError } = useProjectServices(id);

  // Mutations
  const deleteServiceMutation = useDeleteProjectService();
  const removeTeamMemberMutation = useRemoveProjectTeamMember();
  const deleteInvoiceMutation = useDeleteProjectInvoice();

  const [editingMember, setEditingMember] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Note: These functions would need to be connected to mutations for full CRUD functionality
  const removeMember = (memberId) => {
    // Extract the user ID from the team member data
    const member = members.find(m => m.id === memberId);
    const userId = member?.team_user?.user_id;
    if (userId) {
      removeTeamMemberMutation.mutate({ projectId: id, userId });
    }
  };

  const removeInvoice = (invoiceId) => {
    deleteInvoiceMutation.mutate({ projectId: id, invoiceId });
  };

  const removeService = (serviceId) => {
    deleteServiceMutation.mutate({ projectId: id, serviceId });
  };

  const updateMember = (id, field, value) => {
    // TODO: Implement update mutation
    console.log("Update member:", id, field, value);
  };

  const updateInvoice = (id, field, value) => {
    // TODO: Implement update mutation
    console.log("Update invoice:", id, field, value);
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
            <CardHeader className="px-0">
              <CardTitle>Project Members</CardTitle>
              <CardDescription>
                Manage team members assigned to this project
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {membersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading team members...</span>
                </div>
              ) : membersError ? (
                <div className="p-4 text-center text-sm text-destructive">
                  Failed to load team members. Please try again.
                </div>
              ) : members.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No team members found for this project.
                </div>
              ) : (
                members.map((member) => {
                  const teamUser = member.team_user?.user;
                  const teamInfo = member.team_user;
                  return (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex-1">
                        {editingMember === member.id ? (
                          <div className="space-y-2">
                            <Input
                              value={teamUser?.name || ''}
                              onChange={(e) =>
                                updateMember(member.id, "name", e.target.value)
                              }
                              placeholder="Name"
                              className="h-8 text-sm"
                            />
                            <Input
                              value={teamInfo?.poste || ''}
                              onChange={(e) =>
                                updateMember(member.id, "role", e.target.value)
                              }
                              placeholder="Role"
                              className="h-8 text-sm"
                            />
                            <Input
                              value={teamUser?.email || ''}
                              onChange={(e) =>
                                updateMember(member.id, "email", e.target.value)
                              }
                              placeholder="Email"
                              className="h-8 text-sm"
                            />
                          </div>
                        ) : (
                          <>
                            <p className="font-medium text-sm">{teamUser?.name || 'Unknown'}</p>
                            <p className="text-xs text-muted-foreground">
                              {teamInfo?.poste || 'No role specified'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {teamUser?.email || 'No email'}
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
                        ></Button>
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
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* INVOICES CARD */}
          <Card className="p-4">
            <CardHeader className="px-0">
              <CardTitle>Project Invoices</CardTitle>
              <CardDescription>
                Manage invoices associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {invoicesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading invoices...</span>
                </div>
              ) : invoicesError ? (
                <div className="p-4 text-center text-sm text-destructive">
                  Failed to load invoices. Please try again.
                </div>
              ) : invoices.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No invoices found for this project.
                </div>
              ) : (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      {editingInvoice === invoice.id ? (
                        <div className="space-y-2">
                          <Input
                            value={`INV-${invoice.id}`}
                            onChange={(e) =>
                              updateInvoice(invoice.id, "number", e.target.value)
                            }
                            placeholder="Invoice Number"
                            className="h-8 text-sm"
                          />
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              value={invoice.total_amount || ''}
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
                              value={invoice.invoice_date || ''}
                              onChange={(e) =>
                                updateInvoice(invoice.id, "date", e.target.value)
                              }
                              placeholder="Date"
                              type="date"
                              className="h-8 text-sm"
                            />
                            <Input
                              value={invoice.status || ''}
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
                          <p className="font-medium text-sm">INV-{invoice.id}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-muted-foreground">
                              ${invoice.total_amount || '0.00'}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}
                            >
                              {invoice.status || 'Unknown'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {invoice.invoice_date || 'No date'}
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
                      ></Button>
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
                ))
              )}
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader className="px-0 ">
              <CardTitle>Related Services</CardTitle>
              <CardDescription>
                Add or remove services associated with this project
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-3">
              {servicesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading services...</span>
                </div>
              ) : servicesError ? (
                <div className="p-4 text-center text-sm text-destructive">
                  Failed to load services. Please try again.
                </div>
              ) : services.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No services found for this project.
                </div>
              ) : (
                services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          ${service.pivot?.individual_total || service.base_price || '0.00'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Qty: {service.pivot?.quantity || 1}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {service.status || 'Active'}
                        </span>
                      </div>
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
                ))
              )}
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
