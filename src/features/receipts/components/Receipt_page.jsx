// import { Download, Printer, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useAuthContext } from "@/hooks/AuthContext";
// import { Link } from "react-router-dom";
// import api from "@/lib/utils/axios";
// import { globalFnStore } from "@/hooks/GlobalFnStore";
// import { usePayment } from "@/features/payments/hooks/usePayments/usePaymentsData";
// import { formatId } from "@/lib/utils/formatId";
// import PdfPreview from "@/features/documents/components/PdfPreview";

// export default function Receipt_page({ currentId }) {
//   const currentSection = "receipt";
//   const { role } = useAuthContext();
//   const { data: payment } = usePayment(currentId);

//   const { handleDownloadInvoice_Quotes } = globalFnStore();

//   const handleDownloadPdf = () => {
//     handleDownloadInvoice_Quotes(payment.id, `${currentSection}`);
//   };

//   const handlePrintPdf = async () => {
//     try {
//       const response = await api.get(
//         `${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`,
//         {
//           responseType: "blob",
//           withCredentials: true,
//         }
//       );
//       const blob = response.data;
//       const url = window.URL.createObjectURL(blob);

//       const printWindow = window.open(url);
//       if (printWindow) {
//         printWindow.onload = () => {
//           printWindow.focus();
//           printWindow.print();
//         };
//       } else {
//         alert("Please allow popups to print the document.");
//       }
//     } catch (error) {
//       console.error("Print error:", error);
//       alert(`Failed to print receipt`);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col h-screen">
//       <div className="border-t px-2 py-4 border-b gap-3 flex items-center justify-between">
//         <div className="text-lg font-semibold">
//           {formatId(currentId, "RECEIPT")}
//         </div>
//         <div className="flex items-center gap-2 ">
//           <Button
//             onClick={handleDownloadPdf}
//             variant="outline"
//             className="h-8 w-8 cursor-pointer"
//           >
//             <Download size={20} />
//           </Button>
//           <Button
//             onClick={handlePrintPdf}
//             variant="outline"
//             className="h-8 w-8 cursor-pointer"
//           >
//             <Printer size={20} />
//           </Button>
//           <div className="w-px h-4 bg-gray-300 mx-2"></div>
//           <Link to={`/${role}/receipt`}>
//             <Button variant="outline" className="h-8 w-8 cursor-pointer">
//               <X size={20} />
//             </Button>
//           </Link>
//         </div>
//       </div>
//       <div className="flex flex-col h-full p-4 gap-4 overflow-auto">
//         <div className="min-h-0 w-full">
//           <PdfPreview
//             src={`${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { Download, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link } from "react-router-dom";
import api from "@/lib/utils/axios";
import { globalFnStore } from "@/hooks/GlobalFnStore";
import { usePayment } from "@/features/payments/hooks/usePayments/usePaymentsData";
import { formatId } from "@/lib/utils/formatId";
import PdfPreview from "@/features/documents/components/PdfPreview";
import { toast } from "sonner";

export default function ReceiptPage({ currentId }) {
  const currentSection = "receipt";
  const { role } = useAuthContext();
  const { data: payment } = usePayment(currentId);

  const { handleDownloadInvoice_Quotes } = globalFnStore();

  const handleDownloadPdf = () => {
    handleDownloadInvoice_Quotes(payment?.id, currentSection);
  };

  const handlePrintPdf = async () => {
    try {
      const response = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`,
        {
          responseType: "blob",
          withCredentials: true,
        },
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
        toast.info("Please allow popups to print the document.");
      }
    } catch (error) {
      console.error("Print error:", error);
      toast.error("Failed to print receipt.");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="sticky top-0 z-10 border-b border-t  backdrop-blur-sm px-4 py-3 flex items-center justify-between gap-4">
        <div className="text-lg font-semibold tracking-tight text-foreground">
          {formatId(currentId, "RECEIPT")}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handleDownloadPdf}
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={handlePrintPdf}
            title="Print"
          >
            <Printer className="h-4 w-4" />
          </Button>

          <div className="h-5 w-px bg-border mx-2" />

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
            asChild
            title="Close"
          >
            <Link to={`/${role}/receipt`}>
              <X className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 overflow-auto p-4">
        <div className="h-full w-full">
          <PdfPreview
            src={`${import.meta.env.VITE_BACKEND_URL}/pdf/${currentSection}/${currentId}`}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
