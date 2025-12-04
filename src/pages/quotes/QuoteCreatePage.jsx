import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { DocumentForm } from "@/features/documents/components/DocumentForm"
export default function QuoteCreatePage() {
  const navigate = useNavigate();
  const { role } = useAuthContext()
  return <DocumentForm onSuccess={() => navigate(`/${role}/quotes`)} />;
};

