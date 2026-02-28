// /* eslint-disable no-case-declarations */
// // /* eslint-disable react-hooks/exhaustive-deps */
// // import React, { useState } from "react";
// // import { ChevronDown } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { usePayments } from "@/features/payments/@/features/payments/hooks/usePayments/usePaymentsData";
// // export default function Overview_chart({ formatAmount }) {
// //   const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

// //   const formatMonth = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleString("en-US", {
// //       month: "short",
// //       year: "numeric",
// //     });
// //   };

// //   const { data: payments = [] } = usePayments();

// //   const transformPaymentsToChartData = (payments) => {
// //     const map = {};

// //     payments.forEach((payment) => {
// //       const month = formatMonth(payment.created_at);
// //       const amount = Number(payment.amount);

// //       if (!map[month]) {
// //         map[month] = {
// //           month,
// //           income: 0,
// //           expense: 0,
// //         };
// //       }

// //       if (payment.status === "paid") {
// //         map[month].income += amount;
// //       } else {
// //         map[month].expense += amount;
// //       }
// //     });

// //     return Object.values(map);
// //   };

// //   const incomeExpenseData = React.useMemo(
// //     () => transformPaymentsToChartData(payments),
// //     [payments]
// //   );

// //   const chartData = incomeExpenseData;
// //   const maxValue = Math.max(
// //     0,
// //     ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0))
// //   );

// //   const totalIncome = chartData.reduce((sum, d) => sum + (d.income || 0), 0);

// //   return (
// //     <Card>
// //       <CardHeader>
// //         <div className="flex items-start justify-between">
// //           <div>
// //             <CardTitle className="text-base font-semibold text-foreground">
// //               Income and Expense
// //             </CardTitle>
// //             <CardDescription className="text-xs text-muted-foreground mt-1"></CardDescription>
// //           </div>
// //           <DropdownMenu>
// //             <DropdownMenuTrigger asChild>
// //               <button
// //                 variant="outline"
// //                 className="text-xs flex p-2 border border-border rounded-md "
// //               >
// //                 {selectedPeriod}
// //                 <ChevronDown className="ml-2 h-4 w-4" />
// //               </button>
// //             </DropdownMenuTrigger>
// //             <DropdownMenuContent align="end">
// //               <DropdownMenuItem
// //                 onClick={() => setSelectedPeriod("Last 3 Months")}
// //               >
// //                 Last 3 Months
// //               </DropdownMenuItem>
// //               <DropdownMenuItem
// //                 onClick={() => setSelectedPeriod("Last 6 Months")}
// //               >
// //                 Last 6 Months
// //               </DropdownMenuItem>
// //               <DropdownMenuItem
// //                 onClick={() => setSelectedPeriod("Last 12 Months")}
// //               >
// //                 Last 12 Months
// //               </DropdownMenuItem>
// //               <DropdownMenuItem onClick={() => setSelectedPeriod("This Year")}>
// //                 This Year
// //               </DropdownMenuItem>
// //             </DropdownMenuContent>
// //           </DropdownMenu>
// //         </div>
// //       </CardHeader>

// //       <CardContent>
// //         <div className="relative h-48 border-l-2 border-b-2 border-border">
// //           <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
// //             {chartData.slice(-7).map((data, index) => {
// //               const incomeHeight =
// //                 maxValue > 0 ? (data.income / maxValue) * 100 : 0;
// //               const expenseHeight =
// //                 maxValue > 0 ? (data.expense / maxValue) * 100 : 0;

// //               return (
// //                 <div
// //                   key={index}
// //                   className="flex flex-col items-center flex-1 max-w-[60px]"
// //                 >
// //                   <div className="w-full flex gap-1 items-end justify-center mb-2">
// //                     <div
// //                       className="w-1/2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
// //                       style={{
// //                         height: `${incomeHeight}%`,
// //                         minHeight: incomeHeight > 0 ? "4px" : "0",
// //                       }}
// //                       title={`Income: ${formatAmount(data.income)}`}
// //                     />
// //                     <div
// //                       className="w-1/2 bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
// //                       style={{
// //                         height: `${expenseHeight}%`,
// //                         minHeight: expenseHeight > 0 ? "4px" : "0",
// //                       }}
// //                       title={`Expense: ${formatAmount(data.expense)}`}
// //                     />
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>

// //           <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
// //             {chartData.slice(-7).map((data, index) => (
// //               <div key={index} className="flex-1 max-w-[60px] text-center">
// //                 <span className="text-xs text-muted-foreground">
// //                   {data.month.split(" ")[0]}
// //                 </span>
// //               </div>
// //             ))}
// //           </div>
// //         </div>

