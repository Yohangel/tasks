import { useQuery } from '@tanstack/react-query';
import { apiClient, PaginatedResponse } from '@/api/client';
import { Task, TaskFilters, useTaskStore } from '@/store/useTaskStore';
import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

/**
 * Hook for fetching tasks with filters
 */
export const useTasks = (initialFilters?: Partial<TaskFilters>) => {
  const taskStore = useTaskStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Merge store filters with any provided initial filters
  const filters = {
    ...taskStore.filters,
    ...(initialFilters || {}),
  };
  
  // Sync URL with filters on mount and when filters change
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;
    
    // Update URL with current filters
    const newUrl = `${pathname}${taskStore.getUrlFromFilters(filters)}`;
    router.replace(newUrl, { scroll: false });
  }, [
    filters.status,
    filters.search,
    filters.page,
    filters.limit,
    filters.sortBy,
    filters.sortOrder,
    pathname,
    router,
    taskStore,
  ]);
  
  // Sync filters with URL on mount
  useEffect(() => {
    if (searchParams && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      taskStore.syncFiltersWithUrl(url);
    }
  }, [searchParams, taskStore]);
  
  // Fetch tasks with current filters
  const tasksQuery = useQuery({
    queryKey: ['tasks', filters],
    queryFn: () => apiClient.get<PaginatedResponse<Task>>('/tasks', filters),
    enabled: !!apiClient.isAuthenticated(),
  });
  
  return {
    ...tasksQuery,
    filters,
    setFilters: taskStore.setFilters,
    resetFilters: taskStore.resetFilters,
    selectedTask: taskStore.selectedTask,
    setSelectedTask: taskStore.setSelectedTask,
    isTaskModalOpen: taskStore.isTaskModalOpen,
    toggleTaskModal: taskStore.toggleTaskModal,
    viewMode: taskStore.viewMode,
    setViewMode: taskStore.setViewMode,
  };
};