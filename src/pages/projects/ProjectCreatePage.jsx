import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { useAuthContext } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();
  return (
    <div className="p-4">
      <ProjectForm onSuccess={() => navigate(`/${role}/projects`)} />;
    </div>
  );
}
