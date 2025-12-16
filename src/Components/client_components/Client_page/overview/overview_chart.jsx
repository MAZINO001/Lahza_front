/* eslint-disable no-case-declarations */
// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useState } from "react";
// import { ChevronDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
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
// import { usePayments } from "@/features/payments/hooks/usePaymentQuery";
// export default function Overview_chart({ formatCurrency }) {
//   const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

//   const formatMonth = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       month: "short",
//       year: "numeric",
//     });
//   };

//   const { data: payments = [] } = usePayments();

//   const transformPaymentsToChartData = (payments) => {
//     const map = {};

//     payments.forEach((payment) => {
//       const month = formatMonth(payment.created_at);
//       const amount = Number(payment.amount);

//       if (!map[month]) {
//         map[month] = {
//           month,
//           income: 0,
//           expense: 0,
//         };
//       }

//       if (payment.status === "paid") {
//         map[month].income += amount;
//       } else {
//         map[month].expense += amount;
//       }
//     });

//     return Object.values(map);
//   };

//   const incomeExpenseData = React.useMemo(
//     () => transformPaymentsToChartData(payments),
//     [payments]
//   );

//   const chartData = incomeExpenseData;
//   const maxValue = Math.max(
//     0,
//     ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0))
//   );

//   const totalIncome = chartData.reduce((sum, d) => sum + (d.income || 0), 0);

//   return (
//     <Card className="p-0">
//       <CardHeader className="p-4">
//         <div className="flex items-start justify-between">
//           <div>
//             <CardTitle className="text-base font-semibold text-gray-900">
//               Income and Expense
//             </CardTitle>
//             <CardDescription className="text-xs text-gray-500 mt-1"></CardDescription>
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
//             {chartData.slice(-7).map((data, index) => {
//               const incomeHeight =
//                 maxValue > 0 ? (data.income / maxValue) * 100 : 0;
//               const expenseHeight =
//                 maxValue > 0 ? (data.expense / maxValue) * 100 : 0;

//               return (
//                 <div
//                   key={index}
//                   className="flex flex-col items-center flex-1 max-w-[60px]"
//                 >
//                   <div className="w-full flex gap-1 items-end justify-center mb-2">
//                     <div
//                       className="w-1/2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
//                       style={{
//                         height: `${incomeHeight}%`,
//                         minHeight: incomeHeight > 0 ? "4px" : "0",
//                       }}
//                       title={`Income: ${formatCurrency(data.income)}`}
//                     />
//                     <div
//                       className="w-1/2 bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
//                       style={{
//                         height: `${expenseHeight}%`,
//                         minHeight: expenseHeight > 0 ? "4px" : "0",
//                       }}
//                       title={`Expense: ${formatCurrency(data.expense)}`}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
//             {chartData.slice(-7).map((data, index) => (
//               <div key={index} className="flex-1 max-w-[60px] text-center">
//                 <span className="text-xs text-gray-500">
//                   {data.month.split(" ")[0]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-4 flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-blue-500 rounded"></div>
//             <span className="text-xs text-gray-600">Income</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="w-3 h-3 bg-orange-500 rounded"></div>
//             <span className="text-xs text-gray-600">Expense</span>
//           </div>
//         </div>

//         <div className="mt-4 pt-4 border-t border-border">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-gray-600">
//               Total Income ({selectedPeriod})
//             </span>
//             <span className="font-semibold text-gray-900">
//               {formatCurrency(totalIncome)}
//             </span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePayments } from "@/features/payments/hooks/usePaymentQuery";

export default function Overview_chart({ formatCurrency }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const { data: payments = [] } = usePayments();

  // Get the number of months based on selected period
  const getMonthsCount = (period) => {
    switch (period) {
      case "Last 3 Months":
        return 3;
      case "Last 6 Months":
        return 6;
      case "Last 12 Months":
        return 12;
      case "This Year":
        const currentMonth = new Date().getMonth() + 1;
        return currentMonth;
      default:
        return 6;
    }
  };

  // Generate array of months based on period
  const generateMonthsArray = (monthsCount) => {
    const months = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(formatMonth(date.toISOString()));
    }

    return months;
  };

  const transformPaymentsToChartData = (payments, monthsCount) => {
    const monthsArray = generateMonthsArray(monthsCount);
    const map = {};

    // Initialize all months with 0 values
    monthsArray.forEach((month) => {
      map[month] = {
        month,
        income: 0,
        expense: 0,
      };
    });

    // Fill in actual payment data
    payments.forEach((payment) => {
      const month = formatMonth(payment.created_at);
      const amount = Number(payment.amount);

      if (map[month]) {
        if (payment.status === "paid") {
          map[month].expense += amount;
        } else {
          map[month].income += amount;
        }
      }
    });

    return monthsArray.map((month) => map[month]);
  };

  const monthsCount = getMonthsCount(selectedPeriod);
  const chartData = React.useMemo(
    () => transformPaymentsToChartData(payments, monthsCount),
    [payments, selectedPeriod]
  );

  const maxValue =
    Math.max(
      1,
      ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0))
    ) * 0.8;

  const totalIncome = chartData.reduce((sum, d) => sum + (d.income || 0), 0);
  const totalExpense = chartData.reduce((sum, d) => sum + (d.expense || 0), 0);

  return (
    <Card className="p-0">
      <CardHeader className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              Income and Expense
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-1"></CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                variant="outline"
                className="text-xs flex p-2 border border-border rounded-md "
              >
                {selectedPeriod}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => setSelectedPeriod("Last 3 Months")}
              >
                Last 3 Months
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedPeriod("Last 6 Months")}
              >
                Last 6 Months
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedPeriod("Last 12 Months")}
              >
                Last 12 Months
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedPeriod("This Year")}>
                This Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="relative h-48 border-l-2 border-b-2 border-border">
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
            {chartData.map((data, index) => {
              const incomeHeight =
                maxValue > 0 ? (data.income / maxValue) * 100 : 0;
              const expenseHeight =
                maxValue > 0 ? (data.expense / maxValue) * 100 : 0;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 max-w-20"
                >
                  <div className="w-full flex gap-2 items-end justify-center mb-2">
                    <div
                      className="w-1/2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{
                        height: `${incomeHeight}%`,
                        minHeight: incomeHeight > 0 ? "4px" : "0",
                      }}
                      title={`Income: ${formatCurrency(data.income)}`}
                    />
                    <div
                      className="w-1/2 bg-orange-500 rounded-t transition-all duration-300 hover:bg-orange-600"
                      style={{
                        height: `${expenseHeight}%`,
                        minHeight: expenseHeight > 0 ? "4px" : "0",
                      }}
                      title={`Expense: ${formatCurrency(data.expense)}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-around px-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 max-w-20 text-center">
                <span className="text-xs text-gray-500">
                  {data.month.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">Expense</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total Income ({selectedPeriod})
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total Expense ({selectedPeriod})
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalExpense)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
