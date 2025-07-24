import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { TaskStats } from '@/store/useTaskStore';

/**
 * Hook for fetching task statistics
 */
export const useTaskStats = () => {
  const statsQuery = useQuery({
    queryKey: ['task-stats'],
    queryFn: () => apiClient.get<TaskStats>('/tasks/stats'),
    enabled: !!apiClient.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  return {
    ...statsQuery,
    stats: statsQuery.data,
  };
};