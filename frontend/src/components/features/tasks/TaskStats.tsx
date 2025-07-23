"use client";

import { useTaskStats } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function TaskStats() {
  const { t } = useTranslation();
  const { data: stats, isLoading, error } = useTaskStats();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-red-500">{error.message}</p>;
  }

  return (
    <Card className="p-4">
      <h3 className="font-bold mb-2">{t("tasks:stats.title")}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.total}</p>
          <p className="text-sm text-gray-500">{t("tasks:stats.total")}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.pending}</p>
          <p className="text-sm text-gray-500">{t("tasks:status.pending")}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.inProgress}</p>
          <p className="text-sm text-gray-500">
            {t("tasks:status.inProgress")}
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{stats?.completed}</p>
          <p className="text-sm text-gray-500">{t("tasks:status.completed")}</p>
        </div>
      </div>
    </Card>
  );
}
