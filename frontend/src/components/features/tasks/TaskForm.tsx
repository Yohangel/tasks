"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTaskMutations } from "@/hooks";
import { useEffect } from "react";
import type { Task, CreateTaskData, UpdateTaskData } from "@/store";

const taskSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export interface TaskFormProps {
  task?: Task;
  onClose: () => void;
}

export function TaskForm({ task, onClose }: TaskFormProps) {
  const { t } = useTranslation();
  const { createTask, updateTask, isLoading } = useTaskMutations();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
      });
    }
  }, [task, reset]);

  const onSubmit = (data: TaskFormValues) => {
    if (task) {
      updateTask({ id: task.id, data });
    } else {
      createTask(data as CreateTaskData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("title")}
        type="text"
        placeholder={t("tasks:title")}
        error={errors.title?.message}
      />
      <Input
        {...register("description")}
        type="text"
        placeholder={t("tasks:description")}
        error={errors.description?.message}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t("common:cancel")}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t("common:loading") : t("common:save")}
        </Button>
      </div>
    </form>
  );
}
