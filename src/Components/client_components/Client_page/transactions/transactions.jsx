/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Filter,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const transactionData = {
  invoices: [
    {
      date: "11 Nov 2025",
      invoiceNumber: "INV-000002",
      orderNumber: "-",
      amount: "MAD240.00",
      balanceDue: "MAD240.00",
      status: "Overdue",
    },
  ],
};

const TransactionSection = ({ title, data, isOpen, onToggle }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="border border-gray-200 rounded-lg bg-white"
    >
      <div className="flex items-center justify-between p-4">
        <CollapsibleTrigger className="flex items-center gap-2 hover:opacity-70 transition-opacity">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          )}
          <span className="font-medium text-gray-900">{title}</span>
        </CollapsibleTrigger>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1" />
          New
        </Button>
      </div>

      <CollapsibleContent>
        <div className="border-t border-gray-200">
          {title === "Invoices" && (
            <div className="p-4 border-b border-gray-200 flex justify-end">
              <Button variant="outline" size="sm" className="text-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                Status: All
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Date
                    <ChevronUp className="inline h-3 w-3 ml-1" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Invoice Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Order Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Balance Due
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {item.invoiceNumber}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.orderNumber}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.amount}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      {item.balanceDue}
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className="text-orange-600 font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Total Count:{" "}
              <a href="#" className="text-blue-600 hover:underline">
                View
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700 px-2">
                {currentPage} - {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default function Transactions({ data }) {
  const [openSections, setOpenSections] = useState({
    invoices: false,
    quotes: false,
    payments: false,
    projects: false,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    { id: "invoices", title: "Invoices", data: transactionData.invoices },
    { id: "quotes", title: "Quotes", data: [] },
    { id: "payments", title: "Payments", data: [] },
    { id: "projects", title: "Projects", data: [] },
  ];

  return (
    <div className="space-y-4 p-4 bg-gray-50 min-h-screen">
      {sections.map((section) => (
        <TransactionSection
          key={section.id}
          title={section.title}
          data={section.data}
          isOpen={openSections[section.id]}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}
