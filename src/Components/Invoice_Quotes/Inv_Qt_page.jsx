/* eslint-disable no-unused-vars */
import { Download, Edit2, Filter, Printer, Send, X } from "lucide-react";
import DocumentBanner from "@/components/DocumentBanner";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import PdfPreview from "./PdfPreview";
import api from "@/lib/utils/axios";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import axios from "axios";
import {
  useDocument,
  useCreateDocument,
} from "@/features/documents/hooks/useDocumentsQuery";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function Inv_Qt_page({ type, currentId }) {
  const isInvoice = type === "invoices";
  const currentSection = type === "invoices" ? "invoice" : "quote";
  const { role, user } = useAuthContext();
  const navigate = useNavigate();
  const {
    data: document,
    isLoading: documentLoading,
    isError: documentError,
  } = useDocument(currentId, type);

  const { handleSendInvoice_Quote, handleDownloadInvoice_Quotes } =
    globalFnStore();
  const createInvoiceMutation = useCreateDocument("invoices");

  const handleSendPdf = () => {
    handleSendInvoice_Quote(document.id, user.email, `${type}`);
  };

  const handleDownloadPdf = () => {
    handleDownloadInvoice_Quotes(document.id, `${currentSection}`);
  };

  const handlePrintPdf = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/pdf/${currentSection}/${document.id}`,
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
    const quoteId = document?.id;
    navigate(`/${role}/invoice/new`, { state: { quoteId } });
  };
  const handleClone = () => {
    navigate(`/${role}/${currentSection}/new`, {
      state: { cloneFromId: currentId },
    });
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="bg-background px-2 py-4 border-b gap-3 flex items-center justify-between">
        <div className="text-lg font-semibold">
          {isInvoice ? "INVOICE" : "QUOTE"}-000{currentId}
        </div>
        <div className="flex items-center gap-2 ">
          <Link
            to={`/${role}/${currentSection}/${currentId}/edit`}
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
            <>
              <Button
                onClick={handleSendPdf}
                variant="outline"
                className="h-8 w-8 cursor-pointer"
              >
                <Send size={20} />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 border border-border rounded-md">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => {
                      handleClone();
                    }}
                  >
                    Clone
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            ""
          )}

          {type === "quotes" &&
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
              to={`/${role}/${type}`}
              state={{ [isInvoice ? "invoiceId" : "quoteId"]: currentId }}
            >
              <X size={20} />
            </Link>
          </button>
        </div>
      </div>
      <div className="flex flex-col h-full p-4 gap-4 overflow-auto">
        <div className="shrink-0">
          {type === "quotes" ? (
            <DocumentBanner
              type="quote"
              action="Clone Quote"
              content="Create a duplicate of this quote for easy editing"
              clientId={currentId}
              currentSection={currentSection}
            />
          ) : (
            <DocumentBanner
              type="invoice"
              action="Generate Payment"
              content="Create a duplicate of this quote for easy editing"
              clientId={currentId}
              currentSection={currentSection}
              totalAmount={document?.total_amount}
              balanceDue={document?.balance_due}
            />
          )}
        </div>

        <div className="flex-1 min-h-0">
          <PdfPreview
            src={`${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`}
          />
        </div>
      </div>
    </div>
  );
}
