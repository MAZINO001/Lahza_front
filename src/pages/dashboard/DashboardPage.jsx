import React from "react";
import { SectionCards } from "../../Components/section-cards";
import ProjectInfo from "./ProjectInfo";
import DataTable_comp from "../../Components/client_components/DataTable_Comp";
export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-4 pt-4">
      <SectionCards />
      <div className="px-4">
        <ProjectInfo />
      </div>
      <div className="mx-4">
        <DataTable_comp />
      </div>
    </div>
  );
}
