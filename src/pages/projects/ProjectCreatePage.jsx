import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { useNavigate } from "react-router-dom";

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  return (
    <div className="p-4">
      <ProjectForm onSuccess={() => navigate(-1)} />;
    </div>
  );
}
