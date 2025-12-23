import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import { useCreateEvent } from "../hooks/useCalendarQuery";
import { useEventById } from "../hooks/useCalendarQuery";
import SelectField from "@/components/comp-192";
import TagsField from "@/components/Form/TagsField";
import TextareaField from "@/components/Form/TextareaField";
import ColorPicker from "@/components/kibo-ui/ColorPicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CalendarForm({ EventID, onSuccess }) {
  const isEditMode = !!EventID;

  const { data: event } = useEventById(EventID);
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
      status: "pending",
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

      <div className="flex flex-col w-full gap-4 ">
        <div className="w-full">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagsField
                id="tags"
                label="Tags"
                value={field.value || []}
                onChange={(newTags) => {
                  field.onChange(newTags);
                }}
                error={errors.tags?.message}
                {...field}
              />
            )}
          />
        </div>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">
                Pick a color
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Select Event Color</DialogTitle>
                <DialogDescription>
                  Choose a color to represent your event.
                </DialogDescription>
              </DialogHeader>
              <ColorPicker />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <SelectField
              id="type"
              label="Type"
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
              }}
              error={errors.type?.message}
              options={[
                { label: "Online", value: "online" },
                { label: "Offline", value: "offline" },
              ]}
            />
          )}
        />

        <Controller
          name="repeatedly"
          control={control}
          render={({ field }) => (
            <SelectField
              id="repeatedly"
              label="Repeat"
              value={field.value || ""}
              onChange={(val) => {
                field.onChange(val);
              }}
              error={errors.repeatedly?.message}
              options={[
                { label: "Does not repeat", value: "none" },
                { label: "Daily", value: "daily" },
                { label: "Weekly", value: "weekly" },
                { label: "Monthly", value: "monthly" },
              ]}
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
          <TextareaField
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
