import { useNavigate } from "react-router-dom";
import { AdditionalDataForm } from "@/features/additional_data/components/AdditionalDataForm";
import { useAuthContext } from "@/hooks/AuthContext";

export default function AdditionalDataCreatePage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  // Extract projectId from URL
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  return (
    <AdditionalDataForm
      projectId={projectId}
      clientID={user.id}
      onSuccess={() => navigate(-1)}
    />
  );
}
