import {
  ChevronDown,
  Edit,
  Edit2,
  MessageSquare,
  Phone,
  X,
} from "lucide-react";
import React, { useState } from "react";
import TimelineComponent from "@/Components/comp-531";
import { Link, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
export default function Client_Page({ data }) {
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams();
  const { role } = useAuthContext();
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "comments", label: "Comments" },
    { id: "transactions", label: "Transactions" },
    { id: "mails", label: "Mails" },
    { id: "statement", label: "Statement" },
  ];

  console.log("id:", id);
  console.log("clients:", data);
  const filteredData = data.filter((item) => item.user_id === Number(id));
  console.log("filteredData:", filteredData);

  return (
    <div className=" w-[75%] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 ">
            Cora Lebsack III
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
              <Link to={`/${role}/client/edit`} state={{ clientId: id }}>
                <Edit2 size={20} />
              </Link>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
              <MessageSquare className="w-5 h-5" />
            </button>
            <Button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
              New Transaction
            </Button>
            <Button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
              More
            </Button>
            <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            {data &&
              filteredData.map((c, index) => {
                return (
                  <div key={index} className="space-y-4">
                    {/* Contact Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-4">
                        {c.client_type == "company" ? c.company : c.user.name}
                      </h3>

                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-sm">CL</span>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {c.user.name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            {c.user.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Phone className="w-4 h-4" />
                            {c.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900">
                          ADDRESS
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">
                              Billing Address
                            </h4>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-600 font-medium mb-1">
                            {c.city}
                          </div>
                          <div className="text-sm text-gray-600">
                            {c.address}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            {c.address}
                          </div>
                          <div className="text-sm text-gray-600">
                            {c.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {/* Right Column */}
            <div className="space-y-6">
              {/* Payment Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">
                    Payment due period
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    Due on Receipt
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Receivables
                  </h3>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div className="text-xs text-gray-500 uppercase">
                      Currency
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      Outstanding Receivables
                    </div>
                    <div className="text-xs text-gray-500 uppercase">
                      Unused Credits
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="text-sm text-gray-900">
                      USD- United States Dollar
                    </div>
                    <div className="text-sm text-gray-900">$0.00</div>
                    <div className="text-sm text-gray-900">$0.00</div>
                  </div>
                </div>
              </div>

              {/* Income Chart */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Income and Expense
                    </h3>
                    <p className="text-xs text-gray-500">
                      This chart is displayed in the organization's base
                      currency.
                    </p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Last 6 Months
                  </button>
                </div>

                <div className="h-48 flex items-end justify-between gap-4 border-l border-b border-gray-200 pl-2 pb-2">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">May 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">Jun 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">Jul 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">Aug 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">Sep 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">Oct 2025</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full bg-gray-100 h-0 rounded-t"></div>
                    <span className="text-xs text-gray-500">Nov 2025</span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  Total Income ( Last 6 Months ) -{" "}
                  <span className="font-medium">$0.00</span>
                </div>
              </div>

              <div className="bg-white max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 p-6 shadow-sm">
                <TimelineComponent />
              </div>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">
              Comments section - Add your comments functionality here
            </p>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">
              Transactions section - Display transaction history here
            </p>
          </div>
        )}

        {activeTab === "mails" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">
              Mails section - Email correspondence here
            </p>
          </div>
        )}

        {activeTab === "statement" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">
              Statement section - Account statements here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
