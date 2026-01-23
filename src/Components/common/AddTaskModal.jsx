import EventForm from "@/features/calendar/components/EventForm";
import React from "react";

export function AddTaskModal({ open, onOpenChange, onSuccess }) {
  const handleSuccess = () => {
    onSuccess?.();
    onOpenChange(false);
  };

  return (
    <EventForm
      open={open}
      onOpenChange={onOpenChange}
      editMode={false}
      selectedEvent={null}
      selectedDate={null}
      onEventEdit={handleSuccess}
    />
  );
}
