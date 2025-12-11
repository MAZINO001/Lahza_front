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
  GanttCreateMarkerTrigger,
} from "@/components/kibo-ui/gantt";

import React, { useState } from "react";

// Helper function to group array by key
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

export default function GanttComponent({ tasks, projectId }) {
  const [editingTask, setEditingTask] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const transformedTasks =
    tasks?.length > 0 ? (
      tasks.map((task) => {
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
    ) : (
      <div>no tasks found </div>
    );
  const groupedTasks = groupBy(transformedTasks, "metadata.group.name");
  const laneGroupedTasks = Object.fromEntries(
    Object.entries(groupedTasks).map(([groupName, groupTasks]) => [
      groupName,
      groupBy(groupTasks, "lane"),
    ])
  );

  const handleMoveTask = (id, startAt, endAt) => {
    if (!endAt) return;
    console.log(`Move task: ${id} from ${startAt} to ${endAt}`);
  };
  const handleTaskEdit = (taskId) => {
    console.log("task " + taskId + " is Edited");
  };

  const handleTaskAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleTaskDelete = (taskId) => {
    console.log("task " + taskId + " is deleted");
  };

  const testClick = (id) => {
    console.log("test for " + id);
    setIsClicked(!isClicked);
  };
  return (
    <div className=" w-full h-full">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Project Timeline</h2>
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
      </div>

      <div className="w-full h-[88%]">
        <GanttProvider
          tasks={tasks}
          onTaskChange={(task) => handleTaskEdit(task.id, task)}
          onTaskClick={(task) => console.log("EDIT THIS:", task)}
          onTaskDelete={(task) => handleTaskDelete(task.id)}
          className="border rounded-lg"
          range="monthly"
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
                    <GanttSidebarItem
                      key={laneId}
                      feature={representativeTask}
                    />
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
                      <div key={laneId} onClick={() => testClick(laneId)}>
                        <GanttFeatureRow
                          features={laneTaskList}
                          onMove={handleMoveTask}
                        >
                          {(task) => (
                            <div className="flex w-full items-center gap-2 ">
                              <p className="flex-1 truncate text-xs">
                                {task.name}
                              </p>
                            </div>
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

      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task: {editingTask.title}</DialogTitle>
              <TaskEditPage
                task={editingTask}
                projectId={projectId}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