// //         <div className="mt-4 flex items-center gap-4">
// //           <div className="flex items-center gap-2">
// //             <div className="w-3 h-3 bg-blue-500 rounded"></div>
// //             <span className="text-xs text-muted-foreground">Income</span>
// //           </div>
// //           <div className="flex items-center gap-2">
// //             <div className="w-3 h-3 bg-orange-500 rounded"></div>
// //             <span className="text-xs text-muted-foreground">Expense</span>
// //           </div>
// //         </div>

// //         <div className="mt-4 pt-4 border-t border-border">
// //           <div className="flex items-center justify-between text-sm">
// //             <span className="text-muted-foreground">
// //               Total Income ({selectedPeriod})
// //             </span>
// //             <span className="font-semibold text-foreground">
// //               {formatAmount(totalIncome)}
// //             </span>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState } from "react";
// import { ChevronDown } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";

// export default function Overview_chart({ formatAmount, currentId }) {
//   const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

//   const formatMonth = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       month: "short",
//       year: "numeric",
//     });
//   };
//   const { data: Payments = [] } = usePayments();

//   const filteredData = Payments.filter(
//     (payment) =>
//       payment.client_id === Number(currentId) && payment.status === "paid",
//   );

//   const getMonthsCount = (period) => {
//     switch (period) {
//       case "Last 3 Months":
//         return 3;
//       case "Last 6 Months":
//         return 6;
//       case "Last 12 Months":
//         return 12;
//       case "This Year":
//         const currentMonth = new Date().getMonth() + 1;
//         return currentMonth;
//       default:
//         return 6;
//     }
//   };

//   // Generate array of months based on period
//   const generateMonthsArray = (monthsCount) => {
//     const months = [];
//     const now = new Date();

//     for (let i = monthsCount - 1; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       months.push(formatMonth(date.toISOString()));
//     }

//     return months;
//   };

//   const transformPaymentsToChartData = (payments, monthsCount) => {
//     const monthsArray = generateMonthsArray(monthsCount);
//     const map = {};

//     // Initialize all months with 0 values
//     monthsArray.forEach((month) => {
//       map[month] = {
//         month,
//         income: 0,
//         expense: 0,
//       };
//     });

//     // Fill in actual payment data
//     filteredData?.forEach((payment) => {
//       const month = formatMonth(payment.created_at);
//       const amount = Number(payment.amount);

//       if (map[month]) {
//         if (payment.status === "paid") {
//           map[month].expense += amount;
//         } else {
//           map[month].income += amount;
//         }
//       }
//     });

//     return monthsArray.map((month) => map[month]);
//   };

//   const monthsCount = getMonthsCount(selectedPeriod);
//   const chartData = React.useMemo(
//     () => transformPaymentsToChartData(filteredData, monthsCount),
//     [filteredData, selectedPeriod],
//   );

//   const maxValue =
//     Math.max(
//       1,
//       ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0)),
//     ) * 0.8;

//   const totalIncome = chartData.reduce((sum, d) => sum + (d.income || 0), 0);
//   const totalExpense = chartData.reduce((sum, d) => sum + (d.expense || 0), 0);

//   return (
//     <Card>
//       <CardHeader>
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-base font-semibold text-foreground">
//               Income and Expense
//             </CardTitle>
//             <CardDescription className="text-xs text-muted-foreground mt-1"></CardDescription>
//           </div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button
//                 variant="outline"
//                 className="text-xs flex p-2 border border-border rounded-md "
//               >
//                 {selectedPeriod}
//                 <ChevronDown className="ml-2 h-4 w-4" />
//               </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem
//                 onClick={() => setSelectedPeriod("Last 3 Months")}
//               >
//                 Last 3 Months
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setSelectedPeriod("Last 6 Months")}
//               >
//                 Last 6 Months
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => setSelectedPeriod("Last 12 Months")}
//               >
//                 Last 12 Months
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => setSelectedPeriod("This Year")}>
//                 This Year
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </CardHeader>

//       <CardContent>
//         <div className="relative h-48 border-l-2 border-b-2 border-border">
//           <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
//             {chartData.map((data, index) => {
//               const incomeHeight =
//                 maxValue > 0 ? (data.income / maxValue) * 100 : 0;
//               const expenseHeight =
//                 maxValue > 0 ? (data.expense / maxValue) * 100 : 0;

