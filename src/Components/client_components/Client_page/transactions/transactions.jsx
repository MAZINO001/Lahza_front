import React, { useState } from "react";
import TransactionSection from "./transactionComp";
import { useProjects } from "@/features/projects/hooks/useProjects/useProjectsData";
import { useDocuments } from "@/features/documents/hooks/useDocuments/useDocumentsQueryData";
import { usePayments } from "@/features/payments/hooks/usePayments/usePaymentsData";
import { DocumentsColumns } from "@/features/documents/columns/documentColumns";
import { paymentColumns } from "@/features/payments/columns/paymentColumns";
import { ProjectColumns } from "@/features/projects/columns/projectColumns";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function Transactions({ currentId }) {
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

  const columnsBySection = {
    invoices: DocumentsColumns(role, navigate, "invoice"),
    quotes: DocumentsColumns(role, navigate, "quote"),
    payments: paymentColumns(role, navigate),
    projects: ProjectColumns(role, navigate),
  };

  const invoiceCount = invoices?.filter(
    (invoice) => invoice.client_id === Number(currentId),
  )?.length;
  const projectsCount = projects?.filter(
    (project) => project.client_id === Number(currentId),
  )?.length;
  const paymentsCount = payments?.filter(
    (payment) => payment.client_id === Number(currentId),
  )?.length;
  const quotesCount = quotes?.filter(
    (quote) => quote.client_id === Number(currentId),
  )?.length;

  const sections = [
    {
      id: "invoices",
      title: "Invoices",
      data: invoices,
      isLoading: loadingInvoices,
      count: invoiceCount,
    },
    {
      id: "quotes",
      title: "Quotes",
      data: quotes,
      isLoading: loadingQuotes,
      count: quotesCount,
    },
    {
      id: "payments",
      title: "Payments",
      data: payments,
      isLoading: loadingPayments,
      count: paymentsCount,
    },
    {
      id: "projects",
      title: "Projects",
      data: projects,
      isLoading: loadingProjects,
      count: projectsCount,
    },
  ];

  return (
    <div className="space-y-4 min-h-screen">
      {sections.map((section) => (
        <TransactionSection
          key={section.id}
          title={section.title}
          data={section.data ?? []}
          columns={columnsBySection[section.id]}
          isLoading={section.isLoading}
          isOpen={openSections[section.id]}
          onToggle={() => toggleSection(section.id)}
          currentId={currentId}
          count={section.count}
        />
      ))}
    </div>
  );
}
