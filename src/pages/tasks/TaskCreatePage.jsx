import { useNavigate } from "react-router-dom";
import { TasksForm } from "@/features/tasks/components/TasksForm";

export default function TaskCreatePage() {
    const navigate = useNavigate();

    // Extract projectId from URL
    const currentPath = window.location.pathname;
    const pathMatch = currentPath.match(/\/project\/(\d+)/);
    const projectId = pathMatch ? pathMatch[1] : null;

    return <TasksForm projectId={projectId} onSuccess={() => navigate(-1)} />;
}