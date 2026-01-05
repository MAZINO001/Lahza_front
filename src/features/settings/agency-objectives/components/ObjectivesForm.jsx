import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export default function ObjectivesForm({
    open,
    onOpenChange,
    objective = null,
    onSave
}) {
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
        ...objective
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

    const handleSave = () => {
        if (!formData.title.trim()) return;

        onSave(formData);
        onOpenChange(false);
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {objective ? "Edit Objective" : "Add Objective"}
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
                    <Button variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        {objective ? "Update" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
