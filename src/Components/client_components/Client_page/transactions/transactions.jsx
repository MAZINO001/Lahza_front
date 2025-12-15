import React, { useState } from "react";
import TransactionSection from "./transactionComp";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
import { usePayments } from "@/features/payments/hooks/usePaymentQuery";
import { DocumentsColumns } from "@/features/documents/columns/documentColumns";
import { paymentColumns } from "@/features/payments/columns/paymentColumns";
import { ProjectColumns } from "@/features/projects/columns/projectColumns";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function Transactions() {
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

  const { data: invoices, isLoading: loadingInvoices } =
    useDocuments("invoices");
  const { data: projects, isLoading: loadingProjects } = useProjects();
  const { data: payments, isLoading: loadingPayments } = usePayments();
  const { data: quotes, isLoading: loadingQuotes } = useDocuments("quotes");
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const columnsBySection = React.useMemo(
    () => ({
      invoices: DocumentsColumns(role, navigate, "invoice"),
      quotes: DocumentsColumns(role, navigate, "quote"),
      payments: paymentColumns(role, navigate),
      projects: ProjectColumns(role, navigate),
    }),
    [role, navigate]
  );

  const sections = [
    {
      id: "invoices",
      title: "Invoices",
      data: invoices,
      isLoading: loadingInvoices,
    },
    {
      id: "quotes",
      title: "Quotes",
      data: quotes,
      isLoading: loadingQuotes,
    },
    {
      id: "payments",
      title: "Payments",
      data: payments,
      isLoading: loadingPayments,
    },
    {
      id: "projects",
      title: "Projects",
      data: projects,
      isLoading: loadingProjects,
    },
  ];

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      {sections.map((section) => (
        <TransactionSection
          key={section.id}
          title={section.title}
          data={section.data ?? []}
          columns={columnsBySection[section.id]}
          isLoading={section.isLoading}
          isOpen={openSections[section.id]}
          onToggle={() => toggleSection(section.id)}
        />
      ))}
    </div>
  );
}
