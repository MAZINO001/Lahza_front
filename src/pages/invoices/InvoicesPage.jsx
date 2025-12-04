import { DocumentTable } from "@/features/documents/components/DocumentTable"
import { useDocuments } from "@/features/documents/hooks/useDocumentsQuery";
export default function InvoicesPage() {
  const { data: documnets = [], isLoading } = useDocuments("invoice");
  return <DocumentTable documnets={documnets} isLoading={isLoading} />;
};


