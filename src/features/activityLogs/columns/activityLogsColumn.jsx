import { format } from "date-fns";
import {
  ArrowUpDown,
  Monitor,
  Globe,
  Smartphone,
  Tablet,
  Server,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TooltipButton } from "@/components/common/TooltipButton";
import { Badge } from "@/components/ui/badge";

import { Link } from "react-router-dom";

import { formatId } from "@/lib/utils/formatId";

export function ActivityLogsColumns(role) {
  return [
    {
      accessorKey: "id",
      header: "Log ID",
      cell: ({ row }) => {
        const id = row.getValue("id");
        return (
          <Link
            to={`/${role}/log/${id}`}
            className="font-medium hover:underline cursor-pointer"
          >
            {formatId(id, "LOG")}
          </Link>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        const isToday =
          format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
        return (
          <div className="flex flex-col ml-3">
            <span className="font-medium">
              {isToday ? "Today" : format(date, "MMM d, yyyy")}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(date, "h:mm a")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "user_id",
      header: "User",
      cell: ({ row }) => {
        const userId = row.original.user_id;
        const userRole = row.original.user_role;
        return (
          <div className="flex items-center gap-3">
            <div>
              <Link className="font-medium text-sm">
                {formatId(userId, "USER")}
              </Link>
              <p className="text-xs text-muted-foreground capitalize">
                {userRole}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const action = row.getValue("action");
        const variants = {
          created: "bg-green-100 text-green-800",
          updated: "bg-blue-100 text-blue-800",
          deleted: "bg-red-100 text-red-800",
        };
        return (
          <Badge
            className={variants[action] || "bg-background text-foreground"}
          >
            {action.charAt(0).toUpperCase() + action.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "table_name",
      header: "Target",
      cell: ({ row }) => {
        const { table_name } = row.original;
        return (
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{table_name}</Badge>
            </div>
          </div>
        );
      },
    },
    {
      id: "device",
      header: "Device",
      cell: ({ row }) => {
        const deviceType = row.original.device;
        return (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {deviceType === "Mobile" && (
              <>
                <Smartphone className="h-3.5 w-3.5" />
                <span>Mobile</span>
              </>
            )}

            {deviceType === "Desktop" && (
              <>
                <Monitor className="h-3.5 w-3.5" />
                <span>Desktop</span>
              </>
            )}

            {deviceType === "Tablet" && (
              <>
                <Tablet className="h-3.5 w-3.5" />
                <span>Tablet</span>
              </>
            )}

            {deviceType === "Server" && (
              <>
                <Server className="h-3.5 w-3.5" />
                <span>Server</span>
              </>
            )}

            {!["Mobile", "Desktop", "Tablet", "Server"].includes(
              deviceType || "",
            ) && (
              <>
                <Monitor className="h-3.5 w-3.5" />
                <span>{deviceType || "Unknown"}</span>
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Globe className="h-3.5 w-3.5" />
            {row.original.ip_country}
          </div>
        </div>
      ),
    },
  ];
}
