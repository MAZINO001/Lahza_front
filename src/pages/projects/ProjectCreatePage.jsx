import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { useNavigate } from "react-router-dom";

export default function ProjectCreatePage() {
  const navigate = useNavigate();
  return <ProjectForm onSuccess={() => navigate(-1)} />;
}
