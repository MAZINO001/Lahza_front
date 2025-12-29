/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "./calendar.css";
import FormField from "@/components/Form/FormField";
import SelectField from "@/components/Form/SelectField";
import TextareaField from "@/components/Form/TextareaField";
import { useCreateEvent } from "../../hooks/useCalendarQuery";

function EventForm({ open, onOpenChange, selectedDate, onEventCreate }) {
  const [guestInput, setGuestInput] = useState("");
  const createMutation = useCreateEvent();

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      startDate: "",
      endDate: "",
      startTime: "09:00",
      endTime: "10:00",
      description: "",
      category: "Agency",
      status: "pending",
      type: "offline",
      repeatedly: "none",
      color: "#3b82f6",
      allDay: false,
      guests: [],
      url: "",
    },
  });

  const formColor = watch("color");
  const formType = watch("type");
  const formAllDay = watch("allDay");

  const [selectedColor, setSelectedColor] = useState("#3b82f6");

  useEffect(() => {
    if (formColor) {
      setSelectedColor(formColor);
    }
  }, [formColor]);

  const predefinedColors = [
    { name: "Meeting", color: "#3b82f6" },
    { name: "Deadline", color: "#ef4444" },
    { name: "Reminder", color: "#eab308" },
    { name: "Workshop", color: "#8b5cf6" },
    { name: "Agency", color: "#6366f1" },
    { name: "Travel", color: "#14b8a6" },
    { name: "Urgent", color: "#f97316" },
    { name: "Holiday", color: "#ec4899" },
    { name: "Other", color: "#10b981" },
    { name: "Weekend", color: "#6b7280" },
  ];

  useEffect(() => {
    if (open && selectedDate) {
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
              selectedDate.getTime() + 60 * 60 * 1000
            ).toLocaleTimeString("en-CA", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            : "10:00",
        description: "",
        category: "Agency",
        status: "pending",
        type: "offline",
        repeatedly: "none",
        color: "#3b82f6",
        allDay: false,
        guests: [],
        url: "",
      });
    } else if (open) {
      reset({
        title: "",
        startDate: "",
        endDate: "",
        startTime: "09:00",
        endTime: "10:00",
        description: "",
        category: "Agency",
        status: "pending",
        type: "offline",
        repeatedly: "none",
        color: "#3b82f6",
        allDay: false,
        guests: [],
        url: "",
      });
    }
  }, [open, selectedDate, reset]);

  const onSubmit = (formData) => {
    if (!formData.title || !formData.startDate) {
      alert("Please fill in at least title and start date");
      return;
    }

    const baseDate = new Date(formData.startDate);
    const baseId = Date.now();

    // Create main event
    const createEvent = (date, eventId) => ({
      title: formData.title,
      start_date: date, // Convert to snake_case for backend
      end_date: formData.endDate || date, // Convert to snake_case for backend
      start_hour: formData.startTime, // Convert to snake_case for backend
      end_hour: formData.endTime, // Convert to snake_case for backend
      description: formData.description,
      category: formData.category,
      status: formData.status,
      type: formData.type,
      repeatedly: formData.repeatedly,
      color: formData.color,
      allDay: formData.allDay,
      guests: formData.guests,
      url: formData.type === "online" ? formData.url : "",
      baseId: eventId,
    });

    // Send main event to backend
    createMutation.mutate(createEvent(formData.startDate, baseId), {
      onSuccess: () => {
        // Handle repeating events
        if (formData.repeatedly !== "none") {
          const maxEvents = 50;
          let currentDate = new Date(baseDate);

          for (let i = 1; i < maxEvents; i++) {
            switch (formData.repeatedly) {
              case "daily":
                currentDate.setDate(currentDate.getDate() + 1);
                break;
              case "weekly":
                currentDate.setDate(currentDate.getDate() + 7);
                break;
              case "monthly":
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
              case "yearly":
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
              default:
                break;
            }

            const dateStr = currentDate.toLocaleDateString("en-CA");
            const repeatingEvent = createEvent(dateStr, baseId + i);

            // Send each repeating event to backend
            createMutation.mutate(repeatingEvent);

            if (
              currentDate >
              new Date(baseDate.getTime() + 365 * 24 * 60 * 60 * 1000)
            ) {
              break;
            }
          }
        }

        setGuestInput("");
        onOpenChange(false);
      },
    });
  };

  const handleCancel = () => {
    reset();
    setGuestInput("");
    onOpenChange(false);
  };

  const addGuest = (currentGuests) => {
    if (guestInput.trim() && !currentGuests.includes(guestInput.trim())) {
      return [...currentGuests, guestInput.trim()];
    }
    return currentGuests;
  };

  const removeGuest = (currentGuests, guestToRemove) => {
    return currentGuests.filter((guest) => guest !== guestToRemove);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>
            New Event {selectedDate?.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4 bg-background text-foreground">
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
                  <FormField
                    id="startDate"
                    label="startDate"
                    type="date"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    error={errors.startDate?.message}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <FormField
                    id="endDate"
                    label="endDate"
                    type="date"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                    }}
                    error={errors.endDate?.message}
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
                          onClick={() => field.onChange(colorOption.color)}
                          className={`flex items-center gap-2 border p-1 rounded-md transition-all ${selectedColor === colorOption.color
                              ? "border-black bg-gray-100"
                              : "border-border hover:border-gray-400"
                            }`}
                        >
                          <span
                            className={`w-8 h-8 rounded border-2 transition-all ${selectedColor === colorOption.color
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
          </div>

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
                    <Input
                      type="email"
                      value={guestInput}
                      onChange={(e) => setGuestInput(e.target.value)}
                      placeholder="Add guest email"
                      className="h-10 flex-1"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          field.onChange(addGuest(field.value));
                          setGuestInput("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        field.onChange(addGuest(field.value));
                        setGuestInput("");
                      }}
                      className="h-10 px-3"
                    >
                      Add
                    </Button>
                  </div>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((guest, index) => (
                        <div
                          key={index}
                          className="flex items-center border border-border space-x-1 bg-background px-2 py-1 rounded text-sm"
                        >
                          <span>{guest}</span>
                          <button
                            type="button"
                            onClick={() =>
                              field.onChange(removeGuest(field.value, guest))
                            }
                            className="text-muted-foreground hover:text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
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

          <div className="flex flex-col w-full gap-4">
            <div className="space-y-2 w-full">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SelectField
                    id="category"
                    label="category"
                    value={field.value || ""}
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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventForm;
