// src/features/tasks/components/TasksForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";

import {
    useCreateTask,
    useUpdateTask,
} from "@/features/tasks/hooks/useTasksQuery";

export function TasksForm({ task, onSuccess, projectId }) {
    const navigate = useNavigate();
    const { isSubmitting, startSubmit, endSubmit } = useSubmitProtection();
    const createMutation = useCreateTask();
    const updateMutation = useUpdateTask();
    const mutation = task?.id ? updateMutation : createMutation;
    const isEditMode = !!task?.id;

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: task || {
            title: "",
            description: "",
            percentage: 0,
            estimated_time: 0,
            project_id: 1,
        },
    });

    const onSubmit = (data) => {
        if (isSubmitting || !startSubmit()) return;

        const payload = {
            ...data,
            percentage: Number(data.percentage),
            estimated_time: Number(data.estimated_time),
            project_id: Number(data.project_id),
        };

        mutation.mutate(isEditMode ? { projectId, taskId: task.id, data: payload } : { projectId, data }, {
            onSuccess: () => {
                onSuccess?.();
                if (!isEditMode) reset();
            },
            onSettled: () => endSubmit(),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
            <Controller
                name="title"
                control={control}
                rules={{ required: "Title is required" }}
                render={({ field }) => (
                    <FormField
                        label="Task Title"
                        placeholder="e.g. Complete frontend development"
                        error={errors.title?.message}
                        {...field}
                    />
                )}
            />

            <Controller
                name="description"
                control={control}
                render={({ field }) => (
                    <TextareaField
                        label="Description"
                        placeholder="Describe this task..."
                        error={errors.description?.message}
                        {...field}
                    />
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <Controller
                    name="percentage"
                    control={control}
                    rules={{
                        required: "Percentage is required",
                        min: { value: 0, message: "Minimum is 0" },
                        max: { value: 100, message: "Maximum is 100" },
                    }}
                    render={({ field }) => (
                        <FormField
                            label="Completion Percentage"
                            type="number"
                            placeholder="0-100"
                            error={errors.percentage?.message}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />

                <Controller
                    name="estimated_time"
                    control={control}
                    rules={{
                        required: "Estimated time is required",
                        min: { value: 0, message: "Minimum is 0" },
                    }}
                    render={({ field }) => (
                        <FormField
                            label="Estimated Time (days)"
                            type="number"
                            placeholder="Hours"
                            error={errors.estimated_time?.message}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                    )}
                />
            </div>

            <div className="flex justify-end gap-3 pt-6">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || mutation.isPending}>
                    {mutation.isPending
                        ? "Saving..."
                        : isEditMode
                            ? "Update Task"
                            : "Create Task"}
                </Button>
            </div>
        </form>
    );
}
