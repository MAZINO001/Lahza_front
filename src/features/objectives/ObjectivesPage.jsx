import React, { useState } from "react";
import { Plus, Trash2, Edit2, Calendar, User, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ObjectivesForm from "./components/ObjectivesForm";
import {
  useCreateObjective,
  useDeleteObjective,
  useObjectives,
  useUpdateObjective,
} from "./hooks/useObjectivesQuery";

export default function ObjectivesPage() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data: objectives = [], isLoading, error } = useObjectives();
  const createObjective = useCreateObjective();
  const updateObjective = useUpdateObjective();
  const deleteObjective = useDeleteObjective();

  const handleOpenDialog = (objective = null) => {
    setEditingId(objective ? objective.id : null);
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
    if (window.confirm("Delete this objective?")) {
      deleteObjective.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground animate-pulse">
          Loading objectives...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive">
        Failed to load objectives. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div></div>

        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          New Objective
        </Button>
      </div>

      {/* Objectives List */}
      {objectives.length === 0 ? (
        <div className="text-center py-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No objectives yet</p>
          <Button variant="outline" onClick={() => handleOpenDialog()}>
            Create your first objective
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
          {objectives.map((obj) => (
            <Card
              key={obj.id}
              className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {obj.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {obj.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(obj)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(obj.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                {/* Status & Progress */}
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    variant={
                      obj.status === "completed"
                        ? "success"
                        : obj.status === "in_progress"
                          ? "default"
                          : obj.status === "pending"
                            ? "secondary"
                            : "destructive"
                    }
                    className="capitalize px-3 py-1 text-xs font-medium"
                  >
                    {obj.status}
                  </Badge>

                  {obj.progress !== undefined && (
                    <div className="flex items-center gap-2 text-sm flex-1 min-w-[140px]">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <Progress value={obj.progress} className="h-2 flex-1" />
                      <span className="tabular-nums w-10 text-right">
                        {obj.progress}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Dates & Owner */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Start</span>
                    </div>
                    <div>{formatDate(obj.start_date) || "—"}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>End</span>
                    </div>
                    <div>{formatDate(obj.end_date) || "—"}</div>
                  </div>
                </div>

                {obj.owner && (
                  <div className="flex items-center gap-2 text-sm pt-2 border-t">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                      {getInitials(obj.owner.name)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Owner: </span>
                      {obj.owner.name}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl">
              {editingId ? "Edit Objective" : "Create New Objective"}
            </DialogTitle>
          </DialogHeader>

          <div className="px-6 py-5">
            <ObjectivesForm
              objective={
                editingId ? objectives.find((o) => o.id === editingId) : null
              }
              onSave={handleSave}
              onCancel={handleCloseDialog}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple date formatter (you can replace with date-fns or luxon later)
function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(name) {
  if (!name) return "??";
  return name
    .trim()
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
