/* eslint-disable no-unused-vars */
import { Download, Edit2, Filter, Printer, Send, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import PdfPreview from "./PdfPreview";
import api from "@/lib/utils/axios";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import axios from "axios";
import { useDocument } from "@/features/documents/hooks/useDocumentsQuery";

export default function Inv_Qt_page({ type, currentId }) {
  const isInvoice = type === "invoice";

  console.log(currentId)
  console.log(type)
  const { role, user } = useAuthContext();
  const navigate = useNavigate();
  const {
    data: document,
    isLoading: documentLoading,
    isError: documentError,
  } = useDocument(currentId, type);

  const { handleSendInvoice_Quote, handleDownloadInvoice_Quotes } =
    globalFnStore();

  const handleSendPdf = () => {
    handleSendInvoice_Quote(document.id, user.email, `${type}`);
  };

  const handleDownloadPdf = () => {
    handleDownloadInvoice_Quotes(document.id, `${type}`);
  };

  const handlePrintPdf = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/pdf/${type}/${document.id}`,
        { responseType: "blob", withCredentials: true }
      );

      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        alert("Please allow popups to print the document.");
      }

    } catch (error) {
      console.error("Print error:", error);
      alert(`Failed to print ${type}`);
    }
  };
  const handleInvoiceConversion = async () => {
    const statusToSend = "draft";
    const quotationDate = new Date(document.quotation_date);
    const dueDate = new Date(quotationDate);
    dueDate.setDate(dueDate.getDate() + 30);
    const formattedDueDate = dueDate.toISOString().slice(0, 10);

    const payload = {
      client_id: document.client_id,
      invoice_date: document.quotation_date,
      due_date: formattedDueDate,
      balance_due: 0,
      status: statusToSend,
      total_amount: document.total_amount,
      quote_id: document.id,
      services: document.quote_services,
      notes: document.notes || "",
    };

    const QuotePayload = {
      client_id: document.client_id,
      quotation_date: document.quotation_date,
      balance_due: 0,
      status: "confirmed",
      total_amount: document.total_amount,
      quote_id: document.id,
      services: document.quote_services,
      notes: document.notes || "",
    };

    try {
      await api.post(`${import.meta.env.VITE_BACKEND_URL}/invoices`, payload);
      await api.put(
        `${import.meta.env.VITE_BACKEND_URL}/quotes/${document.id}`,
        QuotePayload
      );

      alert("Quote converted and marked as accepted!");
      navigate(`/${role}/invoices`);
    } catch (error) {
      console.error("Error details:", error.response?.data || error);
      alert(
        `Failed to convert to invoice: ${error.response?.data?.message || error.message
        }`
      );
    }
  };


  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b px-2 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">
          {isInvoice ? "INV" : "QT"}-000{currentId}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/${role}/${type}/${currentId}/edit`}
            state={{ [isInvoice ? "invoiceId" : "quoteId"]: currentId }}
          >
            <Button variant="outline" className="h-8 w-8 cursor-pointer">
              <Edit2 size={20} />
            </Button>
          </Link>
          <Button
            onClick={handleDownloadPdf}
            variant="outline"
            className="h-8 w-8 cursor-pointer"
          >
            <Download size={20} />
          </Button>
          <Button
            onClick={handlePrintPdf}
            variant="outline"
            className="h-8 w-8 cursor-pointer"
          >
            <Printer size={20} />
          </Button>
          {role === "admin" ? (
            <Button
              onClick={handleSendPdf}
              variant="outline"
              className="h-8 w-8 cursor-pointer"
            >
              <Send size={20} />
            </Button>
          ) : (
            ""
          )}

          {type === "quote" &&
            role === "admin" &&
            document?.status !== "confirmed" ? (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <div>
                <Button
                  onClick={handleInvoiceConversion}
                  variant="outline"
                  className="text-sm cursor-pointer"
                >
                  Convert to Invoice
                </Button>
              </div>
            </>
          ) : (
            ""
          )}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <button variant="outline" className="h-8 w-8 cursor-pointer">
            <Link
              to={`/${role}/${type}s`}
              state={{ [isInvoice ? "invoiceId" : "quoteId"]: currentId }}
            >
              <X size={20} />
            </Link>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <PdfPreview src={`http://127.0.0.1:8000/pdf/${type}/${currentId}`} />
      </div>
    </div>
  );
}
