import { useNavigate } from "react-router-dom";
import { AdditionalDataForm } from "@/features/additional_data/components/AdditionalDataForm";
import { useAuthContext } from "@/hooks/AuthContext";

export default function AdditionalDataEditPage() {
  const navigate = useNavigate();
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;
  const role = useAuthContext();
  return (
    <AdditionalDataForm projectId={projectId} onSuccess={() => navigate(`/${role}/projects/${projectId}`)} />
  );
}
