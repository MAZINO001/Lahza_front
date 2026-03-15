import React from "react";
import FinancialOverview from "@/features/dashboard/components/FinancialOverview";
import MarketingGrowth from "@/features/dashboard/components/MarketingGrowth";
import ProjectOverview from "@/features/dashboard/components/ProjectOverviewDisplay";
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4 ">
      <FinancialOverview />
      <div className="w-full">
        <MarketingGrowth />
      </div>
      <div className="w-full">
        <ProjectOverview />
      </div>
      <div>image goes here </div>
    </div>
  );
}
