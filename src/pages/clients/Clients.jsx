/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Eye,
  Trash2,
  Plus,
  X,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClientForm } from "@/Components/auth/ClientForm";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "@/utils/axios";
export const columns = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User ID <ArrowUpDown className="ml-1 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const id = row.getValue("id");
      const formattedId = `CLIENT-${id.toString().padStart(4, "0")}`;
      return (
        <Link
          to={`/admin/client/${id}`}
          className="font-medium text-slate-900 hover:underline"
        >
          {formattedId}
        </Link>
      );
    },
  },
  {
    id: "full_name",
    header: "Full Name",
    accessorFn: (row) => row.user?.name,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    header: "Email",
    accessorFn: (row) => row.user?.email,
    cell: ({ getValue }) => (
      <a href={`mailto:${getValue()}`} className="cursor-pointer">
        {getValue()}
      </a>
    ),
  },

  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => (
      <div className="text-slate-700">{row.getValue("phone")}</div>
    ),
  },
  {
    accessorFn: (row) => row.company || "-",
    header: "Company",
    cell: ({ getValue }) => <div className="font-medium">{getValue()}</div>,
  },
  {
    accessorKey: "client_type",
    header: "Client Type",
    cell: ({ row }) => (
      <span className="text-slate-600">{row.getValue("client_type")}</span>
    ),
  },
  {
    accessorKey: "spending_total",
    header: "Client Type",
    cell: ({ row }) => <span className="text-slate-600">$1200.00</span>,
  },
  // {
  //   accessorKey: "city",
  //   header: "City",
  //   cell: ({ row }) => <div>{row.getValue("city")}</div>,
  // },
  // {
  //   accessorKey: "country",
  //   header: "Country",
  //   cell: ({ row }) => <div>{row.getValue("country")}</div>,
  // },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const user = row.original;

  //     const handleView = () => {
  //       alert(`Viewing ${user.company}`);
  //     };

  //     return (
  //       <div className="flex items-center gap-2">
  //         <Button
  //           size="sm"
  //           variant="outline"
  //           className="h-8"
  //           onClick={handleView}
  //         >
  //           <Eye className="w-4 h-4 mr-1" /> View
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];

export default function UsersTable() {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [loading, setLoading] = useState(true);
  const [Clients, setClients] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState("");

  const table = useReactTable({
    data: Clients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useEffect(() => {
    setLoading(true);

    const res = api
      .get(`${import.meta.env.VITE_BACKEND_URL}/clients`)
      .then((res) => {
        setLoading(false);
        setClients(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch clients:", err);
        setLoading(false);
      });
  }, []);

  // Download clients
  const handleExport = async (format = "csv") => {
    try {
      setMessage("Preparing download...");
      const res = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/export?format=${format}`,
        {
          responseType: "blob",
        }
      );

      const now = new Date().toISOString().replace(/[:.]/g, "-");
      const ext = format === "csv" ? "csv" : "json";
      const filename = `clients-${now}.${ext}`;

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      setMessage(`Downloaded ${filename}`);
    } catch (err) {
      console.error(err);
      setMessage("Export failed");
    }
  };

  // Upload clients file
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadProgress(0);
      const res = await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/uploadClients`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );

      setMessage(res.data.message || "Upload successful!");
      setUploadProgress(0);
      console.log("this is actually working ");
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="w-full p-4">
      <div className="flex items-center justify-between pb-4">
        <Input
          placeholder="Filter by name..."
          value={table.getColumn("full_name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("full_name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex gap-2">
          <Button onClick={() => setShowUploadModal(true)}>
            <ArrowUp /> Upload
          </Button>
          <Button onClick={() => setShowDownloadModal(true)}>
            <ArrowDown /> Download
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus /> Add New
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8"
                >
                  No Clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} Clients total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 w-[90%] max-w-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X />
            </button>
            <ClientForm />
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 w-[90%] max-w-md relative">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X onClick={() => setMessage("")} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Upload Clients File
            </h2>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="mb-4"
            />
            {uploadProgress > 0 && (
              <div className="text-sm text-blue-500">
                Uploading... {uploadProgress}%
              </div>
            )}
            {message && (
              <p className="mt-2 px-4 py-2 text-sm text-green-700 bg-green-100 rounded-md border border-green-200 shadow-sm">
                {message}
              </p>
            )}
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-4 w-[90%] max-w-md relative">
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
            >
              <X onClick={() => setMessage("")} />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Download Clients
            </h2>
            <div className="flex items-center justify-between mb-4">
              <Button onClick={() => handleExport("csv")}>Download CSV</Button>
              <Button onClick={() => handleExport("json")}>
                Download JSON
              </Button>
            </div>
            {message && (
              <p className="mt-2 px-4 py-2 text-sm text-green-700 bg-green-100 rounded-md border border-green-200 shadow-sm">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
