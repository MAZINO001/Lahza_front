import { TasksForm } from "@/features/tasks/components/TasksForm";
import { useTask } from "@/features/tasks/hooks/useTasksQuery";

export default function TaskEditPage({ taskId, projectId, onCancel }) {
  const { data: task, isLoading } = useTask(projectId, taskId);

  if (isLoading) return <div>Loading...</div>;
  if (!task) return <div>Task not found</div>;

  return <TasksForm task={task} projectId={projectId} onCancel={onCancel} />;
}
