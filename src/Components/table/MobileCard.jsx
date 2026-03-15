// import React from "react";
// import { flexRender } from "@tanstack/react-table";
// import PaymentDetails from "@/features/documents/components/PaymentDetails";

// function isActionsColumn(col) {
//   const id = (col.id ?? col.accessorKey ?? "").toLowerCase();
//   return (
//     id === "actions" ||
//     id === "action" ||
//     (!col.accessorKey && !col.accessorFn && col.id !== "select")
//   );
// }

// function isIdColumn(col) {
//   const id = (col.id ?? col.accessorKey ?? "").toLowerCase();
//   return (
//     id === "id" ||
//     id === "no" ||
//     id === "number" ||
//     id === "name" ||
//     id === "title" ||
//     id === "label" ||
//     id === "reference" ||
//     id === "ref"
//   );
// }

// function formatFallbackLabel(str = "") {
//   return str
//     .replace(/[-_]/g, " ")
//     .replace(/([a-z])([A-Z])/g, "$1 $2")
//     .replace(/\b\w/g, (c) => c.toUpperCase())
//     .trim();
// }

// function getLabelFromHeader(header) {
//   if (!header) return null;

//   const rendered = flexRender(
//     header.column.columnDef.header,
//     header.getContext(),
//   );

//   if (typeof rendered === "string" && rendered.trim()) return rendered.trim();

//   const extractText = (node) => {
//     if (!node) return "";
//     if (typeof node === "string") return node;
//     if (typeof node === "number") return String(node);
//     if (Array.isArray(node)) return node.map(extractText).join("").trim();
//     if (node?.props?.children) return extractText(node.props.children);
//     return "";
//   };
//   const text = extractText(rendered);
//   if (text.trim()) return text.trim();

//   const raw = header.column.columnDef.accessorKey ?? header.column.id ?? "";
//   if (raw) return formatFallbackLabel(raw);

//   return null;
// }

// export default function MobileCard({
//   row,
//   columns,
//   headerMap,
//   isInvoiceTable,
//   onRowClick,
// }) {
//   const getCellForCol = (col) =>
//     row
//       .getVisibleCells()
//       .find((c) => c.column.id === (col.id ?? col.accessorKey));

//   const actionCols = columns.filter(isActionsColumn);
//   const nonActionCols = columns.filter((col) => !isActionsColumn(col));

//   // Find the primary "header" column — named id/title/name/etc.
//   // If none match, just use the very first non-action column.
//   const idCol = nonActionCols.find(isIdColumn) ?? nonActionCols[0];
//   const dataCols = nonActionCols.filter((col) => col !== idCol);

//   const iconActionCols = actionCols.filter((col) => {
//     const label = getLabelFromHeader(headerMap[col.id ?? col.accessorKey]);
//     return !label || ["actions", "action"].includes(label.toLowerCase());
//   });
//   const labelActionCols = actionCols.filter(
//     (col) => !iconActionCols.includes(col),
//   );

//   const idCell = idCol ? getCellForCol(idCol) : null;

//   const handleCardClick = () => {
//     if (isInvoiceTable) row.toggleExpanded();
//     else if (onRowClick) onRowClick(row.original);
//   };

//   return (
//     <div
//       className="bg-background rounded-xl border border-border shadow-sm overflow-hidden cursor-pointer transition-all active:scale-[0.99] hover:shadow-md hover:border-border/80"
//       onClick={handleCardClick}
//     >
//       {/* ── Header: primary value + icon actions ── */}
//       <div className="flex items-center justify-between p-2 border-b border-border">
//         <span className="text-sm font-semibold text-foreground truncate">
//           {idCell
//             ? flexRender(idCell.column.columnDef.cell, idCell.getContext())
//             : "—"}
//         </span>

//         {iconActionCols.length > 0 && (
//           <div
//             className="flex items-center gap-1 shrink-0"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {iconActionCols.map((col) => {
//               const cell = getCellForCol(col);
//               if (!cell) return null;
//               return (
//                 <React.Fragment key={cell.id}>
//                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* ── Body: label / value rows ── */}
//       <div>
//         {dataCols.map((col, i) => {
//           const cell = getCellForCol(col);
//           if (!cell) return null;
//           const label = getLabelFromHeader(
//             headerMap[col.id ?? col.accessorKey],
//           );
//           return (
//             <div
//               key={cell.id}
//               className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
//                 i % 2 === 0 ? "bg-background" : "bg-muted/30"
//               }`}
//             >
//               <span className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0 w-[38%]">
//                 {label ?? ""}
//               </span>
//               <span className="text-muted-foreground/40 text-xs shrink-0">
//                 :
//               </span>
//               <span className="text-sm text-foreground text-right flex-1 min-w-0 truncate">
//                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* ── Footer: labelled action buttons ── */}
//       {labelActionCols.length > 0 && (
//         <div
//           className="border-t border-border bg-muted/40 px-4 py-2.5 flex items-center gap-2 flex-wrap"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {labelActionCols.map((col) => {
//             const cell = getCellForCol(col);
//             if (!cell) return null;
//             return (
//               <React.Fragment key={cell.id}>
//                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
//               </React.Fragment>
//             );
//           })}
//         </div>
//       )}

