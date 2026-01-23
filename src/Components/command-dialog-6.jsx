"use client";

import { CheckSquare, FileText, FolderPlus, UserPlus } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/auth/ClientForm";
import { AddProjectModal } from "@/components/common/AddProjectModal";
import { AddInvoiceModal } from "@/components/common/AddInvoiceModal";
import { AddQuoteModal } from "@/components/common/AddQuoteModal";
import { AddTaskModal } from "@/components/common/AddTaskModal";
import { ClientFormModal } from "./client_components/addNewClient";

export const title = "Command Dialog Actions Menu";

const Example = () => {
  const [open, setOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const basePath = role || "client";

  const handleCreateInvoice = () => {
    setOpen(false);
    setInvoiceModalOpen(true);
  };

  const handleCreateQuote = () => {
    setOpen(false);
    setQuoteModalOpen(true);
  };

  const handleCreateProject = () => {
    setOpen(false);
    setProjectModalOpen(true);
  };

  const handleAddClient = () => {
    setOpen(false);
    setClientDialogOpen(true);
  };

  const handleClientCreatedByAdmin = (id) => {
    setClientDialogOpen(false);
    navigate(`/${role}/client/${id}`);
  };

  const handleCreateTask = () => {
    setOpen(false);
    setTaskModalOpen(true);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Quick Actions</Button>
      <CommandDialog onOpenChange={setOpen} open={open}>
        <CommandInput placeholder="Search actions..." />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={handleCreateInvoice}>
              <FileText />
              <span>Create Invoice</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleCreateQuote}>
              <FileText />
              <span>Create Quote</span>
              <CommandShortcut>⌘Q</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleCreateProject}>
              <FolderPlus />
              <span>Create New Project</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleAddClient}>
              <UserPlus />
              <span>Add New Client</span>
              <CommandShortcut>⌘K</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleCreateTask}>
              <CheckSquare />
              <span>Add Event</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Add Client Dialog */}
      <Dialog open={clientDialogOpen} onOpenChange={setClientDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adding Client</DialogTitle>
          </DialogHeader>
          <ClientFormModal onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Project Modal */}
      <AddProjectModal
        open={projectModalOpen}
        onOpenChange={setProjectModalOpen}
        onSuccess={() => {
          // Optional: Refresh data or show success message
        }}
      />

      {/* Add Invoice Modal */}
      <AddInvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
        onSuccess={() => {
          // Optional: Refresh data or show success message
        }}
      />

      {/* Add Quote Modal */}
      <AddQuoteModal
        open={quoteModalOpen}
        onOpenChange={setQuoteModalOpen}
        onSuccess={() => {
          // Optional: Refresh data or show success message
        }}
      />

      {/* Add Task Modal */}
      <AddTaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onSuccess={() => {
          // Optional: Refresh data or show success message
        }}
      />
    </>
  );
};

export default Example;
