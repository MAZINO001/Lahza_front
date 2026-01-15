import React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useProjectTeam } from "../../hooks/useProjectsQuery";

function TeamMembersCell({ row, table }) {
    const projectId = row.original.id;
    const selected = row.getValue("members") ?? [];
    const members = table?.options?.meta?.availableMembers ?? [];
    const [open, setOpen] = React.useState(false);

    // Fetch the actual team members for this project
    const { data: teamMembers, isLoading: teamLoading, error: teamError } = useProjectTeam(projectId);

    // Use the fetched team members if available, otherwise fall back to the selected members
    const displayMembers = React.useMemo(() => {
        if (teamMembers && Array.isArray(teamMembers)) {
            return teamMembers.map(member => ({
                id: member.team_user?.id || member.id,
                name: member.team_user?.user?.name || member.team_user?.name || member.name || 'Unknown',
                email: member.team_user?.user?.email || member.team_user?.email || member.email || '',
                teamId: member.team_id
            }));
        }
        return selected;
    }, [teamMembers, selected]);

    const update = (next) => {
        table?.options?.meta?.updateProjectMembers?.(projectId, next);
    };

    const addAssignment = (member) => {
        table?.options?.meta?.addProjectAssignment?.(projectId, member.id);
        const next = [...selected, member];
        update(next);
    };

    const removeAssignment = (member) => {
        // Use teamId if available from API response, otherwise fall back to member.id
        const teamIdToRemove = member.teamId || member.id;
        table?.options?.meta?.removeProjectAssignment?.(projectId, teamIdToRemove);
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

    if (teamLoading) {
        return (
            <div className="text-sm text-muted-foreground">
                Loading members...
            </div>
        );
    }

    if (teamError) {
        return (
            <div className="text-sm text-red-500">
                Error loading members
            </div>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button type="button" className="min-h-8 w-full text-left">
                    {displayMembers.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {displayMembers.map((member) => (
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
                                        <div
                                            className={cn(
                                                "h-4 w-4 mr-2 flex items-center justify-center",
                                                isSelected ? "opacity-100" : "opacity-0"
                                            )}
                                        >
                                            ✓
                                        </div>
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

export default TeamMembersCell;
