import { Edit, Phone } from "lucide-react";
import React from "react";
export default function overview({ data }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {data.client_type == "company" ? data.company : data.user.name}
          </h3>

          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-500 text-sm">CL</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {data.user.name}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {data.user.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Phone className="w-4 h-4" />
                {data.phone}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">ADDRESS</h3>
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
                {data.city}
              </div>
              <div className="text-sm text-gray-600">{data.address}</div>
              <div className="text-sm text-gray-600 mt-2">{data.address}</div>
              <div className="text-sm text-gray-600">{data.country}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Payment due period</div>
            <div className="text-sm font-medium text-gray-900">
              Due on Receipt
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Receivables
            </h3>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div className="text-xs text-gray-500 uppercase">Currency</div>
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

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Income and Expense
              </h3>
              <p className="text-xs text-gray-500">
                This chart is displayed in the organization's base currency.
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

        <div className="bg-white max-h-[500px] overflow-y-auto rounded-lg border border-gray-200 p-4 shadow-sm">
          <TimelineComponent />
        </div>
      </div>
    </div>
  );
}
