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
    "draft",
    "pending",
    "in-progress",
    "completed",
    "canceled",
    "waiting-confirmation",
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
  const value = row.getValue("date");
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
          <span className="truncate">{value || "Pick a date"}</span>
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
              format(d, "MMMM d, yyyy")
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
              <button className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors text-left flex-1">
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
                      <div className="text-xs text-gray-500">
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

  const toggle = (name) => {
    const next = selected.includes(name)
      ? selected.filter((m) => m !== name)
      : [...selected, name];
    update(next);
  };

  const remove = (name) => {
    update(selected.filter((m) => m !== name));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" className="min-h-8 w-full text-left">
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {selected.map((name) => (
                <Badge key={name} variant="outline" className="gap-1">
                  <button
                    type="button"
                    className="-ml-1 inline-flex items-center justify-center"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      remove(name);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <span className="truncate max-w-32">{name}</span>
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground hover:underline">
              Add members
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList>
            <CommandEmpty>No members found.</CommandEmpty>
            <CommandGroup>
              {members.map((name) => {
                const isSelected = selected.includes(name);
                return (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={() => toggle(name)}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="ml-2">{name}</span>
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
      accessorKey: "title",
      header: "Project Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("title")}</div>
      ),
    },

    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary" className="bg-amber-900/50 text-amber-200">
          {row.getValue("category")?.[0]}
        </Badge>
      ),
    },

    {
      accessorKey: "invoice",
      header: "Invoice",
      cell: ({ row }) => {
        const url = row.getValue("invoice");
        return (
          <div className="flex items-center gap-2 max-w-xs">
            <div>{url}</div>
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
      accessorKey: "date",
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
      cell: ({ row, table }) => <MembersCell row={row} table={table} />,
    },
  ];
}
