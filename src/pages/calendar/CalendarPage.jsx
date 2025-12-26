import CalendarTable from "@/features/calendar/components/calendarTable.jsx";
import NewCalendar from "@/features/calendar/components/test/calendarPage.jsx";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
export default function CalendarPage() {
  const [selectedView, setSelectedView] = useState("calendar");
  const AllViews = ["calendar", "table"];
  return (
    <div className="bg-background text-foreground w-full p-4">
      <div className="flex items-center justify-between mb-2">
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
      </div>
      {selectedView === "calendar" && <NewCalendar />}
      {selectedView === "table" && <CalendarTable />}
    </div>
  );
}
