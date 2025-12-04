// src/pages/quotes/QuoteViewPage.jsx
import { useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Inv_Qt_sidebar from "@/components/Invoice_Quotes/Inv_Qt_sidebar";
import Inv_Qt_page from "@/components/Invoice_Quotes/Inv_Qt_page";
import { useDocument, useDocuments } from "@/features/documents/hooks/useDocumentsQuery";

export default function QuoteViewPage() {
  const { id } = useParams();

  // All quotes for the sidebar
  const {
    data: quotes = [],
    isLoading: quotesLoading,
    isError: quotesError,
  } = useDocuments("quote");

  // Current quote for main view
  const {
    data: quote,
    isLoading: quoteLoading,
    isError: quoteError,
  } = useDocument(id, "quote");

  // Loading skeleton
  if (quotesLoading || quoteLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar Skeleton */}
        <div className="w-80 border-r bg-white p-6 overflow-y-auto">
          <Skeleton className="h-9 w-40 mb-6" />
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-10 bg-white">
          <Skeleton className="h-12 w-80 mb-8" />
          <Skeleton className="h-6 w-48 mb-6" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  // Error or not found
  if (quotesError || quoteError || !quote) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>
            {quoteError || quotesError
              ? "Failed to load quote. Please try again later."
              : "Quote not found."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Inv_Qt_sidebar type="quote" data={quotes} currentId={id} />
      <Inv_Qt_page type="quote" data={quote} />
    </div>
  );
}