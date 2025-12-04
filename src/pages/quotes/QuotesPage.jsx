import { DocumentTable } from "@/features/documents/components/DocumentTable"
import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
export default function QuotesPage() {
  const { data: documnets = [], isLoading } = useDocuments("quote");

  return <DocumentTable documnets={documnets} isLoading={isLoading} />;
};

