import { Download, Edit2, Filter, Printer, Send, X } from "lucide-react";
import DocumentBanner from "@/components/DocumentBanner";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/utils/axios";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import {
  useDocument,
  useCreateDocument,
} from "@/features/documents/hooks/useDocuments/useDocumentsQueryData";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PdfPreview from "./PdfPreview";
import { formatId } from "@/lib/utils/formatId";
import { Copy } from "lucide-react";
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
      const response = await api.get(`/pdf/${currentSection}/${currentId}`, {
        responseType: "blob",
      });
      const blob = response.data;
      console.log(blob);
      const url = window.URL.createObjectURL(blob);

      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        toast.info("Please allow popups to print the document.");
      }
    } catch (error) {
      console.error("Print error:", error);
      toast.error(`Failed to print ${type}`);
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
      <div className="sticky top-0 z-10 border-b  border-t backdrop-blur-sm p-4 flex items-center justify-between gap-4">
        <div className="text-xl font-semibold tracking-tight text-foreground">
          {formatId(currentId, isInvoice ? "INVOICE" : "QUOTE")}
        </div>

        <div className="flex items-center gap-2">
          {/* Edit - Admin only */}
          {role === "admin" && (
            <Button variant="outline" size="icon" asChild title="Edit">
              <Link
                to={`/${role}/${currentSection}/${currentId}/edit`}
                state={{ [isInvoice ? "invoiceId" : "quoteId"]: currentId }}
              >
                <Edit2 className="h-4 w-4" />
              </Link>
            </Button>
          )}

          {/* Download */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownloadPdf}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>

          {/* Print */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrintPdf}
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>

          {/* Send - Admin only */}
          {role === "admin" && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleSendPdf}
              title="Send"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}

          {/* More actions - Admin only */}
          {role === "admin" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" title="More">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleClone}>
                  <Copy className="mr-2 h-4 w-4" />
                  Clone
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* <div className="h-5 w-px bg-border mx-2" /> */}

          {/* Convert to Invoice - Admin + Quotes only */}
          {type === "quotes" &&
            role === "admin" &&
            document?.status !== "confirmed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleInvoiceConversion}
                className="gap-1.5"
              >
                Convert to Invoice
              </Button>
            )}
          <div className="h-5 w-px bg-border mx-2" />
          {/* Close */}
          <Button variant="outline" size="icon" asChild title="Close">
            <Link to={`/${role}/${type}`}>
              <X className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Banner / Call to Action */}
        <div className="shrink-0">
          <DocumentBanner
            type={type}
            action={
              role === "admin"
                ? type === "quotes"
                  ? "Duplicate Quote"
                  : "Check or Add Additional Data"
                : type === "quotes"
                  ? "Sign Quote"
                  : ["paid", "partially_paid"].includes(document?.status)
                    ? "Go to Project Page"
                    : "Go to Payment Page"
            }
            content={
              role === "admin"
                ? type === "quotes"
                  ? "Create a duplicate of this quote for easy editing"
                  : "Review or complete missing invoice details"
                : type === "quotes"
                  ? "Sign this quote to approve it"
                  : ["paid", "partially_paid"].includes(document?.status)
                    ? "View progress and project details"
                    : "Proceed to payment to complete the invoice"
            }
            clientId={currentId}
            currentSection={currentSection}
            DocId={document?.id}
          />
        </div>

        <div className="flex-1 min-h-0 w-full">
          <PdfPreview
            src={`${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
