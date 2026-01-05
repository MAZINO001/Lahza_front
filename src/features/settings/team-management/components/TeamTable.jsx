/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeamColumns from "./TeamColumns";
import CSVUploadModal from "@/components/common/CSVUploadModal";
import { useAuthContext } from "@/hooks/AuthContext";

import { Button } from "@/components/ui/button";
import FormField from "@/components/Form/FormField";
import { Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from "@/components/table/DataTable";

const teamMembers = [
    {
        id: 1,
        name: "Sarah Johnson",
        jobTitle: "Senior Frontend Developer",
        email: "sarah.johnson@company.com",
        phone: "+1 (555) 123-4567",
        contractType: "CDI",
        contractStartDate: "2021-03-15",
        contractEndDate: null,
        salary: 85000,
        bankName: "Chase Bank",
        iban: "US64CHAS0001234567890",
        emergencyContactName: "John Johnson",
        certifications: "AWS Certified Solutions Architect",
        github: "https://github.com/sarahjohnson",
        linkedin: "https://linkedin.com/in/sarahjohnson",
    },
    {
        id: 2,
        name: "Marcus Chen",
        jobTitle: "Backend Engineer",
        email: "marcus.chen@company.com",
        phone: "+1 (555) 234-5678",
        contractType: "CDI",
        contractStartDate: "2022-01-10",
        contractEndDate: null,
        salary: 92000,
        bankName: "Bank of America",
        iban: "US64BOFA0001234567890",
        emergencyContactName: "Lisa Chen",
        certifications: "Docker Certified Associate",
        github: "https://github.com/marcuschen",
        linkedin: "https://linkedin.com/in/marcuschen",
    },
    {
        id: 3,
        name: "Emma Rodriguez",
        jobTitle: "UI/UX Designer",
        email: "emma.rodriguez@company.com",
        phone: "+1 (555) 345-6789",
        contractType: "CDI",
        contractStartDate: "2022-06-20",
        contractEndDate: null,
        salary: 78000,
        bankName: "Wells Fargo",
        iban: "US64WFBK0001234567890",
        emergencyContactName: "Carlos Rodriguez",
        certifications: "Adobe Certified Expert",
        github: "https://github.com/emmarodriguez",
        linkedin: "https://linkedin.com/in/emmarodriguez",
    },
    {
        id: 4,
        name: "Alex Thompson",
        jobTitle: "DevOps Engineer",
        email: "alex.thompson@company.com",
        phone: "+1 (555) 456-7890",
        contractType: "CDD",
        contractStartDate: "2023-09-01",
        contractEndDate: "2024-12-31",
        salary: 88000,
        bankName: "Citibank",
        iban: "US64CITI0001234567890",
        emergencyContactName: "Patricia Thompson",
        certifications: "AWS Solutions Architect",
        github: "https://github.com/alexthompson",
        linkedin: "https://linkedin.com/in/alexthompson",
    },
    {
        id: 5,
        name: "Zara Patel",
        jobTitle: "Data Analyst",
        email: "zara.patel@company.com",
        phone: "+1 (555) 567-8901",
        contractType: "Freelance",
        contractStartDate: "2023-03-15",
        contractEndDate: null,
        salary: 65000,
        bankName: "HSBC",
        iban: "US64HSBC0001234567890",
        emergencyContactName: "Rajesh Patel",
        certifications: "Google Analytics Certified",
        github: "https://github.com/zarapatel",
        linkedin: "https://linkedin.com/in/zarapatel",
    },
    {
        id: 6,
        name: "James Wilson",
        jobTitle: "Junior Developer",
        email: "james.wilson@company.com",
        phone: "+1 (555) 678-9012",
        contractType: "Intern",
        contractStartDate: "2024-06-01",
        contractEndDate: "2024-12-31",
        salary: 28000,
        bankName: "TD Bank",
        iban: "US64TDBK0001234567890",
        emergencyContactName: "Margaret Wilson",
        certifications: "JavaScript Fundamentals",
        github: "https://github.com/jameswilson",
        linkedin: "https://linkedin.com/in/jameswilson",
    },
];

export default function TeamTable() {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [filterValue, setFilterValue] = useState("");

    const [showUploadModal, setShowUploadModal] = useState(false);

    const { role } = useAuthContext();

    const columns = React.useMemo(() => TeamColumns(), []);

    const table = useReactTable({
        data: teamMembers,
        columns,
        state: { sorting, columnFilters },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setFilterValue(value);
        table.getColumn("name")?.setFilterValue(value);
    };

    return (
        <div className=" p-4 bg-background min-h-screen">
            <div className="flex justify-between mb-4">
                <FormField
                    placeholder="Filter offers..."
                    value={table.getColumn("title")?.getFilterValue() ?? ""}
                    onChange={(e) =>
                        table.getColumn("title")?.setFilterValue(e.target.value)
                    }
                    className="max-w-sm"
                />
                <div className="flex gap-2">
                    <Button onClick={() => setShowUploadModal(true)} variant="outline">
                        <Upload className="mr-2 h-4 w-4" /> Upload CSV
                    </Button>
                    <Link to={`/${role}/offer/new`}>
                        <Button>Add New Offer</Button>
                    </Link>
                </div>
            </div>

            <DataTable
                table={table}
                columns={columns}
                isInvoiceTable={false}
            //   isLoading={isLoading}
            />
            <CSVUploadModal
                open={showUploadModal}
                onClose={() => setShowUploadModal(false)}
                uploadUrl={`${import.meta.env.VITE_BACKEND_URL}/uploadOffers`}
            />
        </div>
    );
}