//               return (
//                 <div
//                   key={index}
//                   className="flex flex-col items-center flex-1 max-w-20"
//                 >
//                   <div className="w-full flex gap-2 items-end justify-center mb-2">
//                     <div
//                       className="w-1/2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
//                       style={{
//                         height: `${incomeHeight}%`,
//                         minHeight: incomeHeight > 0 ? "4px" : "0",
//                       }}
//                       title={`Income: ${formatAmount(data.income)}`}
//                     />
//                     <div
//                       className="w-1/2 bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
//                       style={{
//                         height: `${expenseHeight}%`,
//                         minHeight: expenseHeight > 0 ? "4px" : "0",
//                       }}
//                       title={`Expense: ${formatAmount(data.expense)}`}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
//             {chartData.map((data, index) => (
//               <div key={index} className="flex-1 max-w-20 text-center">
//                 <span className="text-xs text-muted-foreground">
//                   {data.month.split(" ")[0]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-4 flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-blue-500 rounded"></div>
//             <span className="text-xs text-muted-foreground">Income</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-orange-500 rounded"></div>
//             <span className="text-xs text-muted-foreground">Expense</span>
//           </div>
//         </div>

//         <div className="mt-4 pt-4 border-t border-border space-y-2">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">
//               Total Income ({selectedPeriod})
//             </span>
//             <span className="font-semibold text-foreground">
//               {formatAmount(totalIncome)}
//             </span>
//           </div>
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">
//               Total Expense ({selectedPeriod})
//             </span>
//             <span className="font-semibold text-foreground">
//               {formatAmount(totalExpense)}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";

const PERIODS = [
  "Last 3 Months",
  "Last 6 Months",
  "Last 12 Months",
  "This Year",
];

export default function OverviewChart({ formatAmount, currentId }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

  const { data: payments = [] } = usePayments();

  const filteredPayments = useMemo(
    () => payments.filter((p) => String(p.client_id) === String(currentId)),
    [payments, currentId],
  );

  const getMonthsCount = (period) => {
    switch (period) {
      case "Last 3 Months":
        return 3;
      case "Last 6 Months":
        return 6;
      case "Last 12 Months":
        return 12;
      case "This Year":
        return new Date().getMonth() + 1;
      default:
        return 6;
    }
  };

  const generateMonthKeys = (count) => {
    const months = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(
        d.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      );
    }
    return months;
  };

  const chartData = useMemo(() => {
    const months = generateMonthKeys(getMonthsCount(selectedPeriod));
    const map = Object.fromEntries(
      months.map((m) => [m, { month: m, income: 0, expense: 0 }]),
    );

    filteredPayments.forEach((payment) => {
      const month = new Date(payment.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (month in map) {
        const amount = Number(payment.amount) || 0;
        if (payment.status === "paid") {
          map[month].income += amount; // ← most common: paid = income
        } else {
          map[month].expense += amount;
        }
      }
    });

    return months.map((m) => map[m]);
  }, [filteredPayments, selectedPeriod]);

  // Visual max = 50 000 (but real data can be higher — they just get full height)
  const VISUAL_MAX = 50000;
  const maxValue = Math.max(
    VISUAL_MAX,
    ...chartData.map((d) => Math.max(d.income, d.expense)),
  );

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpense = chartData.reduce((sum, d) => sum + d.expense, 0);

  return (
    <Card className="border bg-card text-card-foreground shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg font-medium leading-none tracking-tight">
            Income & Expenses
          </CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 rounded-md",
                  "border border-input bg-background px-3 py-1.5 text-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                )}
              >
                {selectedPeriod}
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[140px]">
              {PERIODS.map((period) => (
                <DropdownMenuItem
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={cn(
                    selectedPeriod === period &&
                      "bg-accent text-accent-foreground",
                  )}
                >
                  {period}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chart area */}
        <div className="relative h-64 border-l border-b border-border/60">
          <div className="absolute inset-0 flex items-end justify-between px-2 pb-10">
            {chartData.map((data, i) => {
              const incomePct = Math.min(100, (data.income / maxValue) * 100);
              const expensePct = Math.min(100, (data.expense / maxValue) * 100);

              return (
                <div
                  key={i}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <div className="flex h-full w-full max-w-[42px] items-end gap-1.5">
                    {/* Income bar */}
                    <div
                      className="w-full bg-blue-600/90 transition-all group-hover:bg-blue-600"
                      style={{ height: `${incomePct}%` }}
                      title={`Income: ${formatAmount(data.income || 0, "MAD")}`}
                    />
                    {/* Expense bar */}
                    <div
                      className="w-full bg-amber-600/90 transition-all group-hover:bg-amber-600"
                      style={{ height: `${expensePct}%` }}
                      title={`Expense: ${formatAmount(data.expense || 0, "MAD")}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pt-2">
            {chartData.map((data, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-xs text-muted-foreground tracking-tight">
                  {data.month.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600/90" />
            <span className="text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-amber-600/90" />
            <span className="text-muted-foreground">Expense</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-border/60 pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Income</span>
            <span className="font-medium">
              {formatAmount(totalIncome || 0, "MAD")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Expense</span>
            <span className="font-medium">
              {formatAmount(totalExpense || 0, "MAD")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
