/* eslint-disable no-unused-vars */
import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "@/utils/axios";

const fetchQuotes = () =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/quotes`)
    .then((res) => res.data.quotes);

const fetchQuoteById = (id) =>
  api
    .get(`${import.meta.env.VITE_BACKEND_URL}/quotes/${id}`)
    .then((res) => res.data);

export default function QuoteDetails() {
  const { id } = useParams();

  const {
    data: quotes = [],
    isLoading: listLoading,
    isError: listError,
  } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: quote,
    isLoading: quoteLoading,
    isError: quoteError,
    isFetching: quoteFetching,
  } = useQuery({
    queryKey: ["quote", id],
    queryFn: () => fetchQuoteById(id),
    enabled: Boolean(id),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="quotes" data={quotes} />
      {/* You can optionally pass quoteFetching to show a subtle inline loader inside the preview */}
      <Inv_Qt_page type="quotes" data={quote} />
    </div>
  );
}
