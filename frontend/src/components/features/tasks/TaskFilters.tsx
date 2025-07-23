"use client";

import { useTranslation } from "react-i18next";
import { useTasks } from "@/hooks";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TaskStatus } from "@/store";

export function TaskFilters() {
  const { t } = useTranslation();
  const { filters, setFilters, resetFilters } = useTasks();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ search: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value as TaskStatus });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4">
      <Input
        type="search"
        placeholder={t("tasks:filters.search")}
        value={filters.search || ""}
        onChange={handleSearchChange}
        className="w-full sm:w-auto sm:flex-grow"
      />
      <select
        value={filters.status || ""}
        onChange={handleStatusChange}
        className="w-full sm:w-auto border-gray-300 rounded-md shadow-sm"
      >
        <option value="">{t("tasks:filters.all")}</option>
        <option value="PENDING">{t("tasks:status.pending")}</option>
        <option value="IN_PROGRESS">{t("tasks:status.inProgress")}</option>
        <option value="COMPLETED">{t("tasks:status.completed")}</option>
        <option value="CANCELLED">{t("tasks:status.cancelled")}</option>
      </select>
      <Button variant="ghost" onClick={() => resetFilters()}>
        {t("common:clear")}
      </Button>
    </div>
  );
}
