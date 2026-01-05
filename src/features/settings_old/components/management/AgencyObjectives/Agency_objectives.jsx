import React, { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export default function AgencyObjectives() {
  const [objectives, setObjectives] = useState([
    {
      id: 1,
      title: "Improve Client Satisfaction",
      description: "Increase client satisfaction scores",
      status: "in-progress",
      priority: "high",
      dueDate: "2025-06-30",
      owner: "John Doe",
      progress: 65,
      category: "Client Relations",
      metrics: "NPS Score +20%",
    },
    {
      id: 2,
      title: "Expand Market Reach",
      description: "Enter 3 new markets",
      status: "not-started",
      priority: "high",
      dueDate: "2025-12-31",
      owner: "Jane Smith",
      progress: 0,
      category: "Growth",
      metrics: "3 new markets established",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "not-started",
    priority: "medium",
    dueDate: "",
    owner: "",
    progress: 0,
    category: "",
    metrics: "",
  });

  const statusOptions = [
    { value: "not-started", label: "Not Started" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOpenDialog = (objective = null) => {
    if (objective) {
      setEditingId(objective.id);
      setFormData(objective);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        status: "not-started",
        priority: "medium",
        dueDate: "",
        owner: "",
        progress: 0,
        category: "",
        metrics: "",
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (editingId) {
      setObjectives(
        objectives.map((obj) =>
          obj.id === editingId ? { ...obj, ...formData } : obj
        )
      );
    } else {
      setObjectives([...objectives, { id: Date.now(), ...formData }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setObjectives(objectives.filter((obj) => obj.id !== id));
  };

  return (
    <div>
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
                  <p className="text-sm text-gray-600">{obj.description}</p>
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
                <span
                  className={`text-xs px-2 py-1 rounded ${getStatusColor(obj.status)}`}
                >
                  {statusOptions.find((s) => s.value === obj.status)?.label}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${getPriorityColor(obj.priority)}`}
                >
                  {priorityOptions.find((p) => p.value === obj.priority)?.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Owner:</span>{" "}
                  {obj.owner || "-"}
                </div>
                <div>
                  <span className="text-gray-600">Category:</span>{" "}
                  {obj.category || "-"}
                </div>
                <div>
                  <span className="text-gray-600">Due:</span>{" "}
                  {obj.dueDate || "-"}
                </div>
                <div>
                  <span className="text-gray-600">Progress:</span>{" "}
                  {obj.progress}%
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Metrics:</span>{" "}
                  {obj.metrics || "-"}
                </div>
              </div>

              {obj.progress > 0 && (
                <div className="mt-3 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${obj.progress}%` }}
                  />
                </div>
              )}
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

          <div className="space-y-4">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={formData.priority}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
              <Input
                placeholder="Owner"
                value={formData.owner}
                onChange={(e) =>
                  setFormData({ ...formData, owner: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
              <div>
                <label className="text-sm">
                  Progress: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      progress: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <Input
              placeholder="Key Metrics"
              value={formData.metrics}
              onChange={(e) =>
                setFormData({ ...formData, metrics: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
