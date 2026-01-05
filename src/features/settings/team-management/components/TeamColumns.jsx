export default function TeamColumns() {
    return [
        {
            header: "Name",
            accessorFn: (row) => row.name ?? "-",
            cell: ({ getValue }) => (
                <span className="font-medium text-foreground">{getValue()}</span>
            ),
        },
        {
            header: "Job Title",
            accessorFn: (row) => row.jobTitle ?? "-",
            cell: ({ getValue }) => (
                <span className="text-muted-foreground">{getValue()}</span>
            ),
        },
        {
            header: "Email",
            accessorFn: (row) => row.email ?? "-",
            cell: ({ getValue }) => (
                <a
                    href={`mailto:${getValue()}`}
                    className="text-foreground hover:underline"
                >
                    {getValue()}
                </a>
            ),
        },
        {
            header: "Phone",
            accessorFn: (row) => row.phone ?? "-",
            cell: ({ getValue }) => (
                <span className="text-muted-foreground">{getValue()}</span>
            ),
        },
        {
            header: "Contract Type",
            accessorFn: (row) => row.contractType ?? "-",
            cell: ({ getValue }) => (
                <span className="capitalize font-medium">{getValue()}</span>
            ),
        },
        {
            header: "Contract Period",
            accessorFn: (row) =>
                row.contractStartDate && row.contractEndDate
                    ? `${row.contractStartDate} → ${row.contractEndDate}`
                    : row.contractStartDate
                        ? `${row.contractStartDate} → Present`
                        : "-",
            cell: ({ getValue }) => (
                <span className="text-muted-foreground text-sm">{getValue()}</span>
            ),
        },
        {
            header: "Salary",
            accessorFn: (row) => row.salary ?? "-",
            cell: ({ getValue }) => (
                <span className="font-medium">${getValue().toLocaleString()}</span>
            ),
        },
        {
            header: "Bank",
            accessorFn: (row) => row.bankName ?? "-",
            cell: ({ getValue }) => (
                <span className="text-muted-foreground">{getValue()}</span>
            ),
        },
        {
            header: "Emergency Contact",
            accessorFn: (row) => row.emergencyContactName ?? "-",
            cell: ({ getValue }) => (
                <span className="text-muted-foreground">{getValue()}</span>
            ),
        },
    ];
}
