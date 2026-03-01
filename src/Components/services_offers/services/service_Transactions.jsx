import React, { useState } from "react";
import TransactionSection from "./service_TransactionsComp";
import { DocumentsColumns } from "@/features/documents/columns/documentColumns";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { useDocsByService } from "@/features/services/hooks/useServicesData";
import { useTranslation } from "react-i18next";

export default function Transactions({ currentId }) {
  const [selectedStatus, setSelectedStatus] = useState("invoices");
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: invoices, isLoading: loadingInvoices } = useDocsByService(
    currentId,
    selectedStatus,
  );

  const { data: quotes, isLoading: loadingQuotes } = useDocsByService(
    currentId,
    selectedStatus,
  );

  console.log(invoices);
  console.log(quotes);

  const columnsBySection = React.useMemo(
    () => ({
      invoices: DocumentsColumns(role, navigate, "invoice"),
      quotes: DocumentsColumns(role, navigate, "quote"),
    }),
    [role, navigate],
  );

  const sections = [
    {
      id: "invoices",
      title: t("services.transactions.invoices"),
      data: invoices,
      isLoading: loadingInvoices,
    },
    {
      id: "quotes",
      title: t("services.transactions.quotes"),
      data: quotes,
      isLoading: loadingQuotes,
    },
  ];

  const selectStatus = (status) => {
    setSelectedStatus(status);
  };

  const displayType = ["quotes", "invoices"];

  const filteredSections = selectedStatus
    ? sections.filter((section) => section.id === selectedStatus)
    : sections;

  return (
    <div className="space-y-4 min-h-screen">
      <div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 flex-1 rounded-md text-sm flex items-center gap-2 transition capitalize border border-border px-2 py-[4.3px]">
                {t("services.transactions.filter_by")} {t(
                  `services.transactions.${selectedStatus}`,
                )}
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuRadioGroup
                value={selectedStatus}
                onValueChange={selectStatus}
              >
                {displayType.map((status) => (
                  <DropdownMenuRadioItem key={status} value={status}>
                    <span className="capitalize">
                      {t(`services.transactions.${status}`)}
                    </span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {filteredSections.map((section) => (
        <TransactionSection
          key={section.id}
          title={section.title}
          data={section.data ?? []}
          columns={columnsBySection[section.id]}
          isLoading={section.isLoading}
          currentId={currentId}
          role={role}
        />
      ))}
    </div>
  );
}
