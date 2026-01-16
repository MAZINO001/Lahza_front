"use client";

import {
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  Upload,
  Zap,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export const title = "Quick Actions Menu";

const Example = () => {
  const { role } = useAuthContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-2 text-sm font-medium hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-secondary/60 disabled:opacity-50 disabled:pointer-events-none border border-border cursor-pointer">
          <Zap className="h-4 w-4" />
          Quick Actions
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link
              to={`/${role}/invoice/new`}
              className="flex cursor-pointer gap-2"
            >
              <Plus />
              Create New Invoice
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              to={`/${role}/quote/new`}
              className="flex cursor-pointer gap-2"
            >
              <Plus />
              Create New Quote
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              to={`/${role}/project/new`}
              className="flex cursor-pointer gap-2"
            >
              <Plus />
              Create New project
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <RefreshCw />
          Refresh
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Example;
