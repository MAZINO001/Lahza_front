import { BellIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "@/Components/comp-25";
import { useAuthContext } from "@/hooks/AuthContext";
export default function Header() {
  const { role, user } = useAuthContext();
  return (
    <header className="bg-accent-foreground text-primary w-full">
      <div className="w-full flex items-center justify-between px-2 py-2 lg:px-4 ">
        <SearchBar />
        <div> {role}</div>

        <div className="flex items-center gap-4 ml-4">
          <button className="relative p-2 rounded-md cursor-pointer">
            <BellIcon size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <Link
            to={`/${role}/profile`}
            className="flex gap-2 items-center p-1 rounded-full"
          >
            <img
              src="https://picsum.photos/600/400"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover "
            />
            <div className="md:flex flex-col gap-1 hidden">
              <span className="text-sm font-bold">{user.name}</span>
              <span className="text-xs opacity-30">{user.email}</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
