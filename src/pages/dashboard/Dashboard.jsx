/* eslint-disable no-unused-vars */
import React from "react";
import { SectionCards } from "../../Components/section-cards";
import ProjectInfo from "./ProjectInfo";
import DataTable_comp from "../../Components/client_components/DataTable_Comp";
import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axios";

const fetchInvoices = () =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/invoices`)
    .then((res) => res.data.invoices.slice(0, 5));

export default function Dashboard() {
  const {
    data: invoices = [],
    isLoading: listLoading,
    isError: listError,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex flex-col gap-4 pt-4">
      <SectionCards />
      <div className="px-4">
        <ProjectInfo />
      </div>
      <div className="mx-4">
        <DataTable_comp data={invoices} />
      </div>
    </div>
  );
}
