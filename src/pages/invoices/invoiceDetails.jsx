/* eslint-disable no-unused-vars */
import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/utils/axios";

const fetchInvoices = () =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/invoices`)
    .then((res) => res.data?.invoices ?? []);

const fetchInvoicesById = (id) =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/invoices/${id}`)
    .then((res) => res.data?.invoice ?? res.data ?? null);

export default function InvoiceDetails() {
  const { id } = useParams();

  const {
    data: invoices = [],
    isLoading: listLoading,
    isError: listError,
  } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
  });

  const {
    data: invoice,
    isLoading: invoiceLoading,
    isError: invoiceError,
    isFetching: invoiceFetching,
  } = useQuery({
    queryKey: ["invoice", id],
    queryFn: () => fetchInvoicesById(id),
    enabled: Boolean(id),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    refetchInterval: false,
  });
  console.log(invoices)
console.log(invoice)

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="invoice" data={invoices} />
      <Inv_Qt_page type="invoice" data={invoice} />
    </div>
  );
}
