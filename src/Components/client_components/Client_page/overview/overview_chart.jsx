import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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
export default function Overview_chart({ formatCurrency }) {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

  const incomeExpenseData = [
    { month: "May 2025", income: 0, expense: 0 },
    { month: "Jun 2025", income: 1500, expense: 800 },
    { month: "Jul 2025", income: 2300, expense: 1200 },
    { month: "Aug 2025", income: 1800, expense: 900 },
    { month: "Sep 2025", income: 2800, expense: 1400 },
    { month: "Oct 2025", income: 2200, expense: 1100 },
    { month: "Nov 2025", income: 3200, expense: 1600 },
  ];

  const chartData = incomeExpenseData;
  const maxValue = Math.max(
    0,
    ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0))
  );

  const totalIncome = chartData.reduce((sum, d) => sum + (d.income || 0), 0);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">
              Income and Expense
            </CardTitle>
            <CardDescription className="text-xs text-gray-500 mt-1">
              This chart is displayed in the organization's base currency.
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
              >
                {selectedPeriod}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
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
        <div className="relative h-48 border-l-2 border-b-2 border-gray-200">
          <div className="absolute inset-0 flex items-end justify-around px-4 pb-8">
            {chartData.slice(-7).map((data, index) => {
              const incomeHeight =
                maxValue > 0 ? (data.income / maxValue) * 100 : 0;
              const expenseHeight =
                maxValue > 0 ? (data.expense / maxValue) * 100 : 0;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 max-w-[60px]"
                >
                  <div className="w-full flex gap-1 items-end justify-center mb-2">
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
            {chartData.slice(-7).map((data, index) => (
              <div key={index} className="flex-1 max-w-[60px] text-center">
                <span className="text-xs text-gray-500">
                  {data.month.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-600">Expense</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Total Income ({selectedPeriod})
            </span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(totalIncome)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
