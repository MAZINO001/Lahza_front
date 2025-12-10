/* eslint-disable no-unused-vars */
import { useParams, useNavigate } from "react-router-dom";
import { AdditionalDataForm } from "@/features/additional_data/components/AdditionalDataForm";
import { useAdditionalData } from "@/features/additional_data/hooks/useAdditionalDataQuery";
import { useAuthContext } from "@/hooks/AuthContext";

export default function AdditionalDataEditPage() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  const { data: additionalData, isLoading } = useAdditionalData(projectId);

  if (isLoading) return <div>Loading...</div>;
  if (!additionalData) return <div>Additional data not found</div>;

  return (
    <AdditionalDataForm
      additionalData={additionalData}
      projectId={projectId}
      clientID={user.id}
      onSuccess={() => navigate(-1)}
    />
  );
}
