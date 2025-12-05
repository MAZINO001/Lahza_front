import { ProjectsTable } from "@/features/projects/components/ProjectTable";
import { useProjects } from "@/features/projects/hooks/useProjects";
export default function ProjectPage() {
  const { data: Projects = [], isLoading } = useProjects();
  return <ProjectsTable projects={Projects} isLoading={isLoading} />;
}
