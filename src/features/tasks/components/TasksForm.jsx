// src/features/tasks/components/TasksForm.jsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useSubmitProtection } from "@/hooks/spamBlocker";
import FormField from "@/components/Form/FormField";
import TextareaField from "@/components/Form/TextareaField";

import {
  useCreateTask,
  useUpdateTask,
} from "@/features/tasks/hooks/useTasksQuery";
import DateField from "@/components/Form/DateField";

export function TasksForm({ task, projectId, onCancel, onSuccess }) {
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
      project_id: projectId || 1,
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

    mutation.mutate(
      isEditMode
        ? { projectId, taskId: task.id, data: payload }
        : { projectId, data },
      {
        onSuccess: () => {
          if (!isEditMode) reset();
          onSuccess?.();
        },
        onSettled: () => endSubmit(),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
        rules={{ required: "Description is required" }}
        render={({ field }) => (
          <TextareaField
            label="Description"
            placeholder="Describe this task..."
            error={errors.description?.message}
            {...field}
          />
        )}
      />
      <div className="flex gap-4 w-full">
        <div className="w-1/2">
          <Controller
            name="start_date"
            control={control}
            rules={{ required: "Start Date is required" }}
            render={({ field }) => (
              // <FormField
              <DateField
                label="Start Date"
                type="date"
                placeholder="e.g. Complete frontend development"
                error={errors.start_date?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className="w-1/2">
          <Controller
            name="end_date"
            control={control}
            rules={{ required: "End Date is required" }}
            render={({ field }) => (
              // <FormField
              <DateField
                label="End Date"
                type="date"
                placeholder="e.g. Complete frontend development"
                error={errors.end_date?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
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
