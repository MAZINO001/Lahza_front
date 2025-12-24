import { useNavigate } from "react-router-dom";
import { AdditionalDataForm } from "@/features/additional_data/components/AdditionalDataForm";

export default function AdditionalDataCreatePage() {
  const navigate = useNavigate();
  // Extract projectId from URL
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  return (
    <AdditionalDataForm projectId={projectId} onSuccess={() => navigate(-1)} />
  );
}
