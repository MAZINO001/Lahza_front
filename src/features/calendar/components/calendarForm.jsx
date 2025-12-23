/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import { useCreateEvent } from "../hooks/useCalendarQuery";
import { useEventById } from "../hooks/useCalendarQuery";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import EventColorPicker from "./ColorPicker";
import SearchTypeTags from "./searchTypeTags";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CalendarForm({ EventID, onSuccess }) {
  const isEditMode = !!EventID;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [eventColor, setEventColor] = useState("Agency");

  const eventColors = [
    { name: "Meeting", color: "bg-blue-500" },
    { name: "Reminder", color: "bg-yellow-500" },
    { name: "Agency", color: "bg-indigo-500" },
    { name: "Holiday", color: "bg-pink-500" },
    { name: "Other", color: "bg-green-500" },
    { name: "Weekend", color: "bg-gray-400" },
  ];

  const { data: event } = useEventById(EventID);
  const now = new Date();

  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: event || {
      title: "test001",
      start_date: today,
      end_date: today,
      start_hour: currentTime,
      end_hour: currentTime,
      category: "Agency",
      status: "pending",
      type: "online",
      repeatedly: "none",
      url: "http://test.com",
      other_notes: "test/test/test/test/test/test/",
      tags: [],
    },
  });

  const formColor = watch("category");
  const formTags = watch("tags");

  useEffect(() => {
    if (event) {
      reset({
        title: event.title || "",
        start_date: event.start_date || today,
        end_date: event.end_date || today,
        start_hour: event.start_hour?.slice(0, 5) || currentTime,
        end_hour: event.end_hour?.slice(0, 5) || currentTime,
        category: event.category || "",
        status: event.status,
        type: event.type,
        repeatedly: event.repeatedly,
        url: event.url,
        other_notes: event.other_notes,
        tags: event.tags,
      });
      if (event.category) {
        setEventColor(event.category);
      }
    }
  }, [event, reset]);

  useEffect(() => {
    if (formColor && (!formTags || formTags.length === 0)) {
      setEventColor(formColor);
    }
  }, [formColor, formTags]);

  useEffect(() => {
    if (formTags?.length > 0) {
      const firstTag = formTags[0];
      const matchingColor = eventColors.find((c) => c.name === firstTag);

      if (matchingColor) {
        setEventColor(firstTag);

        setValue("category", firstTag);
      }
    } else {
      setValue("category", "Other");
    }
  }, [formTags, setValue]);

  useEffect(() => {
    if (event?.color) {
      setEventColor(event.color);
    }
  }, [event]);

  const createMutate = useCreateEvent();

  const onSubmit = (data) => {
    const payload = {
      ...data,
      description: data.other_notes,
      other_notes: undefined,
    };

    console.log("Sending:", payload);
    createMutate.mutate(payload);
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
              <SearchTypeTags
                label="tags"
                value={field.value || []}
                onChange={(tags) => field.onChange(tags)}
                allTags={[
                  "Meeting",
                  "Deadline",
                  "Reminder",
                  "Workshop",
                  "Agency",
                  "Travel",
                  "Urgent",
                  "Holiday",
                  "Other",
                  "Weekend",
                ]}
              />
            )}
          />
        </div>
        <div>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    variant="outline"
                    className="w-full flex justify-between p-2 rounded-md border border-border"
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full ring-2 ring-offset-2",
                          eventColors.find((c) => c.name === eventColor)
                            ?.color || "bg-blue-500",
                          popoverOpen && "ring-ring"
                        )}
                      />
                      <span>{eventColor || "Select color"}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 opacity-50",
                        popoverOpen && "rotate-180 transition-transform"
                      )}
                    />
                  </button>
                </PopoverTrigger>

                <PopoverContent className="w-80 p-0" align="start">
                  <div className="p-4 pt-3">
                    <EventColorPicker
                      value={eventColor}
                      onChange={(colorName) => {
                        setEventColor(colorName);
                        field.onChange(colorName); // ← This correctly sets "category"
                        setPopoverOpen(false);
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            )}
          />
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
