import { ServiceForm } from "@/features/services/components/ServiceForm";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext();
  return <ServiceForm serviceId={id} onSuccess={() => navigate(`${role}/services`)} />;
}
