import React, { useState } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  ChevronDown,
  Edit,
  Plus,
  MoreHorizontal,
  X,
} from "lucide-react";
import TimelineComponent from "@/Components/comp-531";

const CustomerOverview = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "comments", label: "Comments" },
    { id: "transactions", label: "Transactions" },
    { id: "mails", label: "Mails" },
    { id: "statement", label: "Statement" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 ">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between ">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700">
              Active Customers
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              <button className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="cursor-pointer">
          <div className="flex items-center gap-3 p-2 bg-gray-200">
            <div className="">
              <div className="font-medium text-gray-900 ">Cora Lebsack III</div>
              <div className="text-sm text-gray-500">$0.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-2">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 ">
              Cora Lebsack III
            </h1>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                Edit
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600">
                New Transaction
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
                More
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded">
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
              <div className="space-y-4">
                {/* Contact Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">
                    Clayton Witting
                  </h3>

                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 text-sm">CL</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        1-739-648-7625 ×290 Danial Tillman
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        Jada_Baumbach@yahoo.com
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Phone className="w-4 h-4" />
                        713-809-8689 ×348
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        1-367-844-9019 ×417
                      </div>
                      <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                        Invite to Portal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      ADDRESS
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ChevronDown className="w-4 h-4" />
                    </button>
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
                        quas
                      </div>
                      <div className="text-sm text-gray-600">
                        Spectaculum quisquam caute vorax desidero libero
                        possimus alveus. Traho culpo utpote approbo ex degusto
                        sponte sol aegre. Vivo sperno abutor circumvenio
                        abstergo aer votum solus coruscus.
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        609 Warren Road
                      </div>
                      <div className="text-sm text-gray-600">
                        East Lansing, Utah, 05440-2955
                      </div>
                      <div className="text-sm text-gray-600">Texas</div>
                      <div className="text-sm text-gray-600 mt-2">
                        Phone: 897-990-7000
                      </div>
                      <div className="text-sm text-gray-600">
                        Fax Number: 424.971.1911
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
    </div>
  );
};

export default CustomerOverview;
