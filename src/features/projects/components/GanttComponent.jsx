import {
  GanttProvider,
  GanttHeader,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttFeatureRow,
} from "@/components/kibo-ui/gantt";

import React, { useState } from "react";
import { useAuthContext } from "@/hooks/AuthContext";

const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const value = key.split(".").reduce((obj, k) => obj?.[k], item);
    (result[value] = result[value] || []).push(item);
    return result;
  }, {});
};

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TaskCreatePage from "@/pages/tasks/TaskCreatePage";
import TaskEditPage from "@/pages/tasks/TaskEditPage";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  useDeleteTask,
  useUpdateTask,
  useMarkTaskComplete,
} from "@/features/tasks/hooks/useTasksQuery";

export default function GanttComponent({ tasks, projectId, role }) {
  const { role: contextRole } = useAuthContext();
  const userRole = role || contextRole;
  const isClient = userRole === "client";
  const [editingTask, setEditingTask] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const deleteTaskMutation = useDeleteTask();
  const updateTaskMutation = useUpdateTask();
  const markTaskCompleteMutation = useMarkTaskComplete();

  const transformedTasks =
    tasks?.length > 0
      ? tasks.map((task) => {
        const startDate = task.start_date
          ? new Date(task.start_date)
          : task.startAt || new Date();
        const endDate = task.end_date
          ? new Date(task.end_date)
          : task.endAt ||
          new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        return {
          id: task.id,
          name: task.title || task.name || `Task ${task.id}`,
          startAt: startDate,
          endAt: endDate,
          status: {
            color:
              task.status === "completed"
                ? "#10b981"
                : task.status === "in_progress"
                  ? "#3b82f6"
                  : task.status === "pending"
                    ? "#f59e0b"
                    : task.status?.color || "#6b7280",
          },
          lane: task.lane || task.id,
          metadata: {
            group: { name: task.group || "Tasks" },
          },
        };
      })
      : [];
  const groupedTasks = groupBy(transformedTasks, "metadata.group.name");
  const laneGroupedTasks = Object.fromEntries(
    Object.entries(groupedTasks).map(([groupName, groupTasks]) => [
      groupName,
      groupBy(groupTasks, "lane"),
    ])
  );

  const handleMoveTask = (id, startAt, endAt) => {
    if (isClient) return; // Clients cannot move tasks
    if (!endAt) return;

    const startDate =
      startAt instanceof Date ? startAt.toISOString().split("T")[0] : startAt;
    const endDate =
      endAt instanceof Date ? endAt.toISOString().split("T")[0] : endAt;

    updateTaskMutation.mutate(
      {
        projectId,
        taskId: id,
        data: {
          start_date: startDate,
          end_date: endDate,
        },
      },
      {
        onSuccess: () => {
          console.log("Task dates updated successfully");
        },
        onError: (err) => {
          console.error("Failed to update task dates:", err);
        },
      }
    );
  };

  const handleTaskDelete = (taskId) => {
    if (isClient) return; // Clients cannot delete tasks
    deleteTaskMutation.mutate(
      { projectId, taskId },
      {
        onSuccess: () => {
          console.log("Task deleted successfully");
        },
        onError: (err) => console.error("Delete failed:", err),
      }
    );
  };

  const handleMarkComplete = (taskId) => {
    if (isClient) return; // Clients cannot mark tasks complete
    markTaskCompleteMutation.mutate(
      { taskId, projectId },
      {
        onSuccess: () => {
          console.log("Task marked as complete successfully");
        },
        onError: (err) => console.error("Mark complete failed:", err),
      }
    );
  };

  const handleTaskEdit = (task) => {
    if (isClient) return; // Clients cannot edit tasks
    setEditingTask(task);
    setIsEditDialogOpen(true);
    console.log(task);
  };

  const handleTaskAdd = () => {
    if (isClient) return; // Clients cannot add tasks
    setIsAddDialogOpen(true);
  };

  return (
    <div className="w-full h-full ">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Project Timeline</h2>
        {!isClient && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleTaskAdd}>+ Add Task</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  <TaskCreatePage onCancel={() => setIsAddDialogOpen(false)} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="w-full h-full overflow-hidden">
        <GanttProvider
          tasks={transformedTasks}
          onTaskChange={(task) =>
            !isClient && handleMoveTask(task.id, task.startAt, task.endAt)
          }
          onTaskClick={(task) => console.log("EDIT THIS:", task)}
          onTaskDelete={(task) => !isClient && handleTaskDelete(task.id)}
          className="border border-border rounded-lg"
          range="daily"
          zoom={100}
        >
          <GanttSidebar>
            {Object.entries(laneGroupedTasks).map(([groupName, laneTasks]) => (
              <GanttSidebarGroup key={groupName} name={groupName}>
                {Object.entries(laneTasks).map(([laneId, laneTaskList]) => {
                  const validTasks = laneTaskList.filter(
                    (t) => t.startAt && t.endAt
                  );
                  if (validTasks.length === 0) return null;

                  const representativeTask = {
                    id: laneId,
                    name: laneTaskList[0].name,
                    startAt: new Date(
                      Math.min(...validTasks.map((t) => t.startAt.getTime()))
                    ),
                    endAt: new Date(
                      Math.max(...validTasks.map((t) => t.endAt.getTime()))
                    ),
                    status: laneTaskList[0].status,
                  };

                  return (
                    <div key={laneId} className="relative ">
                      <ContextMenu>
                        <ContextMenuTrigger asChild>
                          <div>
                            <GanttSidebarItem feature={representativeTask} />
                          </div>
                        </ContextMenuTrigger>

                        <ContextMenuContent>
                          {!isClient && (
                            <>
                              <ContextMenuItem
                                onClick={() => handleTaskEdit(representativeTask)}
                              >
                                Edit
                              </ContextMenuItem>
                              <ContextMenuItem
                                onClick={() => handleMarkComplete(laneId)}
                              >
                                Mark as Complete
                              </ContextMenuItem>
                              <ContextMenuItem
                                onClick={() => handleTaskDelete(laneId)}
                              >
                                Delete
                              </ContextMenuItem>
                            </>
                          )}
                          {isClient && (
                            <ContextMenuItem disabled>
                              View Only (Client Access)
                            </ContextMenuItem>
                          )}
                        </ContextMenuContent>
                      </ContextMenu>
                    </div>
                  );
                })}
              </GanttSidebarGroup>
            ))}
          </GanttSidebar>

          <GanttTimeline>
            <GanttHeader />
            <GanttFeatureList>
              {Object.entries(laneGroupedTasks).map(
                ([groupName, laneTasks]) => (
                  <GanttFeatureListGroup key={groupName}>
                    {Object.entries(laneTasks).map(([laneId, laneTaskList]) => (
                      <div key={laneId}>
                        <GanttFeatureRow
                          features={laneTaskList}
                          onMove={handleMoveTask}
                        >
                          {(task) => (
                            <ContextMenu>
                              <ContextMenuTrigger asChild>
                                <div className="flex w-full items-center gap-2 cursor-pointer hover:bg-muted/50 p-1 rounded">
                                  <p className="flex-1 truncate text-xs">
                                    {task.name}
                                  </p>
                                </div>
                              </ContextMenuTrigger>
                              <ContextMenuContent>
                                {!isClient && (
                                  <>
                                    <ContextMenuItem
                                      onClick={() => handleTaskEdit(task)}
                                    >
                                      Edit
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                      onClick={() => handleMarkComplete(task.id)}
                                    >
                                      Mark as Complete
                                    </ContextMenuItem>
                                    <ContextMenuItem
                                      onClick={() => handleTaskDelete(task.id)}
                                    >
                                      Delete
                                    </ContextMenuItem>
                                  </>
                                )}
                                {isClient && (
                                  <ContextMenuItem disabled>
                                    View Only (Client Access)
                                  </ContextMenuItem>
                                )}
                              </ContextMenuContent>
                            </ContextMenu>
                          )}
                        </GanttFeatureRow>
                      </div>
                    ))}
                  </GanttFeatureListGroup>
                )
              )}
            </GanttFeatureList>
            <GanttToday />
          </GanttTimeline>
        </GanttProvider>
      </div>

      {isEditDialogOpen && (
        <Dialog
          open={!!isEditDialogOpen}
          onOpenChange={(open) => !open && setIsEditDialogOpen(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task: {editingTask?.id}</DialogTitle>
              <DialogDescription>
                Edit the task details below.
              </DialogDescription>
            </DialogHeader>
            <TaskEditPage
              taskId={editingTask?.id}
              projectId={projectId}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
