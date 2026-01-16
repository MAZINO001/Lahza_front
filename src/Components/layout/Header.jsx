import SearchBar from "@/Components/comp-25";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NotificationDropdown from "@/components/popover-standard-12";
import DropdownMenuProfile from "@/components/dropdown-menu-profile-1";
import DropdownMenuActions from "@/components/dropdown-menu-actions-5";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar backdrop-blur border-b border-sidebar-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <SearchBar />

        <div className="flex items-center gap-4 ml-auto">
          <DropdownMenuActions />

          <ThemeToggle />

          <NotificationDropdown />

          <DropdownMenuProfile />
        </div>
      </div>
    </header>
  );
}
