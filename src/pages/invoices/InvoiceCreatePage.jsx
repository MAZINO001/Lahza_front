import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { DocumentForm } from "@/features/documents/components/DocumentForm";

export default function InvoiceCreatePage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  return (
    <DocumentForm
      type={"invoices"}
      onSuccess={() => navigate(`/${role}/invoices`)}
    />
  );
}
