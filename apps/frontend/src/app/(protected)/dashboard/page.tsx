"use client";

import { useTranslation } from "react-i18next";
import { TaskList, TaskFilters, TaskStats } from "@/components/features/tasks";
import { Button } from "@/components/ui/Button";
import { useTaskStore } from "@/store";
import { useTasks } from "@/hooks";
import { Pagination } from "@/components/ui/Pagination";
import { Sort } from "@/components/ui/Sort";

export default function DashboardPage() {
  const { t } = useTranslation();
  const { toggleTaskModal, setSelectedTask } = useTaskStore();
  const { data: tasks, filters, setFilters } = useTasks();

  const handleCreateTask = () => {
    setSelectedTask(null);
    toggleTaskModal();
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters({ sortBy, sortOrder });
  };

  const sortOptions = [
    { value: "createdAt", label: t("common.createdAt") },
    { value: "title", label: t("tasks.title") },
    { value: "status", label: t("tasks.status.title") },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t("common.dashboard")}</h1>
        <Button onClick={handleCreateTask}>{t("tasks.create")}</Button>
      </div>
      <p className="mb-4">{t("common.welcomeMessage")}</p>
      <TaskStats />
      <div className="flex justify-between items-center mb-4 mt-4">
        <TaskFilters />
        <Sort
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={handleSortChange}
          options={sortOptions}
        />
      </div>
      <TaskList />
      {tasks && tasks.meta.totalPages > 1 && (
        <Pagination
          currentPage={tasks.meta.page}
          totalPages={tasks.meta.totalPages}
          onPageChange={handlePageChange}
          className="mt-4"
        />
      )}
    </div>
  );
}
