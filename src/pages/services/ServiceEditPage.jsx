// src/pages/services/ServiceEditPage.jsx
import { ServiceForm } from "@/features/services/components/ServiceForm";
import { useService } from "@/features/services/hooks/useServiceQuery";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthContext()
  const { data: service, isLoading } = useService(id);

  if (!service) return <div>Service not found</div>;

  return <ServiceForm service={service} onSuccess={() => navigate(`/${role}/services`)} />;
}