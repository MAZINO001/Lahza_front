/* eslint-disable no-unused-vars */
import * as React from "react";
import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useAuthContext } from "@/hooks/AuthContext";
import calendarColumns from "../columns/calendarColumns";
import { useEvents, useUpdateEvent, useDeleteEvent } from "../hooks/useCalendarQuery";
import { DataTable } from "@/components/table/DataTable";
import EventDetailsDialog from "./EventDetailsDialog";
import EventForm from "./EventForm";

export default function CalendarTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const { role } = useAuthContext();
  const { data: events = [], isLoading } = useEvents();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  // Dialog states
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editMode, setEditMode] = useState(false);

  console.log(events);

  const columns = React.useMemo(() => calendarColumns(), []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDetailsOpen(true);
    setEditMode(false);
  };

  const handleEditClick = () => {
    setEditMode(true);
    setDetailsOpen(false);
    setEditFormOpen(true);
  };

  const handleEventEdit = (event) => {
    updateMutation.mutate(
      { id: parseInt(event.id), data: event },
      {
        onSuccess: () => {
          setDetailsOpen(false);
          setEditFormOpen(false);
        },
      }
    );
  };

  const handleEventDelete = (event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      deleteMutation.mutate(
        { id: parseInt(event.id) },
        {
          onSuccess: () => {
            setDetailsOpen(false);
            setEditFormOpen(false);
          },
        }
      );
    }
  };

  const table = useReactTable({
    data: events,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full h-screen">
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        isInvoiceTable={false}
        onRowClick={handleEventClick}
      />

      {/* Event Details Dialog */}
      <EventDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        event={selectedEvent}
        onEdit={handleEditClick}
        onDelete={handleEventDelete}
      />

      {/* Event Edit Form */}
      <EventForm
        open={editFormOpen}
        onOpenChange={setEditFormOpen}
        selectedDate={null}
        editMode={editMode}
        selectedEvent={editMode ? selectedEvent : null}
        onEventEdit={handleEventEdit}
      />
    </div>
  );
}
