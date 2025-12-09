/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { X, Plus, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormField from "@/components/Form/FormField";
import { useTasks } from "@/features/tasks/hooks/useTasksQuery";
export default function TasksPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: tasks } = useTasks();
  console.log(tasks);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      percentage: 0,
      estimated_time: 0,
    },
  });

  const onSubmit = (data) => {
    const newTask = {
      id: Date.now(),
      project_id: 1,
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    reset();
    setShowForm(false);
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
  };

  const handleRemoveTask = (taskId) => {
    console.log("this rask is removes " + taskId);
  };

  const handleSaveAll = () => {
    console.log("Saving all tasks:", tasks);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Project Tasks
              </h1>
              <p className="text-sm text-gray-500">
                {tasks?.length || 0} task(s) added
              </p>
            </div>
          </div>

          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          )}
        </div>

        {/* Task Form */}
        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormField
                      label="Task Title"
                      error={errors.title?.message}
                      placeholder="Enter task title"
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      type="textarea"
                      label="Description"
                      error={errors.description?.message}
                      placeholder="Enter task description"
                      {...field}
                    />
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    name="percentage"
                    control={control}
                    rules={{
                      required: "Percentage is required",
                      min: { value: 0, message: "Minimum is 0" },
                      max: { value: 100, message: "Maximum is 100" },
                    }}
                    render={({ field }) => (
                      <FormField
                        type="number"
                        label="Completion Percentage"
                        error={errors.percentage?.message}
                        placeholder="0-100"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />

                  <Controller
                    name="estimated_time"
                    control={control}
                    rules={{
                      required: "Estimated time is required",
                      min: { value: 0, message: "Minimum is 0" },
                    }}
                    render={({ field }) => (
                      <FormField
                        type="number"
                        label="Estimated Time (hours)"
                        error={errors.estimated_time?.message}
                        placeholder="Hours"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-blue-600">
                    Add Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        {tasks?.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Progress: {task.percentage || 0}%</span>
                      {task.estimated_time && (
                        <span>Time: {task.estimated_time}h</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline">Cancel All</Button>
              <Button onClick={handleSaveAll} className="bg-blue-600">
                Save All Tasks
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {tasks?.length === 0 && !showForm && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <ListTodo className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Get started by adding your first task
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
