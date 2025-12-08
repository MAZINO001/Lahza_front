// src/pages/quotes/QuoteViewPage.jsx
import { useParams } from "react-router-dom";
import Inv_Qt_sidebar from "@/components/Invoice_Quotes/Inv_Qt_sidebar";
import Inv_Qt_page from "@/components/Invoice_Quotes/Inv_Qt_page";

export default function QuoteViewPage() {
  const { id } = useParams();

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="quote" currentId={id} />
      <Inv_Qt_page type="quote" currentId={id} />
    </div>
  );
}