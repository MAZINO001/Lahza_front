import React from "react";
import FinancialOverview from "../../features/dashboard/components/FinancialOverview";
import ProjectInfo from "../../features/dashboard/components/ProjectInfo";
import DataTable_comp from "../../Components/client_components/DataTable_Comp";
import Upcoming from "../../Components/client_components/Upcoming";
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <FinancialOverview />
      <div className="px-4">
        <ProjectInfo />
      </div>
      <div className="mx-4 flex gap-4">
        <DataTable_comp />
        <Upcoming />
      </div>
    </div>
  );
}
