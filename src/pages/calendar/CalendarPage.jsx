import CalendarTable from "@/features/calendar/components/calendarTable.jsx";
import CalendarComponent from "@/features/calendar/components/calendarComponent.jsx";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import CalendarForm from "@/features/calendar/components/calendarForm";
export default function CalendarPage() {
  const [selectedView, setSelectedView] = useState("calendar");
  const [open, setOpen] = useState(false);
  const AllViews = ["calendar", "table"];
  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 capitalize border border-border px-2 py-[4.3px] rounded-md">
              {selectedView}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={selectedView}
              onValueChange={setSelectedView}
            >
              {AllViews.map((view) => (
                <DropdownMenuRadioItem key={view} value={view}>
                  {view}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Event</Button>
          </DialogTrigger>

          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Create a new event</DialogTitle>
              <DialogDescription>
                Fill the form to create the event.
              </DialogDescription>
            </DialogHeader>

            <CalendarForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {selectedView === "calendar" && <CalendarComponent />}
      {selectedView === "table" && <CalendarTable />}
    </div>
  );
}
