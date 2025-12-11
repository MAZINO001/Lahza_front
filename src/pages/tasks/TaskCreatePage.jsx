import { TasksForm } from "@/features/tasks/components/TasksForm";

export default function TaskCreatePage({ onCancel }) {
  const currentPath = window.location.pathname;
  const pathMatch = currentPath.match(/\/project\/(\d+)/);
  const projectId = pathMatch ? pathMatch[1] : null;

  return <TasksForm projectId={projectId} onCancel={onCancel} />;
}
