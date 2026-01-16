// src/pages/invoices/InvoiceViewPage.jsx
import { useParams } from "react-router-dom";
import Receipt_page from "@/features/receipts/components/Receipt_page";
import Receipt_sidebar from "@/features/receipts/components/Receipt_sidebar";

export default function ReceiptViewPage() {
  const { id } = useParams();
  return (
    <div className="flex h-screen">
      <Receipt_sidebar currentId={id} />
      <Receipt_page currentId={id} />
    </div>
  );
}
