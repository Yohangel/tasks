"use client";

import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { cn } from "@/utils/cn";
import { ErrorBoundary } from "@/components/features/common";
import dynamic from "next/dynamic";

const TaskModal = dynamic(
  () => import("@/components/features/tasks").then((mod) => mod.TaskModal),
  { ssr: false }
);

export interface LayoutProps {
  children: ReactNode;
  className?: string;
  hideFooter?: boolean;
  hideSidebar?: boolean;
}

export function Layout({
  children,
  className,
  hideFooter = false,
  hideSidebar = false,
}: LayoutProps) {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen flex flex-col">
        <Header />

        <div className="flex flex-1">
          {!hideSidebar && <Sidebar />}

          <main className={cn("flex-1 px-4 py-6 md:px-6 lg:px-8", className)}>
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>

        {!hideFooter && <Footer />}
        <TaskModal />
      </div>
    </ErrorBoundary>
  );
}
