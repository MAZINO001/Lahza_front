import React from "react";
import { SectionCards } from "../../Components/section-cards";
import ProjectInfo from "./ProjectInfo";
import DataTable_comp from "../../Components/client_components/DataTable_Comp";
import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
export default function DashboardPage() {
  const { data: documnets = [], isLoading } = useDocuments("invoice");

  return (
    <div className="flex flex-col gap-4 pt-4">
      <SectionCards />
      <div className="px-4">
        <ProjectInfo />
      </div>
      <div className="mx-4">
        <DataTable_comp data={documnets} isLoading={isLoading} />
      </div>
    </div>
  );
}
