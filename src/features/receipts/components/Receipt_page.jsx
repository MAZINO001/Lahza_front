import { Download, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link } from "react-router-dom";
import api from "@/lib/utils/axios";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { usePayment } from "@/features/payments/hooks/usePaymentQuery";
import { formatId } from "@/lib/utils/formatId";
import PdfPreview from "@/features/documents/components/PdfPreview";

export default function Receipt_page({ currentId }) {
  const currentSection = "receipt";
  const { role } = useAuthContext();
  const { data: payment } = usePayment(currentId);

  const { handleDownloadInvoice_Quotes } = globalFnStore();

  const handleDownloadPdf = () => {
    handleDownloadInvoice_Quotes(payment.id, `${currentSection}`);
  };

  const handlePrintPdf = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`,
        {
          responseType: "blob",
          withCredentials: true,
        }
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
      alert(`Failed to print receipt`);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="bg-background px-2 py-4 border-b gap-3 flex items-center justify-between">
        <div className="text-lg font-semibold">
          {formatId(currentId, "RECEIPT")}
        </div>
        <div className="flex items-center gap-2 ">
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
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          <Link to={`/${role}/receipt`}>
            <Button variant="outline" className="h-8 w-8 cursor-pointer">
              <X size={20} />
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col h-full p-4 gap-4 overflow-auto">
        <div className="min-h-0 w-full">
          <PdfPreview
            src={`${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`}
          />
        </div>
      </div>
    </div>
  );
}
