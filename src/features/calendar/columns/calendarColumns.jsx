export default function calendarColumns() {
  return [
    {
      header: "Title",
      accessorFn: (row) => row.title ?? "-",
      cell: ({ getValue }) => (
        <span className="font-medium text-foreground">{getValue()}</span>
      ),
    },

    {
      header: "Color",
      accessorFn: (row) => row.color ?? "#3b82f6",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border border-gray-300"
            style={{ backgroundColor: getValue() }}
          />
          <span className="text-xs text-muted-foreground">{getValue()}</span>
        </div>
      ),
    },

    {
      header: "Date",
      accessorFn: (row) =>
        row.start_date && row.end_date
          ? `${row.start_date} → ${row.end_date}`
          : "-",
      cell: ({ getValue }) => (
        <span className="text-muted-foreground">{getValue()}</span>
      ),
    },

    {
      header: "Time",
      accessorFn: (row) =>
        row.start_hour && row.end_hour
          ? `${row.start_hour} - ${row.end_hour}`
          : "-",
    },

    {
      header: "Category",
      accessorFn: (row) => row.category ?? "-",
      cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
    },

    {
      header: "Type",
      accessorFn: (row) => row.type ?? "-",
      cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
    },

    {
      header: "Repeat",
      accessorFn: (row) => row.repeatedly ?? "no",
      cell: ({ getValue }) => (
        <span className="capitalize text-muted-foreground">{getValue()}</span>
      ),
    },

    {
      header: "Status",
      accessorFn: (row) => row.status ?? "-",
      cell: ({ getValue }) => (
        <span
          className={`font-medium ${getValue() === "confirmed" ? "text-green-600" : "text-yellow-600"
            }`}
        >
          {getValue()}
        </span>
      ),
    },
  ];
}
