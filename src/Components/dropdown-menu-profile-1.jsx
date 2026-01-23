import { HelpCircle, LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/hooks/AuthContext";
import { useSidebar } from "./ui/sidebar";
import { Link } from "react-router-dom";

export const title = "Profile Dropdown with Avatar";
const Example = () => {
  const { user, logout, role } = useAuthContext();
  const { state } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative h-10 w-10 rounded-full" variant="ghost">
          <Avatar>
            <AvatarImage
              src="https://github.com/haydenbleasel.png"
              // src={user?.profile_image || "https://picsum.photos/800/800"}
              alt="@haydenbleasel"
            />
            <AvatarFallback>HB</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={`/${role}/profile`} className="flex cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to={`/${role}/settings/company_basics`}
            className="flex cursor-pointer"
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            to={`/${role}/settings/tickets_management`}
            className="flex cursor-pointer"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            variant="ghost"
            onClick={() => logout()}
            className="cursor-pointer w-full h-full"
            size={state === "collapsed" ? "icon" : undefined}
          >
            <LogOut />
            {state !== "collapsed" && <span className="ml-2">LogOut</span>}
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Example;
