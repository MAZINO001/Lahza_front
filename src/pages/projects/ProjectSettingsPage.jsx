import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  useProjectTeamMembers,
  useProjectInvoices,
  useProjectServices,
  useDeleteProjectService,
  useRemoveProjectTeamMember,
  useDeleteProjectInvoice,
  useAssignServiceToProject,
  useAssignProjectToInvoice,
} from "@/features/projects/hooks/useProjectSettings";
import { useAddProjectAssignment } from "@/features/settings/hooks/useProjectsQuery";
import { useTeams } from "@/features/settings/hooks/useTeamsQuery";
import { useInvoicesWithoutProjects } from "@/features/documents/hooks/useDocuments/useInvoicesWithoutProjects";
import { useUpdateProject } from "@/features/settings/hooks/useProjectsQuery";
import { useProject } from "@/features/settings/hooks/useProjectsQuery";
import { useServices } from "@/features/services/hooks/useServicesData";
import { Loader2 } from "lucide-react";
import AlertDialogDestructive from "@/components/alert-dialog-destructive-1.jsx";
import FormField from "@/components/Form/FormField";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SelectField from "@/components/Form/SelectField";
import { toast } from "sonner";
import { formatId } from "@/lib/utils/formatId";
import { useCurrencyStore } from "@/hooks/useCurrencyStore";

