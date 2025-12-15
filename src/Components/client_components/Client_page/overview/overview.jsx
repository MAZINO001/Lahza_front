import TimelineComponent from "@/Components/comp-531";
import React, { useState } from "react";
import { Phone, Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
export default function Overview({ data }) {
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName =
    data?.client_type === "company" ? data?.company : data?.user?.name;

  const receivablesData = [
    {
      currency: "USD",
      fullName: "United States Dollar",
      outstanding: 0.0,
      unusedCredits: 0.0,
    },
    {
      currency: "EUR",
      fullName: "Euro",
      outstanding: 0.0,
      unusedCredits: 0.0,
    },
  ];

  const incomeExpenseData = [
    { month: "May 2025", income: 0, expense: 0 },
    { month: "Jun 2025", income: 1500, expense: 800 },
    { month: "Jul 2025", income: 2300, expense: 1200 },
    { month: "Aug 2025", income: 1800, expense: 900 },
    { month: "Sep 2025", income: 2800, expense: 1400 },
    { month: "Oct 2025", income: 2200, expense: 1100 },
    { month: "Nov 2025", income: 3200, expense: 1600 },
  ];

  const paymentDuePeriod = "Due on Receipt";
  const receivables = receivablesData;
  const chartData = incomeExpenseData;
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months");

  const maxValue = Math.max(
    0,
    ...chartData.map((d) => Math.max(d.income || 0, d.expense || 0))
  );

  const totalIncome = chartData.reduce((sum, d) => sum + (d.income || 0), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {displayName}
          </h3>

          <div className="flex items-start gap-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" alt={data?.user?.name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                {getInitials(data?.user?.name || "CL")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="text-base font-medium text-gray-900 mb-1">
                {data?.user?.name}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {data?.user?.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{data?.phone}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Client Info</h3>
          </div>

          <div className="divide-y divide-gray-200">
            <Collapsible open={isAddressOpen} onOpenChange={setIsAddressOpen}>
              <div className="p-6">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isAddressOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <h4 className="text-sm font-semibold text-gray-900">
                        Address
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-500">
                        Street Address
                      </span>
                      <span className="col-span-2 text-sm text-gray-900">
                        {data?.address}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <span className="text-sm text-gray-500">City</span>
                      <span className="col-span-2 text-sm text-gray-900">
                        {data?.city}
                      </span>
                    </div>

                    {data?.state && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-500">State</span>
                        <span className="col-span-2 text-sm text-gray-900">
                          {data?.state}
                        </span>
                      </div>
                    )}

                    {data?.zip_code && (
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-sm text-gray-500">Zip Code</span>
                        <span className="col-span-2 text-sm text-gray-900">
                          {data?.zip_code}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-500">Country</span>
                      <span className="col-span-2 text-sm text-gray-900">
                        {data?.country}
                      </span>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>

            <Collapsible
              open={isAdditionalOpen}
              onOpenChange={setIsAdditionalOpen}
            >
              <div className="p-6">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isAdditionalOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <h4 className="text-sm font-semibold text-gray-900">
                        Additional Data
                      </h4>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-4">
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-500">Tax ID</span>
                      <span className="col-span-2 text-sm text-gray-900">
                        123-45-6789
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-500">
                        Registration Date
                      </span>
                      <span className="col-span-2 text-sm text-gray-900">
                        Jan 15, 2024
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-500">
                        Payment Terms
                      </span>
                      <span className="col-span-2 text-sm text-gray-900">
                        Net 30
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-sm text-gray-500">
                        Credit Limit
                      </span>
                      <span className="col-span-2 text-sm text-gray-900">
                        $50,000
                      </span>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="text-sm text-gray-600 mb-1">
                Payment due period
              </div>
              <div className="text-base font-semibold text-gray-900">
                {paymentDuePeriod}
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Receivables
              </h3>

              <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Outstanding Receivables
                </div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                  Unused Credits
                </div>
              </div>

              {receivables.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0"
                >
                  <div className="text-sm text-gray-900">
                    {item.currency} - {item.fullName}
                  </div>
                  <div className="text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.outstanding)}
                  </div>
                  <div className="text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.unusedCredits)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                  <DropdownMenuItem
                    onClick={() => setSelectedPeriod("This Year")}
                  >
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
        <div className="bg-white max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 p-4 shadow-sm">
          <TimelineComponent />
        </div>
      </div>
    </div>
  );
}
