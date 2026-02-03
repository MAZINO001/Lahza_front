// src/pages/services/ServiceCreatePage.jsx
import { ServiceForm } from "@/features/services/components/ServiceForm";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";

export default function ServiceCreatePage() {
  const navigate = useNavigate();
  return <ServiceForm onSuccess={() => navigate(-1)} />;
}