//       {/* ── Expanded invoice details ── */}
//       {isInvoiceTable && row.getIsExpanded() && (
//         <div className="border-t border-border p-4 bg-muted/20">
//           <PaymentDetails invoiceId={row.original.id} />
//         </div>
//       )}
//     </div>
//   );
// }

import React from "react";
import { flexRender } from "@tanstack/react-table";
import PaymentDetails from "@/features/documents/components/PaymentDetails";

function isActionsColumn(col) {
  const id = (col.id ?? col.accessorKey ?? "").toLowerCase();
  return (
    id === "actions" ||
    id === "action" ||
    (!col.accessorKey && !col.accessorFn && col.id !== "select")
  );
}

function isIdColumn(col) {
  const id = (col.id ?? col.accessorKey ?? "").toLowerCase();
  return (
    id === "id" ||
    id === "no" ||
    id === "number" ||
    id === "name" ||
    id === "title" ||
    id === "label" ||
    id === "reference" ||
    id === "ref" ||
    id === "full_name"
  );
}

function formatFallbackLabel(str = "") {
  return str
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function getLabelFromHeader(header) {
  if (!header) return null;

  const rendered = flexRender(
    header.column.columnDef.header,
    header.getContext(),
  );

  if (typeof rendered === "string" && rendered.trim()) return rendered.trim();

  const extractText = (node) => {
    if (!node) return "";
    if (typeof node === "string") return node;
    if (typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("").trim();
    if (node?.props?.children) return extractText(node.props.children);
    return "";
  };
  const text = extractText(rendered);
  if (text.trim()) return text.trim();

  const raw = header.column.columnDef.accessorKey ?? header.column.id ?? "";
  if (raw) return formatFallbackLabel(raw);

  return null;
}

export default function MobileCard({
  row,
  columns,
  headerMap,
  isInvoiceTable,
  onRowClick,
}) {
  const getCellForCol = (col) =>
    row
      .getVisibleCells()
      .find((c) => c.column.id === (col.id ?? col.accessorKey));

  // 1. Drop any column flagged hideOnMobile
  const visibleCols = columns.filter((col) => !col.hideOnMobile);

  // 2. Split into actions vs data
  const actionCols = visibleCols.filter(isActionsColumn);
  const nonActionCols = visibleCols.filter((col) => !isActionsColumn(col));

  // 3. First non-action ID-like column → card header; rest → body rows
  const idCol = nonActionCols.find(isIdColumn) ?? nonActionCols[0];
  const dataCols = nonActionCols.filter((col) => col !== idCol);

  // 4. Icon-only actions (header = "actions"/"action"/empty) → card header right
  //    Labelled actions (e.g. "Send", "View") → card footer
  const iconActionCols = actionCols.filter((col) => {
    const label = getLabelFromHeader(headerMap[col.id ?? col.accessorKey]);
    return !label || ["actions", "action"].includes(label.toLowerCase());
  });
  const labelActionCols = actionCols.filter(
    (col) => !iconActionCols.includes(col),
  );

  const idCell = idCol ? getCellForCol(idCol) : null;

  const handleCardClick = () => {
    if (isInvoiceTable) row.toggleExpanded();
    else if (onRowClick) onRowClick(row.original);
  };

  return (
    <div
      className="bg-background rounded-xl border border-border shadow-sm overflow-hidden cursor-pointer transition-all active:scale-[0.99] hover:shadow-md hover:border-border/80"
      onClick={handleCardClick}
    >
      {/* ── Header: primary value + icon actions ────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-semibold text-foreground truncate mr-2">
          {idCell
            ? flexRender(idCell.column.columnDef.cell, idCell.getContext())
            : "—"}
        </span>

        {iconActionCols.length > 0 && (
          <div
            className="flex items-center gap-1 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {iconActionCols.map((col) => {
              const cell = getCellForCol(col);
              if (!cell) return null;
              return (
                <React.Fragment key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Body: label / value rows ─────────────────────────────────────── */}
      <div>
        {dataCols.map((col, i) => {
          const cell = getCellForCol(col);
          if (!cell) return null;
          const label = getLabelFromHeader(
            headerMap[col.id ?? col.accessorKey],
          );
          return (
            <div
              key={cell.id}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 ${
                i % 2 === 0 ? "bg-background" : "bg-muted/30"
              }`}
            >
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap shrink-0 w-[38%]">
                {label ?? ""}
              </span>
              <span className="text-muted-foreground/40 text-xs shrink-0">
                :
              </span>
              <span className="text-sm text-foreground text-right flex-1 min-w-0 truncate">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Footer: labelled action buttons ──────────────────────────────── */}
      {labelActionCols.length > 0 && (
        <div
          className="border-t border-border bg-muted/40 px-4 py-2.5 flex items-center gap-2 flex-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          {labelActionCols.map((col) => {
            const cell = getCellForCol(col);
            if (!cell) return null;
            return (
              <React.Fragment key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* ── Expanded invoice details ──────────────────────────────────────── */}
      {isInvoiceTable && row.getIsExpanded() && (
        <div className="border-t border-border p-4 bg-muted/20">
          <PaymentDetails invoiceId={row.original.id} />
        </div>
      )}
    </div>
  );
}
