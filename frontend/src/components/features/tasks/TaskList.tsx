"use client";

import { TaskCard } from "./TaskCard";
import { useTasks, useTaskMutations } from "@/hooks";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useTaskStore, type Task } from "@/store";

export function TaskList() {
  const { t } = useTranslation();
  const { data: tasks, isLoading, error } = useTasks();
  const { setSelectedTask, toggleTaskModal } = useTaskStore();
  const { deleteTask } = useTaskMutations();

  if (isLoading) {
    return <LoadingSpinner centered />;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    toggleTaskModal();
  };

  const handleDelete = (task: Task) => {
    if (window.confirm(t("tasks:confirmDelete"))) {
      deleteTask(task.id);
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {tasks?.data.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
      {tasks?.data.length === 0 && <p>{t("tasks:empty")}</p>}
    </div>
  );
}
