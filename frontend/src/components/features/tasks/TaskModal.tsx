"use client";

import { Modal } from "@/components/ui/Modal";
import { TaskForm } from "./TaskForm";
import { useTaskStore } from "@/store";
import { useTranslation } from "react-i18next";

export function TaskModal() {
  const { t } = useTranslation();
  const { isTaskModalOpen, toggleTaskModal, selectedTask } = useTaskStore();

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={toggleTaskModal}
      title={selectedTask ? t("tasks:edit") : t("tasks:create")}
    >
      <TaskForm task={selectedTask ?? undefined} onClose={toggleTaskModal} />
    </Modal>
  );
}