export default function ProjectSettingsPage() {
  const formatAmount = useCurrencyStore((state) => state.formatAmount);
  const selectedCurrency = useCurrencyStore((state) => state.selectedCurrency);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("info");

  const {
    control: invoiceControl,
    handleSubmit: handleInvoiceSubmit,
    formState: { errors: invoiceErrors },
  } = useForm({
    defaultValues: {},
  });

  const {
    data: members = [],
    isLoading: membersLoading,
    error: membersError,
  } = useProjectTeamMembers(id);

  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    error: invoicesError,
  } = useProjectInvoices(id);

  const {
    data: services = [],
    isLoading: servicesLoading,
    error: servicesError,
  } = useProjectServices(id);

  const { data: teamsResponse } = useTeams();
  const { data: availableInvoices = [], isLoading: availableInvoicesLoading } =
    useInvoicesWithoutProjects();
  const { data: availableServices = [], isLoading: availableServicesLoading } =
    useServices();

  const removeTeamMemberMutation = useRemoveProjectTeamMember();
  const deleteServiceMutation = useDeleteProjectService();
  const deleteInvoiceMutation = useDeleteProjectInvoice();

  const addAssignment = useAddProjectAssignment();
  const assignServiceToProject = useAssignServiceToProject();
  const assignProjectToInvoice = useAssignProjectToInvoice();

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [isAddInvoiceDialogOpen, setIsAddInvoiceDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const removeMember = (memberId) => {
    const member = members.find((m) => m.id === memberId);
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

  const handleAddMember = () => {
    if (selectedTeamMember) {
      addAssignment.mutate({
        project_id: id,
        team_id: selectedTeamMember,
      });
      setSelectedTeamMember("");
      setIsAddMemberDialogOpen(false);
    }
  };

  const teamMemberOptions =
    teamsResponse?.data?.map((member) => ({
      value: member.id,
      label: `${member.user.name}`,
    })) || [];

  const handleAddInvoice = () => {
    if (selectedInvoice && id) {
      assignProjectToInvoice.mutate({
        invoice_id: Number(selectedInvoice),
        project_id: Number(id),
      });
      setSelectedInvoice("");
      setIsAddInvoiceDialogOpen(false);
    }
  };

  const invoiceOptions = availableInvoices.map((invoice) => ({
    label: formatId(invoice.id, "INVOICE"),
    value: String(invoice.id),
  }));

  const handleAddService = () => {
    if (selectedService && id) {
      assignServiceToProject.mutate({
        project_id: Number(id),
        service_id: Number(selectedService),
      });
      setSelectedService("");
      setIsAddServiceDialogOpen(false);
    }
  };

  const serviceOptions = availableServices.map((service) => ({
    label: service.name,
    value: String(service.id),
  }));

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
    <div className="w-full p-4 min-h-screen">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full ">
        <TabsList className="grid w-[40%] grid-cols-3 mb-2">
          <TabsTrigger value="info">Project Information</TabsTrigger>
          <TabsTrigger value="parameters">Project Parameters</TabsTrigger>
          <TabsTrigger value="tasks">Project Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card className=" max-h-screen">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>
                View and edit basic project information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parameters" className="space-y-4">
          <Card>
            <CardHeader className="flex gap-4 items-center justify-between">
              <div>
                <CardTitle>Project Members</CardTitle>
                <CardDescription>
                  Manage team members assigned to this project
                </CardDescription>
              </div>
              <div>
                <Dialog
                  open={isAddMemberDialogOpen}
                  onOpenChange={setIsAddMemberDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add members
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Team Member</DialogTitle>
                      <DialogDescription>
                        Select a team member to assign to this project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <SelectField
                        id="team-member"
                        label="Select Team Member"
                        value={selectedTeamMember}
                        onChange={setSelectedTeamMember}
                        options={teamMemberOptions}
                        placeholder="Choose a team member..."
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddMemberDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddMember}
                        disabled={
                          !selectedTeamMember || addAssignment.isPending
                        }
                      >
                        {addAssignment.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Member"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {membersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading team members...
                  </span>
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
                      className="flex items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {teamUser?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {teamInfo?.poste || "No role specified"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {teamUser?.email || "No email"}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <AlertDialogDestructive
                          onDelete={() => removeMember(member.id)}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* INVOICES CARD */}
          <Card>
            <CardHeader className="flex gap-4 items-center justify-between">
              <div>
                <CardTitle>Project Invoices</CardTitle>
                <CardDescription>
                  Manage invoices associated with this project
                </CardDescription>
              </div>
              <div>
                <Dialog
                  open={isAddInvoiceDialogOpen}
                  onOpenChange={setIsAddInvoiceDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add invoices
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Invoice to Project</DialogTitle>
                      <DialogDescription>
                        Select an invoice to associate with this project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <SelectField
                        id="invoice"
                        label="Select Invoice"
                        value={selectedInvoice}
                        onChange={setSelectedInvoice}
                        options={invoiceOptions}
                        placeholder={
                          availableInvoicesLoading
                            ? "Loading invoices..."
                            : "Choose an invoice..."
                        }
                        disabled={availableInvoicesLoading}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddInvoiceDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddInvoice}
                        disabled={
                          !selectedInvoice || assignProjectToInvoice.isPending
                        }
                      >
                        {assignProjectToInvoice.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Invoice"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {invoicesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading invoices...
                  </span>
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
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">INV-{invoice.id}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          ${invoice.total_amount || "0.00"}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(invoice.status)}`}
                        >
                          {invoice.status || "Unknown"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {invoice.invoice_date || "No date"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <AlertDialogDestructive
                        onDelete={() => removeInvoice(invoice.id)}
                      />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex gap-4 items-center justify-between">
              <div>
                <CardTitle>Related Services</CardTitle>
                <CardDescription>
                  Add or remove services associated with this project
                </CardDescription>
              </div>
              <div>
                <Dialog
                  open={isAddServiceDialogOpen}
                  onOpenChange={setIsAddServiceDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Add services
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Service to Project</DialogTitle>
                      <DialogDescription>
                        Select a service to associate with this project.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <SelectField
                        id="service"
                        label="Select Service"
                        value={selectedService}
                        onChange={setSelectedService}
                        options={serviceOptions}
                        placeholder={
                          availableServicesLoading
                            ? "Loading services..."
                            : "Choose a service..."
                        }
                        disabled={availableServicesLoading}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddServiceDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddService}
                        disabled={
                          !selectedService || assignServiceToProject.isPending
                        }
                      >
                        {assignServiceToProject.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Service"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {servicesLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2 text-sm text-muted-foreground">
                    Loading services...
                  </span>
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
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatAmount(Number(service.base_price) || 0, "MAD")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Qty: {service.pivot?.quantity || 1}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                          {service.status || "Active"}
                        </span>
                      </div>
                    </div>
                    <AlertDialogDestructive
                      onDelete={() => removeService(service.id)}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>Manage tasks for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <TasksForm projectId={id} />
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent>
              <TasksTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
