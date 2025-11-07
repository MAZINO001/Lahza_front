const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  
  accepted: {
    label: "Accepted",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  planning: {
    label: "Planning",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  review: {
    label: "Review",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  on_hold: {
    label: "On Hold",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-800 border-red-200",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
  open: { label: "Open", color: "bg-blue-100 text-blue-800 border-blue-200" },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-800 border-green-200",
  },
  closed: {
    label: "Closed",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  todo: {
    label: "To Do",
    color: "bg-slate-100 text-slate-800 border-slate-200",
  },
  low: { label: "Low", color: "bg-slate-100 text-slate-800 border-slate-200" },
  medium: {
    label: "Medium",
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-800 border-orange-200",
  },
  urgent: { label: "Urgent", color: "bg-red-100 text-red-800 border-red-200" },
};

export function StatusBadge({ status, type = "default" }) {
  const config = statusConfig[status] || {
    label: status,
    color: "bg-slate-100 text-slate-800 border-slate-200",
  };

  if (type === "dot") {
    return (
      <span className="flex items-center text-sm">
        <span
          className={`w-2 h-2 rounded-full mr-2 ${config.color.split(" ")[0]}`}
        ></span>
        {config.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex justify-center items-center px-2.5 py-0.5 w-22 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );
}
