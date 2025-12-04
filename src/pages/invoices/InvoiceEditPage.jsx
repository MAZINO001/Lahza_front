import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "@/features/documents/hooks/useDocumentsQuery";
import { useAuthContext } from "@/hooks/AuthContext";
import { DocumentForm } from "@/features/documents/components/DocumentForm"
export default function InvoiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext()
  const { data: document, isLoading } = useDocument(id, "invoice");

  if (!document) return <div>document not found</div>;

  return <DocumentForm document={document} onSuccess={() => navigate(`/${role}/invoices`)} />;
};


