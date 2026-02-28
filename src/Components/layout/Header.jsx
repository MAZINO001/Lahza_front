import SearchBar from "@/Components/comp-25";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NotificationDropdown from "@/components/popover-standard-12";
import DropdownMenuProfile from "@/components/dropdown-menu-profile-1";
import PopUpActions from "@/components/command-dialog-6";
import LanguageSwitcher from "@/Components/LanguageSwitcher";
import CurrencyToggle from "@/Components/CurrencyToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-sidebar backdrop-blur border-b border-sidebar-border">
      <div className="flex items-center px-4 py-3 lg:px-6">
        <div className="flex-1"></div>
        <div className="w-[30%] mr-4">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4 flex-1 justify-end">
          <LanguageSwitcher />
          <CurrencyToggle />
          <PopUpActions />
          <ThemeToggle />
          <NotificationDropdown />
          <DropdownMenuProfile />
        </div>
      </div>
    </header>
  );
}
