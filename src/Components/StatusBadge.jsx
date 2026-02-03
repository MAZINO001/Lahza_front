import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// const statusConfig = {
//   draft: {
//     label: "Draft",
//     color: "bg-background text-gray-800 border-border",
//   },
//   sent: {
//     label: "Sent",
//     color: "bg-yellow-100 text-yellow-800 border-border",
//   },
//   confirmed: {
//     label: "Confirmed",
//     color: "bg-blue-100 text-blue-800 border-border",
//   },
//   signed: {
//     label: "Signed",
//     color: "bg-green-100 text-green-800 border-border",
//   },
//   rejected: {
//     label: "Rejected",
//     color: "bg-red-100 text-red-800 border-border",
//   },
//   unpaid: {
//     label: "Unpaid",
//     color: "bg-orange-100 text-orange-800 border-border",
//   },
//   partially_paid: {
//     label: "Partially Paid",
//     color: "bg-yellow-100 text-yellow-800 border-border text-center",
//   },
//   paid: {
//     label: "Paid",
//     color: "bg-green-100 text-green-800 border-border",
//   },
//   overdue: {
//     label: "Overdue",
//     color: "bg-red-100 text-red-800 border-border",
//   },
//   active: {
//     label: "Active",
//     color: "bg-green-100 text-green-800 border-border",
//   },
//   inactive: {
//     label: "Inactive",
//     color: "bg-background text-foreground border-border",
//     description : ""
//   },
//   pending: {
//     label: "Pending",
//     color: "bg-purple-100 text-purple-800 border-border",
//   },
//   in_progress: {
//     label: "In Progress",
//     color: "bg-indigo-100 text-indigo-800 border-border",
//   },
//   completed: {
//     label: "Completed",
//     color: "bg-green-100 text-green-800 border-border",
//   },
//   cancelled: {
//     label: "Cancelled",
//     color: "bg-red-100 text-red-800 border-border",
//   },
//   "waiting-confirmation": {
//     label: "Waiting Confirmation",
//     color: "bg-cyan-100 text-cyan-800 border-border",
//   },
// };


const statusConfig = {
  draft: {
    label: "Draft",
    color: "bg-background text-gray-800 border-border",
    description: "The item is still being prepared and hasn’t been sent or finalized yet.",
  },
  sent: {
    label: "Sent",
    color: "bg-yellow-100 text-yellow-800 border-border",
    description: "The item has been sent to the recipient but no response has been received yet.",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-800 border-border",
    description: "The recipient has reviewed and confirmed the item.",
  },
  signed: {
    label: "Signed",
    color: "bg-green-100 text-green-800 border-border",
    description: "The item has been officially signed and accepted.",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800 border-border",
    description: "The item was reviewed but explicitly declined by the recipient.",
  },
  unpaid: {
    label: "Unpaid",
    color: "bg-orange-100 text-orange-800 border-border",
    description: "No payment has been made yet for this item.",
  },
  partially_paid: {
    label: "Partially Paid",
    color: "bg-yellow-100 text-yellow-800 border-border text-center",
    description: "Only part of the required payment has been completed.",
  },
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800 border-border",
    description: "The full payment has been successfully completed.",
  },
  overdue: {
    label: "Overdue",
    color: "bg-red-100 text-red-800 border-border",
    description: "The payment or action is past its due date and still unresolved.",
  },
  active: {
    label: "Active",
    color: "bg-green-100 text-green-800 border-border",
    description: "The item is currently active and in effect.",
  },
  inactive: {
    label: "Inactive",
    color: "bg-background text-foreground border-border",
    description: "The item exists but is not currently active or in use.",
  },
  pending: {
    label: "Pending",
    color: "bg-purple-100 text-purple-800 border-border",
    description: "The item is waiting for an action or decision to move forward.",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-indigo-100 text-indigo-800 border-border",
    description: "Work on the item has started and is currently ongoing.",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-800 border-border",
    description: "All required actions have been finished successfully.",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800 border-border",
    description: "The item was intentionally stopped and will not continue.",
  },
  "waiting-confirmation": {
    label: "Waiting Confirmation",
    color: "bg-cyan-100 text-cyan-800 border-border",
    description: "The item is awaiting confirmation before proceeding.",
  },
};



export function StatusBadge({ status, type = "default", is_fully_signed, showTooltip = true, tooltip }) {
  const effectiveStatus = is_fully_signed ? "signed" : status;
  const config = statusConfig[effectiveStatus] || {
    label: status,
    color: "bg-slate-100 text-muted-foreground border-border",
    description: `Status: ${status}`,
  };

  const tooltipText = tooltip || config.description;

  const badgeContent = type === "dot" ? (
    <span className="flex items-center text-sm">
      <span
        className={`w-2 h-2 rounded-full mr-2 ${config.color.split(" ")[0]}`}
      ></span>
      {config.label}
    </span>
  ) : (
    <span
      className={`inline-flex justify-center items-center px-2.5 py-0.5 w-22 rounded-full text-xs font-medium border ${config.color}`}
    >
      {config.label}
    </span>
  );

  if (showTooltip && tooltipText) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent sideOffset={5} className="bg-gray-900 text-white">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badgeContent;
}
