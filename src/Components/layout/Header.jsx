import { BellIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "@/Components/comp-25";
import { useAuthContext } from "@/hooks/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  const { role, user } = useAuthContext();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <SearchBar />

        <div className="flex items-center gap-3 ml-auto">
          <ThemeToggle />

          <button className="relative inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-accent transition-colors">
            <BellIcon size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <Link
            to={`/${role}/profile`}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-accent transition-colors"
          >
            <img
              src="https://picsum.photos/600/400"
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
