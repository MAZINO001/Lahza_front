import { Link } from "react-router-dom";
import SearchBar from "@/Components/comp-25";
import { useAuthContext } from "@/hooks/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import NotificationDropdown from "@/features/notifications/components/NotificationDropdown";

export default function Header() {
  const { role, user } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 w-full bg-accent-foreground backdrop-blur">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <SearchBar />

        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />

          <NotificationDropdown />
          <Link
            to={`/${role}/profile`}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100"
          >
            <img
              src={user?.profile_image || "https://picsum.photos/600/400"}
              alt="Profile"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="hidden flex-col gap-0.5 md:flex">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
