/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Edit, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useClient } from "@/features/clients/hooks/useClientsQuery";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
export default function ClientInfo({ id }) {
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isAdditionalOpen, setIsAdditionalOpen] = useState(false);
  const { data: data, isLoading } = useClient(id);
  const { role } = useAuthContext();
  return (
    <div className="bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-gray-900">client Info</h3>
        <Link to={`/${role}/client/${data?.client?.id}/edit`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-gray-200">
        <Collapsible open={isAddressOpen} onOpenChange={setIsAddressOpen}>
          <div className="p-4">
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
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                {data?.client?.address && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">
                      Street Address
                    </span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.address}
                    </span>
                  </div>
                )}
                {data?.client?.city && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm text-gray-500">City</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.city}
                    </span>
                  </div>
                )}
                {data?.client?.state && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">State</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.state}
                    </span>
                  </div>
                )}

                {data?.client?.zip_code && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">Zip Code</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.zip_code}
                    </span>
                  </div>
                )}
                {data?.client?.country && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">Country</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.country}
                    </span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible open={isAdditionalOpen} onOpenChange={setIsAdditionalOpen}>
          <div className="p-4">
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
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                {data?.client?.client_type && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">Customer Type</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.client_type}
                    </span>
                  </div>
                )}
                {data?.client?.client_type !== "individual" && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">Company Name</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.company}
                    </span>
                  </div>
                )}
                {data?.client?.phone && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">Phone Number</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.phone}
                    </span>
                  </div>
                )}
                {data?.client?.vat && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">Tax Rate</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.vat}
                    </span>
                  </div>
                )}
                {data?.client?.currency && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-gray-500">currency</span>
                    <span className="col-span-2 text-sm text-gray-900">
                      {data?.client?.currency}
                    </span>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </div>
  );
}
