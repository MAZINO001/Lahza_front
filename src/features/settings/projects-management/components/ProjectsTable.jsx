import React, { useMemo, useState } from "react";
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { DataTable } from "@/components/table/DataTable";
import FormField from "@/components/Form/FormField";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectColumns } from "./ProjectColumns";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function ProjectsTable() {
    const { role } = useAuthContext();
    const availableMembers = useMemo(
        () => [
            "Mounir Marnissi",
            "Stuff LH",
            "John Doe",
            "Sarah Smith",
            "Alex Brown",
        ],
        []
    );

    const availableStatuses = useMemo(
        () => [
            "draft",
            "pending",
            "in-progress",
            "completed",
            "canceled",
            "waiting-confirmation",
        ],
        []
    );

    const [projects, setProjects] = useState([
        {
            id: 1,
            status: "done",
            title: "Jamal Amiar",
            category: ["Modifications"],
            invoice: "INVOICE-001",
            access: {
                host_acc:
                    '{"email":"jamal_amiar@example.com","password":"7PndfT1JhYBAb*d3YYJ"}',
                website_acc: '{"email":"jamal@website.com","password":"web456"}',
            },
            date: "December 8, 2025",
            members: ["Mounir Marnissi"],
        },
        {
            id: 2,
            status: "canceled",
            title: "Toit et Compagnons",
            category: ["Web Design"],
            invoice: "INVOICE-001",
            access: {
                host_acc: '{"email":"puxo7158@example.com","password":"6a5M-Ksn-fDM("}',
                social_media:
                    '[{"link":"puxo_social","email":"puxo@social.com","password":"social789"}]',
            },
            date: "November 20, 2025",
            members: ["Mounir Marnissi"],
        },
        {
            id: 3,
            status: "draft",
            title: "L'OUI Cocktails",
            category: ["Web Design"],
            invoice: "INVOICE-001",
            access: {
                host_acc: '{"email":"admin6749@example.com","password":"RBmX39PADfbG"}',
                social_media:
                    '[{"link":"admin_social","email":"admin@social.com","password":"admin345"}]',
                website_acc: '{"email":"admin@website.com","password":"admin678"}',
            },
            date: "November 13, 2025",
            members: ["Stuff LH"],
        },
    ]);

    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");

    const columns = useMemo(() => projectColumns(), []);

    const filteredData = useMemo(() => {
        let data = [...projects];

        if (statusFilter !== "all") {
            data = data.filter((p) => p.status === statusFilter);
        }

        return data;
    }, [projects, statusFilter]);

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { sorting, columnFilters },
        meta: {
            availableMembers,
            availableStatuses,
            updateProjectDate: (projectId, nextDate) => {
                setProjects((prev) => {
                    const next = prev.map((p) =>
                        p.id === projectId ? { ...p, date: nextDate } : p
                    );
                    return next;
                });
            },
            updateProjectAccess: (projectId, nextAccess) => {
                setProjects((prev) => {
                    const next = prev.map((p) =>
                        p.id === projectId ? { ...p, access: nextAccess } : p
                    );
                    return next;
                });
            },
            updateProjectMembers: (projectId, nextMembers) => {
                setProjects((prev) => {
                    const next = prev.map((p) =>
                        p.id === projectId ? { ...p, members: nextMembers } : p
                    );
                    return next;
                });
            },
            updateProjectStatus: (projectId, nextStatus) => {
                setProjects((prev) => {
                    const next = prev.map((p) =>
                        p.id === projectId ? { ...p, status: nextStatus } : p
                    );
                    return next;
                });
            },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="w-full bg-background min-h-screen">
            <div className="flex justify-between mb-4">
                <div className="flex gap-3 items-end">
                    <FormField
                        placeholder="Filter projects by title..."
                        value={table.getColumn("title")?.getFilterValue() ?? ""}
                        onChange={(e) =>
                            table.getColumn("title")?.setFilterValue(e.target.value)
                        }
                    />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="rounded-md flex items-center gap-2 border border-border px-2 py-[4.3px] capitalize">
                                Status: {statusFilter}
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuRadioGroup
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                {["all", "not-started", "in-progress", "done"].map((status) => (
                                    <DropdownMenuRadioItem key={status} value={status}>
                                        {status.replace("-", " ")}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <Link to={`/${role}/project/new`}>
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Button>
                </Link>
            </div>

            <DataTable table={table} columns={columns} />
        </div>
    );
}
