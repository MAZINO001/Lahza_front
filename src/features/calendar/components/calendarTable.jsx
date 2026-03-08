// import * as React from "react";
// import { useState } from "react";
// import {
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import { useAuthContext } from "@/hooks/AuthContext";
// import calendarColumns from "../columns/calendarColumns";
// import {
//   useEvents,
//   useUpdateEvent,
//   useDeleteEvent,
// } from "../hooks/useCalendarQuery";
// import { DataTable } from "@/components/table/DataTable";

// export default function CalendarTable() {
//   const [sorting, setSorting] = useState([]);
//   const [columnFilters, setColumnFilters] = useState([]);
//   const { role } = useAuthContext();
//   const { data: events = [], isLoading } = useEvents();
//   const updateMutation = useUpdateEvent();
//   const deleteMutation = useDeleteEvent();

//   // Dialog states
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [editFormOpen, setEditFormOpen] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [editMode, setEditMode] = useState(false);

//   console.log(events);

//   const columns = React.useMemo(() => calendarColumns(), []);

//   const handleEventClick = (event) => {
//     setSelectedEvent(event);
//     setDetailsOpen(true);
//     setEditMode(false);
//   };

//   const handleEditClick = () => {
//     setEditMode(true);
//     setDetailsOpen(false);
//     setEditFormOpen(true);
//   };

//   const handleEventEdit = (event) => {
//     updateMutation.mutate(
//       { id: parseInt(event.id), data: event },
//       {
//         onSuccess: () => {
//           setDetailsOpen(false);
//           setEditFormOpen(false);
//         },
//       },
//     );
//   };

//   const handleEventDelete = (event) => {
//     deleteMutation.mutate(
//       { id: parseInt(event.id) },
//       {
//         onSuccess: () => {
//           setDetailsOpen(false);
//           setEditFormOpen(false);
//         },
//       },
//     );
//   };

//   const table = useReactTable({
//     data: events,
//     columns,
//     state: { sorting, columnFilters },
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//   });

//   return (
//     <div className="w-full h-screen">
//       <DataTable
//         table={table}
//         columns={columns}
//         isLoading={isLoading}
//         isInvoiceTable={false}
//         onRowClick={handleEventClick}
//       />
//     </div>
//   );
// }


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
import {
  useEvents,
  useUpdateEvent,
  useDeleteEvent,
} from "../hooks/useCalendarQuery";
import { DataTable } from "@/components/table/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

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

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  console.log(events);

  const columns = React.useMemo(() => calendarColumns(), []);

  // Extract unique categories from events
  const categories = React.useMemo(() => {
    const uniqueCategories = [...new Set(events.map((event) => event.category))];
    return uniqueCategories.filter(Boolean);
  }, [events]);

  // Apply filters to events
  const filteredEvents = React.useMemo(() => {
    return events.filter((event) => {
      // Category filter
      const categoryMatch =
        selectedCategory === "all" || event.category === selectedCategory;

      // Date range filter
      let dateMatch = true;
      if (dateRange.from || dateRange.to) {
        const eventDate = new Date(event.start_date || event.date);
        if (dateRange.from && dateRange.to) {
          dateMatch = eventDate >= dateRange.from && eventDate <= dateRange.to;
        } else if (dateRange.from) {
          dateMatch = eventDate >= dateRange.from;
        } else if (dateRange.to) {
          dateMatch = eventDate <= dateRange.to;
        }
      }

      return categoryMatch && dateMatch;
    });
  }, [events, selectedCategory, dateRange]);

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
      },
    );
  };

  const handleEventDelete = (event) => {
    deleteMutation.mutate(
      { id: parseInt(event.id) },
      {
        onSuccess: () => {
          setDetailsOpen(false);
          setEditFormOpen(false);
        },
      },
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory("all");
    setDateRange({ from: null, to: null });
  };

  const table = useReactTable({
    data: filteredEvents,
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
    <div className="w-full h-screen flex flex-col min-h-0">
      {/* Filter Controls - responsive wrap */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 pb-4 px-2 flex-shrink-0 border-b border-border">
        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
          <span className="text-sm font-medium shrink-0">Category:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory} className="bg-background">
            <SelectTrigger className="w-full sm:w-[180px] min-w-0 bg-background">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
          <span className="text-sm font-medium shrink-0">Date Range:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[250px] sm:w-[200px] justify-start min-w-0"
              >
                <span className="truncate">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                        {format(dateRange.to, "MMM dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange({ from: range?.from, to: range?.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear Filters Button */}
        {(selectedCategory !== "all" || dateRange.from || dateRange.to) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="h-8 shrink-0"
          >
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}

        {/* Results Count */}
        <div className="text-sm text-gray-600 w-full sm:w-auto sm:ml-auto">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* Table - scrolls vertically */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <DataTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          isInvoiceTable={false}
          onRowClick={handleEventClick}
        />
      </div>
    </div>
  );
}