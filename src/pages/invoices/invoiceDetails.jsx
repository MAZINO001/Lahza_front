/* eslint-disable no-unused-vars */
import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const fetchInvoices = () =>
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/invoices`, {
      withCredentials: true,
    })
    .then((res) => res.data.invoices);

const fetchInvoicesById = (id) =>
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/invoices/${id}`, {
      withCredentials: true,
    })
    .then((res) => res.data);

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
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Inv_Qt_sidebar type="invoices" data={invoices} />
      {/* Main Content */}
      <Inv_Qt_page type="invoices" data={invoice} />
    </div>
  );
}
