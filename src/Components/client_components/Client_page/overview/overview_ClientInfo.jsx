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
    <div className="bg-background rounded-lg border border-border">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">client Info</h3>
        <Link to={`/${role}/client/${data?.client?.id}/edit`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-muted-foreground"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      <div className="divide-y divide-border">
        <Collapsible open={isAddressOpen} onOpenChange={setIsAddressOpen}>
          <div className="p-4">
            <CollapsibleTrigger className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isAddressOpen ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <h4 className="text-sm font-semibold text-foreground">
                    Address
                  </h4>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                {data?.client?.address && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Street Address
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.address}
                    </span>
                  </div>
                )}
                {data?.client?.city && (
                  <div className="grid grid-cols-3 gap-4">
                    <span className="text-sm text-muted-foreground">City</span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.city}
                    </span>
                  </div>
                )}
                {data?.client?.state && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">State</span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.state}
                    </span>
                  </div>
                )}

                {data?.client?.zip_code && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Zip Code
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.zip_code}
                    </span>
                  </div>
                )}
                {data?.client?.country && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Country
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
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
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <h4 className="text-sm font-semibold text-foreground">
                    Additional Data
                  </h4>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                {data?.client?.client_type && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Customer Type
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.client_type}
                    </span>
                  </div>
                )}
                {data?.client?.client_type !== "individual" && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Company Name
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.company}
                    </span>
                  </div>
                )}
                {data?.client?.phone && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Phone Number
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.phone}
                    </span>
                  </div>
                )}
                {data?.client?.vat && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      Tax Rate
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
                      {data?.client?.vat}
                    </span>
                  </div>
                )}
                {data?.client?.currency && (
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">
                      currency
                    </span>
                    <span className="col-span-2 text-sm text-foreground">
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
