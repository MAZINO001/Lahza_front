import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { DocumentForm } from "@/features/documents/components/DocumentForm";
export default function QuoteEditPage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  return (
    <DocumentForm
      type={"quotes"}
      onSuccess={() => navigate(`/${role}/quotes`)}
    />
  );
}
