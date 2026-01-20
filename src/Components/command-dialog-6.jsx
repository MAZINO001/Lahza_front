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

export const title = "Command Dialog Actions Menu";

const Example = () => {
  const [open, setOpen] = useState(false);
  const [clientDialogOpen, setClientDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { role } = useAuthContext();
  const basePath = role || "client";

  const handleCreateInvoice = () => {
    setOpen(false);
    navigate(`/${basePath}/invoice/new`);
  };

  const handleCreateQuote = () => {
    setOpen(false);
    navigate(`/${basePath}/quote/new`);
  };

  const handleCreateProject = () => {
    setOpen(false);
    navigate(`/${basePath}/project/new`);
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
    // Navigate to tasks page or project selection for task creation
    navigate(`/${basePath}/calendar`);
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
              <span>Create Task</span>
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
          <ClientForm handleClientCreatedByAdmin={handleClientCreatedByAdmin} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Example;
