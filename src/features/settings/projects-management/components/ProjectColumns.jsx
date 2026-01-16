/* eslint-disable react-refresh/only-export-components */
import { ArrowUpDown, Check, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StatusBadge } from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import * as React from "react";
import { format, isValid } from "date-fns";
import { formatId } from "@/lib/utils/formatId";
import TeamMembersCell from "./TeamMembersCell";

function copyToClipboard(text, label = "Copied") {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied!`);
}

function formatStatusLabel(status) {
  switch (status) {
    case "not-started":
      return "Not started";
    case "in-progress":
      return "In progress";
    case "done":
      return "Done";
    default:
      return status;
  }
}

function StatusCell({ row, table }) {
  const value = row.getValue("status");
  const statuses = table?.options?.meta?.availableStatuses ?? [
    "pending",
    "in_progress",
    "completed",
    "cancelled",
  ];

  const [open, setOpen] = React.useState(false);

  const setStatus = (next) => {
    table?.options?.meta?.updateProjectStatus?.(row.original.id, next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="hover:opacity-90">
          <StatusBadge status={value} />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-56 p-0">
        <Command>
          <CommandInput placeholder="Set status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {statuses.map((s) => (
                <CommandItem key={s} value={s} onSelect={() => setStatus(s)}>
                  <Check
                    className={cn(
                      "h-4 w-4",
                      s === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="ml-2">{formatStatusLabel(s)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DeliveryDateCell({ row, table }) {
  const value = row.getValue("estimated_end_date");
  const parsed = React.useMemo(() => {
    const d = new Date(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(parsed);

  React.useEffect(() => {
    setDate(parsed);
  }, [parsed]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex items-center gap-2 text-sm text-foreground hover:underline",
            !value && "text-muted-foreground"
          )}
        >
          <span className="truncate">
            {value
              ? new Date(value).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
              : "Pick a date"}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto p-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            if (!d) return;

            setDate(d);
            table?.options?.meta?.updateProjectDate?.(
              row.original.id,
              format(d, "yyyy-MM-dd")
            );
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function AccessCell({ row }) {
  const accessObj = row.getValue("access");
  const [openPopover, setOpenPopover] = React.useState(null);

  // Handle case where access data doesn't exist
  if (!accessObj || typeof accessObj !== "object") {
    return (
      <span className="text-sm text-muted-foreground">No access data</span>
    );
  }

  const formatLabel = (key) => {
    switch (key) {
      case "host_acc":
        return "Host Account";
      case "social_media":
        return "Social Media";
      case "website_acc":
        return "Website Account";
      default:
        return key;
    }
  };
  return (
    <div className="space-y-1">
      {Object.entries(accessObj).map(([key, value]) => (
        <div key={key} className="flex items-center gap-1">
          <Popover
            open={openPopover === key}
            onOpenChange={(open) => setOpenPopover(open ? key : null)}
          >
            <PopoverTrigger asChild>
              <button className="text-xs bg-background hover:bg-background/90 px-2 py-1 rounded transition-colors text-left flex-1 border border-border">
                <div className="font-medium text-foreground">
                  {formatLabel(key)}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-3">
                <div className="font-medium text-sm">
                  {formatLabel(key)} Credentials
                </div>
                {(() => {
                  try {
                    const parsed = JSON.parse(value);
                    if (key === "social_media" && Array.isArray(parsed)) {
                      return parsed.map((item, index) => (
                        <div
                          key={index}
                          className="space-y-2 border-b pb-2 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground w-12">
                              link:
                            </span>
                            <span className="text-xs flex-1 text-center">
                              {item.link || "Not set"}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                copyToClipboard(item.link || "", "Link copied")
                              }
                            >
                              Copy
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground w-12">
                              email:
                            </span>
                            <span className="text-xs flex-1 text-center">
                              {item.email || "Not set"}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                copyToClipboard(
                                  item.email || "",
                                  "Email copied"
                                )
                              }
                            >
                              Copy
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground w-12">
                              password:
                            </span>
                            <span className="text-xs flex-1 text-center">
                              {item.password || "Not set"}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                copyToClipboard(
                                  item.password || "",
                                  "Password copied"
                                )
                              }
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      ));
                    } else {
                      return (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground w-12">
                              email:
                            </span>
                            <span className="text-xs flex-1 text-center">
                              {parsed.email || "Not set"}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                copyToClipboard(
                                  parsed.email || "",
                                  "Email copied"
                                )
                              }
                            >
                              Copy
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-foreground w-12">
                              password:
                            </span>
                            <span className="text-xs flex-1 text-center">
                              {parsed.password || "Not set"}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-xs"
                              onClick={() =>
                                copyToClipboard(
                                  parsed.password || "",
                                  "Password copied"
                                )
                              }
                            >
                              Copy
                            </Button>
                          </div>
                        </>
                      );
                    }
                  } catch {
                    return (
                      <div className="text-xs text-muted-foreground">
                        Invalid credentials format
                      </div>
                    );
                  }
                })()}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ))}
    </div>
  );
}

function MembersCell({ row, table }) {
  const selected = row.getValue("members") ?? [];
  const members = table?.options?.meta?.availableMembers ?? [];
  const [open, setOpen] = React.useState(false);

  const update = (next) => {
    table?.options?.meta?.updateProjectMembers?.(row.original.id, next);
  };

  const addAssignment = (member) => {
    table?.options?.meta?.addProjectAssignment?.(row.original.id, member.id);
    const next = [...selected, member];
    update(next);
  };

  const removeAssignment = (member) => {
    table?.options?.meta?.removeProjectAssignment?.(row.original.id, member.id);
    const next = selected.filter((m) => m.id !== member.id);
    update(next);
  };

  const toggle = (member) => {
    const isSelected = selected.some((m) => m.id === member.id);
    if (isSelected) {
      removeAssignment(member);
    } else {
      addAssignment(member);
    }
  };

  const remove = (member) => {
    removeAssignment(member);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="min-h-8 w-full text-left">
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((member) => (
                <Badge key={member.id} variant="outline" className="gap-1">
                  <button
                    type="button"
                    className="-ml-1 inline-flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(member);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="truncate max-w-32">{member.name}</span>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground hover:underline">
              Add team members
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search team members..." />
          <CommandList>
            <CommandEmpty>No team members found.</CommandEmpty>
            <CommandGroup>
              {members.map((member) => {
                const isSelected = selected.some((m) => m.id === member.id);
                return (
                  <CommandItem
                    key={member.id}
                    value={member.name}
                    onSelect={() => toggle(member)}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="ml-2">
                      <div className="font-medium">{member.name}</div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function projectColumns() {
  return [
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row, table }) => <StatusCell row={row} table={table} />,
    },

    {
      accessorKey: "name",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },

    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground max-w-xs truncate">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "invoices",
      header: "Invoices",
      cell: ({ row }) => {
        const invoicesId = row.getValue("invoices.id") || [];
        return (
          <div className="flex items-center gap-2">
            {formatId(invoicesId, "INVOICE")}
          </div>
        );
      },
    },
    {
      accessorKey: "access",
      header: "Access",
      cell: ({ row, table }) => <AccessCell row={row} table={table} />,
    },

    {
      accessorKey: "estimated_end_date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row, table }) => <DeliveryDateCell row={row} table={table} />,
    },

    {
      accessorKey: "members",
      header: "Members",
      cell: ({ row, table }) => <TeamMembersCell row={row} table={table} />,
    },
  ];
}
