// src/features/tasks/components/TaskActions.jsx
import { Pencil, Trash2 } from "lucide-react";
import { TooltipButton } from "@/components/common/TooltipButton";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import AlertDialogDestructive from "@/components/alert-dialog-destructive-1.jsx";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TaskEditPage from "@/pages/tasks/TaskEditPage";

export function TaskActions({ task, projectId, deleteMutation, navigate, role }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { handleDeleteTask } = globalFnStore();

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <TooltipButton tooltip="Edit Task" onClick={handleEdit}>
          <Pencil className="h-4 w-4" />
        </TooltipButton>
        <AlertDialogDestructive
          onDelete={() => handleDeleteTask(projectId, task.id, deleteMutation)}
        />
      </div>

      {isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="w-full max-w-4xl">
            <DialogHeader>
              <DialogTitle>Edit Task: {task.title}</DialogTitle>
              <DialogDescription>Edit task details below.</DialogDescription>
            </DialogHeader>
            <TaskEditPage
              onCancel={handleEditClose}
              projectId={projectId}
              taskId={task.id}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
