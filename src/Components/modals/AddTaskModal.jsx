import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TasksForm } from "@/features/tasks/components/TasksForm";
import { useNoInvoiceProject } from "@/features/documents/hooks/useDocumentsQuery";
import SelectField from "@/components/Form/SelectField";

export function AddTaskModal({ open, onOpenChange, onSuccess }) {
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const { data: projects = [] } = useNoInvoiceProject();

    const projectOptions = projects.map((project) => ({
        label: project.name || "Unknown Project",
        value: String(project.id),
    }));

    const handleSuccess = () => {
        onSuccess?.();
        onOpenChange(false);
        setSelectedProjectId(null);
    };

    const handleCancel = () => {
        onOpenChange(false);
        setSelectedProjectId(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {!selectedProjectId ? (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Select a project to create a task for:
                            </p>
                            <SelectField
                                label="Project"
                                options={projectOptions}
                                value={selectedProjectId || ""}
                                onChange={(value) => setSelectedProjectId(Number(value))}
                                placeholder="Select a project"
                            />
                        </div>
                    ) : (
                        <TasksForm
                            projectId={selectedProjectId}
                            onCancel={handleCancel}
                            onSuccess={handleSuccess}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
