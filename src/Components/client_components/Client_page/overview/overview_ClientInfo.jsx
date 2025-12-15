import React, { useState } from "react";
import { Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
export default function ClientInfo({ data }) {
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);

  return (
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
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-gray-500">Street Address</span>
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

        <Collapsible open={isAdditionalOpen} onOpenChange={setIsAdditionalOpen}>
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
                  <span className="text-sm text-gray-500">Payment Terms</span>
                  <span className="col-span-2 text-sm text-gray-900">
                    Net 30
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-gray-500">Credit Limit</span>
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
  );
}
