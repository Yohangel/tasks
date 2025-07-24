import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Task, CreateTaskData, UpdateTaskData, useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';

/**
 * Hook for task CRUD operations
 */
export const useTaskMutations = () => {
  const queryClient = useQueryClient();
  const uiStore = useUIStore();
  const taskStore = useTaskStore();
  
  // Create task mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateTaskData) => apiClient.post<Task>('/tasks', data),
    onSuccess: () => {
      // Invalidate tasks queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      // Close modal and reset selected task
      taskStore.toggleTaskModal();
      
      // Show success toast
      uiStore.addToast({
        type: 'success',
        message: 'Task created successfully',
        duration: 3000,
      });
    },
  });
  
  // Update task mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskData }) => 
      apiClient.put<Task>(`/tasks/${id}`, data),
    onSuccess: () => {
      // Invalidate tasks queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      // Close modal and reset selected task
      taskStore.toggleTaskModal();
      
      // Show success toast
      uiStore.addToast({
        type: 'success',
        message: 'Task updated successfully',
        duration: 3000,
      });
    },
  });
  
  // Delete task mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(`/tasks/${id}`),
    onSuccess: () => {
      // Invalidate tasks queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      // Show success toast
      uiStore.addToast({
        type: 'success',
        message: 'Task deleted successfully',
        duration: 3000,
      });
    },
  });
  
  // Update task status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Task['status'] }) => 
      apiClient.patch<Task>(`/tasks/${id}/status`, { status }),
    onSuccess: () => {
      // Invalidate tasks queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['task-stats'] });
      
      // Show success toast
      uiStore.addToast({
        type: 'success',
        message: 'Task status updated',
        duration: 3000,
      });
    },
  });
  
  return {
    createTask: createMutation.mutate,
    updateTask: updateMutation.mutate,
    deleteTask: deleteMutation.mutate,
    updateTaskStatus: updateStatusMutation.mutate,
    isLoading: 
      createMutation.isPending || 
      updateMutation.isPending || 
      deleteMutation.isPending || 
      updateStatusMutation.isPending,
  };
};