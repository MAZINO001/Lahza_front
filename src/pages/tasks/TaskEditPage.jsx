import { TasksForm } from "@/features/tasks/components/TasksForm";
import { useTask } from "@/features/tasks/hooks/useTasksQuery";
import { useParams } from "react-router-dom";

export default function TaskEditPage({ onCancel, onSuccess, projectId: propProjectId, taskId: propTaskId }) {
  // Get params from URL if available, otherwise use props
  const urlParams = useParams();
  const projectId = propProjectId || urlParams.id;
  const taskId = propTaskId || urlParams.taskId;

  const { data: task, isLoading } = useTask(projectId, taskId);

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  const handleSuccess = () => {
    onSuccess?.();
    onCancel?.();
  };

  return <TasksForm task={task} projectId={projectId} onCancel={onCancel} onSuccess={handleSuccess} />;
}
