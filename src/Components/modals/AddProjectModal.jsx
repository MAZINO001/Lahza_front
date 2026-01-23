import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProjectForm } from "@/features/projects/components/ProjectForm";

export function AddProjectModal({ open, onOpenChange, onSuccess }) {
    const handleSuccess = () => {
        onSuccess?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <ProjectForm onSuccess={handleSuccess} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
