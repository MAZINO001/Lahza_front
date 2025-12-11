import { useParams } from "react-router-dom";
import { TasksForm } from "@/features/tasks/components/TasksForm";
import { useTask } from "@/features/tasks/hooks/useTasksQuery";

export default function TaskEditPage({ onCancel }) {
  const { id: taskId } = useParams();

  // Extract projectId from URL
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  const { data: task, isLoading } = useTask(projectId, taskId);

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return <TasksForm task={task} projectId={projectId} onCancel={onCancel} />;
}
