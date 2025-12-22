import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import { useCreateEvent } from "../hooks/useCalendarQuery";
import { useEvent } from "@dnd-kit/utilities";

export default function CalendarForm({ EventID, onSuccess }) {
  const isEditMode = !!EventID;

  const { data: event } = useEvent(EventID);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: event || {
      title: "",
      start_date: "",
      end_date: "",
      start_hour: "",
      end_hour: "",
      category: "meeting",
      status: "confirmed",
      type: "online",
      repeatedly: "none",
      url: "",
      other_notes: "",
    },
  });

  const createMutate = useCreateEvent();

  const onSubmit = (data) => {
    console.log(data);
    createMutate.mutate(data, {
      onSuccess: () => {
        console.log("Created:", data);
        onSuccess?.();
        if (!isEditMode) reset();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
      <Controller
        name="title"
        control={control}
        rules={{ required: "Title is required" }}
        render={({ field }) => (
          <FormField
            {...field}
            label="Title"
            placeholder="e.g. Team Meeting"
            error={errors?.title?.message}
          />
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="start_date"
          control={control}
          rules={{ required: "Start date is required" }}
          render={({ field }) => (
            <FormField
              {...field}
              type="date"
              label="Start Date"
              error={errors?.start_date?.message}
            />
          )}
        />

        <Controller
          name="end_date"
          control={control}
          rules={{ required: "End date is required" }}
          render={({ field }) => (
            <FormField
              {...field}
              type="date"
              label="End Date"
              error={errors?.end_date?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="start_hour"
          control={control}
          rules={{ required: "Start time is required" }}
          render={({ field }) => (
            <FormField
              {...field}
              type="time"
              label="Start Time"
              error={errors?.start_hour?.message}
            />
          )}
        />

        <Controller
          name="end_hour"
          control={control}
          rules={{ required: "End time is required" }}
          render={({ field }) => (
            <FormField
              {...field}
              type="time"
              label="End Time"
              error={errors?.end_hour?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="select"
              label="Category"
              options={[
                { label: "Meeting", value: "meeting" },
                { label: "Appointment", value: "appointment" },
                { label: "Event", value: "event" },
                { label: "Task", value: "task" },
              ]}
              error={errors?.category?.message}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="select"
              label="Status"
              options={[
                { label: "Confirmed", value: "confirmed" },
                { label: "Pending", value: "pending" },
                { label: "Cancelled", value: "cancelled" },
              ]}
              error={errors?.status?.message}
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="select"
              label="Type"
              options={[
                { label: "Online", value: "online" },
                { label: "In-Person", value: "in-person" },
              ]}
              error={errors?.type?.message}
            />
          )}
        />

        <Controller
          name="repeatedly"
          control={control}
          render={({ field }) => (
            <FormField
              {...field}
              type="select"
              label="Repeat"
              options={[
                { label: "Does not repeat", value: "none" },
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
              ]}
              error={errors?.repeatedly?.message}
            />
          )}
        />
      </div>

      <Controller
        name="url"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            type="url"
            label="Meeting URL"
            placeholder="https://example.com"
            error={errors?.url?.message}
          />
        )}
      />

      <Controller
        name="other_notes"
        control={control}
        render={({ field }) => (
          <FormField
            {...field}
            type="textarea"
            label="Notes"
            placeholder="Extra details…"
            error={errors?.other_notes?.message}
          />
        )}
      />
      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onSuccess} type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  );
}
