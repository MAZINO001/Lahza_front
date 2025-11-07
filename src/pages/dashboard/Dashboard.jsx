import React from "react";
import { mockInvoices } from "@/lib/mockData";
import { SectionCards } from "../../Components/section-cards";
import Test from "../../../test";
import DataTable_comp from "../../Components/client_components/DataTable_Comp";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-4 pt-4">
      <SectionCards />
      <div className="px-4">
        <Test />
      </div>
      <div className="mx-4">
        <DataTable_comp data={mockInvoices} />
      </div>
    </div>
  );
}
