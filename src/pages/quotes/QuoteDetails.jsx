import Inv_Qt_page from "@/Components/Invoice_Quotes/Inv_Qt_page";
import Inv_Qt_sidebar from "@/Components/Invoice_Quotes/Inv_Qt_sidebar";
import axios from "axios";

import { useQuery } from "@tanstack/react-query";

const fetchQuotes = () =>
  axios
    .get(`${import.meta.env.VITE_BACKEND_URL}/quotes`)
    .then((res) => res.data.quotes);

export default function QuoteDetails() {
  const {
    data: quotes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
  });

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (isError)
    return <div className="p-4 text-red-600">Failed to load quotes</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="quotes" data={quotes} />
      <Inv_Qt_page type="quotes" data={quotes} />
    </div>
  );
}
