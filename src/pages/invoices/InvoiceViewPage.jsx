// src/pages/invoices/InvoiceViewPage.jsx
import { useParams } from "react-router-dom";
import Inv_Qt_sidebar from "@/components/Invoice_Quotes/Inv_Qt_sidebar";
import Inv_Qt_page from "@/components/Invoice_Quotes/Inv_Qt_page";

export default function InvoiceViewPage() {
  const { id } = useParams();
  return (
    <div className="flex h-screen bg-background">
      <Inv_Qt_sidebar type="invoices" currentId={id} />
      <Inv_Qt_page type="invoices" currentId={id} />
    </div>
  );
}
