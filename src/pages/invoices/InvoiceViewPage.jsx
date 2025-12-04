// src/pages/invoices/InvoiceViewPage.jsx
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Inv_Qt_sidebar from "@/components/Invoice_Quotes/Inv_Qt_sidebar";
import Inv_Qt_page from "@/components/Invoice_Quotes/Inv_Qt_page";
import { useDocument, useDocuments } from "@/features/documents/hooks/useDocumentsQuery";

export default function InvoiceViewPage() {
  const { id } = useParams();

  // All invoices for sidebar
  const {
    data: invoices = [],
    isLoading: invoicesLoading,
    isError: invoicesError,
  } = useDocuments("invoice");

  // Current invoice details
  const {
    data: invoice,
    isLoading: invoiceLoading,
    isError: invoiceError,
  } = useDocument(id, "invoice");

  // Loading state
  if (invoicesLoading || invoiceLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar Skeleton */}
        <div className="w-80 border-r bg-white p-6 overflow-y-auto">
          <Skeleton className="h-9 w-48 mb-6" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-10 bg-white overflow-y-auto">
          <Skeleton className="h-12 w-96 mb-6" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-80 w-full rounded-lg border" />
          <div className="mt-8 flex justify-end gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (invoicesError || invoiceError || !invoice) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {invoiceError || invoicesError
              ? "Failed to load invoice. Please try again later."
              : "Invoice not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="invoice" data={invoices} currentId={id} />
      <Inv_Qt_page type="invoice" data={invoice} />
    </div>
  );
}