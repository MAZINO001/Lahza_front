/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import "./calendar.css";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";
import { useCreateEvent, useUpdateEvent } from "../hooks/useCalendarQuery";
import DateField from "@/components/Form/DateField";
import { toast } from "sonner";

function EventForm({
  open,
  onOpenChange,
  selectedDate,
  editMode,
  selectedEvent,
  onEventEdit,
}) {
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const [isLoading, setIsLoading] = useState(false);

  const users = [
    {
      id: 1,
      name: "Monir El Amrani",
      email: "monir@demo.com",
    },
    {
      id: 2,
      name: "Yassine Benali",
      email: "yassine@demo.com",
    },
  ];

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      other_notes: "",
      category: "Agency",
      status: "pending",
      type: "offline",
      repeatedly: "none",
      color: "#6366f1",
      allDay: false,
      guests: [],
      url: "",
      priority: "low",
    },
  });

  const formColor = watch("color");
  const formCategory = watch("category");
  const formType = watch("type");
  const formAllDay = watch("allDay");

  const [selectedColor, setSelectedColor] = useState("#6366f1");
  const isUpdatingFromColor = useRef(false);
  const isUpdatingFromCategory = useRef(false);

  const categoryColorMap = {
    meeting: "#0ea5e9",
    agency: "#6366f1",
    holiday: "#ec4899",
    work: "#f97316",
    other: "#10b981",
  };

  const colorCategoryMap = {};
  Object.entries(categoryColorMap).forEach(([category, color]) => {
    colorCategoryMap[color] = category;
  });

  useEffect(() => {
    if (formColor && !isUpdatingFromCategory.current) {
      setSelectedColor(formColor);

      const matchingCategory = colorCategoryMap[formColor];
      if (matchingCategory && matchingCategory !== formCategory) {
        isUpdatingFromColor.current = true;
        setValue("category", matchingCategory);
        setTimeout(() => {
          isUpdatingFromColor.current = false;
        }, 0);
      }
    }
  }, [formColor, setValue]);

  useEffect(() => {
    if (formCategory && !isUpdatingFromColor.current) {
      const categoryColor = categoryColorMap[formCategory.toLowerCase()];
      if (categoryColor && categoryColor !== formColor) {
        isUpdatingFromCategory.current = true;
        setValue("color", categoryColor);
        setSelectedColor(categoryColor);
        setTimeout(() => {
          isUpdatingFromCategory.current = false;
        }, 0);
      }
    }
  }, [formCategory, setValue]);

  const predefinedColors = [
    { name: "Meeting", color: "#0ea5e9" },
    { name: "Agency", color: "#6366f1" },
    { name: "Holiday", color: "#ec4899" },
    { name: "Work", color: "#f97316" },
    { name: "Other", color: "#10b981" },
  ];

  useEffect(() => {
    if (open && editMode && selectedEvent) {
      let startDate, endDate, startTime, endTime;
      if (selectedEvent.start) {
        const startDateTime = new Date(selectedEvent.start);
        const endDateTime = selectedEvent.end
          ? new Date(selectedEvent.end)
          : startDateTime;
        startDate = startDateTime.toLocaleDateString("en-CA");
        endDate = endDateTime.toLocaleDateString("en-CA");
        startTime = startDateTime.toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        endTime = endDateTime.toLocaleTimeString("en-CA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      } else {
        startDate = selectedEvent.start_date || "";
        endDate = selectedEvent.end_date || selectedEvent.start_date || "";
        startTime = selectedEvent.start_hour
          ? selectedEvent.start_hour.slice(0, 5)
          : "09:00";
        endTime = selectedEvent.end_hour
          ? selectedEvent.end_hour.slice(0, 5)
          : "10:00";
      }

      reset({
        title: selectedEvent.title || "",
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        endTime: endTime,
        description: selectedEvent.description || "",
        other_notes: selectedEvent.other_notes || "",
        category: selectedEvent.category
          ? selectedEvent.category.charAt(0).toUpperCase() +
            selectedEvent.category.slice(1)
          : "Agency",
        status: selectedEvent.status || "pending",
        type: selectedEvent.type || "offline",
        repeatedly: selectedEvent.repeatedly || "none",
        color: selectedEvent.color || "#6366f1",
        allDay:
          selectedEvent.allDay === true || selectedEvent.all_day === 1
            ? true
            : false,
        guests: selectedEvent.guests || [],
        url: selectedEvent.url || "",
      });

      setSelectedColor(selectedEvent.color || "#6366f1");
    } else if (open && selectedDate && !editMode) {
      // New event mode
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      const timeStr = selectedDate.toLocaleTimeString("en-CA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      reset({
        title: "",
        startDate: dateStr,
        endDate: dateStr,
        startTime: selectedDate.getHours() > 0 ? timeStr : "09:00",
        endTime:
          selectedDate.getHours() > 0
            ? new Date(
                selectedDate.getTime() + 60 * 60 * 1000,
              ).toLocaleTimeString("en-CA", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "10:00",
        description: "",
        other_notes: "",
        category: "Agency",
        status: "pending",
        type: "offline",
        repeatedly: "none",
        color: "#6366f1",
        allDay: false,
        guests: [],
        url: "",
      });

      setSelectedColor("#6366f1");
    } else if (open && !editMode && !selectedDate) {
      // New event without selected date
      reset({
        title: "",
        startDate: "",
        endDate: "",
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        other_notes: "",
        category: "Agency",
        status: "pending",
        type: "offline",
        repeatedly: "none",
        color: "#6366f1",
        allDay: false,
        guests: [],
        url: "",
      });

      setSelectedColor("#6366f1");
    }
  }, [open, selectedDate, editMode, selectedEvent, reset]);

  // Helper function to format time as H:i (without seconds)
  const formatTime = (time) => {
    if (!time) return "00:00";
    return time.length === 5 ? time : time.slice(0, 5);
  };

  const onSubmit = (formData) => {
    if (!formData.title || !formData.startDate) {
      toast.info("Please fill in at least title and start date");
      return;
    }

    setIsLoading(true);

    const baseDate = new Date(formData.startDate);

    const createEvent = (date) => {
      let startHour, endHour;

      if (formData.allDay) {
        startHour = "00:00";
        endHour = "23:59";
      } else {
        startHour = formatTime(formData.startTime);
        endHour = formatTime(formData.endTime);
      }

      return {
        title: formData.title,
        start_date: date,
        end_date: formData.endDate || date,
        start_hour: startHour,
        end_hour: endHour,
        description: formData.description,
        category: formData.category.toLowerCase(),
        status: formData.status,
        type: formData.type,
        repeatedly: formData.repeatedly,
        color: formData.color,
        all_day: formData.allDay ? 1 : 0,
        guests: null,
        url: formData.type === "online" && formData.url ? formData.url : null,
        other_notes: formData.other_notes || null,
      };
    };

    if (editMode && selectedEvent) {
      // Edit existing event
      const eventPayload = createEvent(formData.startDate);

      onEventEdit({
        id: selectedEvent.id,
        ...eventPayload,
      });

      setIsLoading(false);
      onOpenChange(false);
    } else {
      const eventPayload = createEvent(formData.startDate);

      createMutation.mutate(eventPayload, {
        onSuccess: () => {
          setIsLoading(false);
          onOpenChange(false);
        },
        onError: (error) => {
          console.error("❌ Error creating event:", error);
          setIsLoading(false);
        },
      });
    }
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Edit Event" : "New Event"}{" "}
            {selectedDate?.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4 bg-background text-foreground overflow-y-auto flex-1">
          <div className="space-y-2">
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <FormField
                  id="title"
                  label="title"
                  type="text"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                  error={errors.title?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    id="startDate"
                    label="startDate"
                    type="date"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    error={errors.startDate?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  // <FormField
                  <DateField
                    id="endDate"
                    label="endDate"
                    type="date"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    error={errors.endDate?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {!formAllDay && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="startTime"
                      label="startTime"
                      type="time"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      error={errors.startTime?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      id="endTime"
                      label="endTime"
                      type="time"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      error={errors.endTime?.message}
                    />
                  )}
                />
              </div>
            </div>
          )}

          <Controller
            name="allDay"
            control={control}
            render={({ field }) => (
              <div className="flex items-center space-x-2">
                <input
                  {...field}
                  id="allDay"
                  type="checkbox"
                  checked={field.value}
                  className="w-4 h-4 text-blue-600 bg-background border-border rounded focus:ring-blue-500"
                />
                <Label
                  htmlFor="allDay"
                  className="text-sm font-medium text-foreground"
                >
                  All Day Event
                </Label>
              </div>
            )}
          />
          {/* 
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Event Color
            </Label>
            <div className="space-y-3">
              <div className="w-full">
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-4 gap-4">
                      {predefinedColors.map((colorOption, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => {
                            field.onChange(colorOption.color);
                          }}
                          className={`flex items-center gap-2 border p-1 rounded-md transition-all ${
                            selectedColor === colorOption.color
                              ? "border-black bg-gray-100"
                              : "border-border hover:border-gray-400"
                          }`}
                        >
                          <span
                            className={`w-8 h-8 rounded border-2 transition-all ${
                              selectedColor === colorOption.color
                                ? "border-black"
                                : "border-border"
                            }`}
                            style={{ backgroundColor: colorOption.color }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {colorOption.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                />
              </div>
            </div>
          </div> */}

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Guests
            </Label>
            <Controller
              name="guests"
              control={control}
              render={({ field }) => (
                <>
                  <div className="flex items-center space-x-2">
                    <select
                      value=""
                      onChange={(e) => {
                        const userId = parseInt(e.target.value);
                        if (userId && !field.value.includes(userId)) {
                          field.onChange([...field.value, userId]);
                        }
                      }}
                      className="flex-1 h-10 px-3 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="">Select a user to add...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((guestId, index) => {
                        const user = users.find((u) => u.id === guestId);
                        return (
                          <div
                            key={index}
                            className="flex items-center border border-border space-x-1 bg-background px-2 py-1 rounded text-sm"
                          >
                            <span>{user ? user.name : `ID: ${guestId}`}</span>
                            <button
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  field.value.filter((id) => id !== guestId),
                                )
                              }
                              className="text-muted-foreground hover:text-red-400"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextareaField
                  {...field}
                  label="Description"
                  id="description"
                  placeholder="Enter event description"
                  rows={3}
                  error={errors?.description?.message}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Controller
              name="other_notes"
              control={control}
              render={({ field }) => (
                <TextareaField
                  label="Notes"
                  {...field}
                  id="other_notes"
                  placeholder="Enter event notes"
                  error={errors?.other_notes?.message}
                />
              )}
            />
          </div>

          <div className="flex flex-col w-full gap-4">
            <div className=" flex gap-4">
              <div className="space-y-2 w-full">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      id="category"
                      label="category"
                      value={field.value || "agency"}
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      error={errors.category?.message}
                      options={[
                        { value: "agency", label: "Agency" },
                        { value: "holiday", label: "Holiday" },
                        { value: "other", label: "Other" },
                        { value: "meeting", label: "Meeting" },
                        { value: "work", label: "Work" },
                      ]}
                    />
                  )}
                />
              </div>
              <div className="space-y-2 w-full">
                <Controller
                  name="repeatedly"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Repeat"
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      options={[
                        { value: "none", label: "None" },
                        { value: "daily", label: "Daily" },
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                        { value: "yearly", label: "Yearly" },
                      ]}
                      error={errors?.repeatedly?.message}
                    />
                  )}
                />
              </div>
              <div className="space-y-2 w-full">
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <SelectField
                      label="Priority"
                      value={field.value || "low"}
                      onChange={(val) => {
                        field.onChange(val);
                      }}
                      options={[
                        { value: "low", label: "Low" },
                        { value: "medium", label: "Medium" },
                        { value: "high", label: "High" },
                      ]}
                      error={errors?.repeatedly?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className="space-y-2 w-full">
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
                      {
                        value: "online",
                        label: "Online",
                      },
                      {
                        value: "offline",
                        label: "Offline",
                      },
                    ]}
                  />
                )}
              />
            </div>
          </div>

          {formType === "online" && (
            <div className="space-y-2">
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <FormField
                    {...field}
                    label="URL"
                    id="url"
                    type="url"
                    placeholder="Enter event URL"
                    className="h-10"
                  />
                )}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={
                isLoading ||
                createMutation.isPending ||
                updateMutation.isPending
              }
            >
              {isLoading || createMutation.isPending || updateMutation.isPending
                ? editMode
                  ? "Updating..."
                  : "Creating..."
                : editMode
                  ? "Update Event"
                  : "Create Event"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventForm;
