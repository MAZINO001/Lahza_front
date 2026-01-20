import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import ObjectivesForm from "./components/ObjectivesForm";
import {
  useCreateObjective,
  useDeleteObjective,
  useObjectives,
  useUpdateObjective,
} from "./hooks/useObjectivesQuery";
import { StatusBadge } from "@/components/StatusBadge";

export default function ObjectivesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // React Query hooks
  const { data: objectives = [], isLoading, error } = useObjectives();
  const createObjective = useCreateObjective();
  const updateObjective = useUpdateObjective();
  const deleteObjective = useDeleteObjective();

  const handleOpenDialog = (objective = null) => {
    if (objective) {
      setEditingId(objective.id);
    } else {
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleSave = (data) => {
    if (editingId) {
      updateObjective.mutate({ id: editingId, data });
    } else {
      createObjective.mutate(data);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    deleteObjective.mutate(id);
  };

  if (isLoading) {
    return <div className="p-4">Loading objectives...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error loading objectives</div>;
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Objectives</h1>

        <Button onClick={() => handleOpenDialog()} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Objective
        </Button>
      </div>

      <div className="space-y-3">
        {objectives.map((obj) => (
          <Card key={obj.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{obj.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {obj.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDialog(obj)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(obj.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <StatusBadge status={obj.status}>{obj.status}</StatusBadge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Start:</span>{" "}
                  {obj.start_date || "-"}
                </div>
                <div>
                  <span className="text-muted-foreground">End:</span>{" "}
                  {obj.end_date || "-"}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Objective" : "Add Objective"}
            </DialogTitle>
          </DialogHeader>
          <ObjectivesForm
            open={open}
            onOpenChange={setOpen}
            objective={
              editingId ? objectives.find((obj) => obj.id === editingId) : null
            }
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
