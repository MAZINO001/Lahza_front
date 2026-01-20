import React, { useMemo } from "react";
import { Phone, Percent, DollarSign, Edit2 } from "lucide-react";
import { useClient } from "@/features/clients/hooks/useClientsQuery";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { Card } from "@/components/ui/card";

const BASE_INFO_ITEMS = [
  { label: "Street Address", key: "address", icon: null },
  { label: "City", key: "city", icon: null },
  { label: "State", key: "state", icon: null },
  { label: "Zip Code", key: "zip_code", icon: null },
  { label: "Country", key: "country", icon: null },
  { label: "Customer Type", key: "client_type", icon: null },
  { label: "Phone Number", key: "phone", icon: Phone },
  { label: "Tax Rate", key: "vat", icon: Percent },
  { label: "Currency", key: "currency", icon: DollarSign },
];

export default function ClientInfo({ id }) {
  const { data: clientData, isLoading } = useClient(id);
  const { role } = useAuthContext();
  const client = clientData?.client;

  const infoItems = useMemo(() => {
    const items = BASE_INFO_ITEMS.map((item) => ({
      ...item,
      value: client?.[item.key],
    }));

    // if (client?.client_type !== "individual" && client?.company) {
    //   items.splice(5, 0, {
    //     label: "Company Name",
    //     key: "company",
    //     icon: null,
    //     value: client.company,
    //   });
    // }

    return items.filter((item) => item.value);
  }, [client]);

  if (isLoading) {
    return (
      <Card className="max-w-2xl">
        <div className="p-4 ">Loading client info...</div>
      </Card>
    );
  }

  if (!client) {
    return (
      <Card className="max-w-2xl">
        <div className="p-4 ">No client data available</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-border px-4">
        <h3 className="text-lg font-semibold text-foreground">Client Info</h3>
        <button variant="outline" className="cursor-pointer">
          <Link
            to={`/${role}/client/${client?.id}/edit`}
            state={{ clientId: client?.id }}
          >
            <Edit2 className="w-4 h-4" />
          </Link>
        </button>
      </div>

      <div className="p-4 ">
        <div className="space-y-4">
          {infoItems.map((item) => (
            <div key={item.key} className="flex items-start gap-3">
              <label className="mt-0.5 w-32 text-sm font-medium text-muted-foreground">
                {item.label}
              </label>
              <span className="flex-1 text-sm text-foreground">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
