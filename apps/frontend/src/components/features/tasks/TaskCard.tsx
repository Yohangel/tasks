"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "react-i18next";
import type { Task } from "@/store";
import { withFadeIn } from "@/components/features/common/withFadeIn";

export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const { t } = useTranslation();

  const statusColors: Record<Task["status"], string> = {
    PENDING: "bg-yellow-500",
    IN_PROGRESS: "bg-blue-500",
    COMPLETED: "bg-green-500",
    CANCELLED: "bg-red-500",
  };

  return (
    <Card className="p-4 space-y-2">
      <div className="flex justify-between items-start">
        <h3 className="font-bold">{task.title}</h3>
        <Badge className={statusColors[task.status]}>
          {t(`tasks:status.${task.status.toLowerCase()}`)}
        </Badge>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {task.description}
      </p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(task)}>
          {t("common:edit")}
        </Button>
        <Button variant="destructive" size="sm" onClick={() => onDelete(task)}>
          {t("common:delete")}
        </Button>
      </div>
    </Card>
  );
}

export const AnimatedTaskCard = withFadeIn(TaskCard);
