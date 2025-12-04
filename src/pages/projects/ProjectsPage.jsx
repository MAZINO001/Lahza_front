import { ProjectsTable } from "@/features/projects/components/ProjectTable";
import { TheProjects } from "@/lib/mockData";
const project = TheProjects
export default function ProjectPage() {
  // const { data: documnets = [], isLoading } = useDocuments("invoice");
  const isLoading = false
  return <ProjectsTable projects={project} isLoading={isLoading} />;
};


