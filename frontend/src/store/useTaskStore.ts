import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface TaskFilters {
  status?: TaskStatus;
  search?: string;
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export interface TaskState {
  filters: TaskFilters;
  selectedTask: Task | null;
  isTaskModalOpen: boolean;
  viewMode: 'grid' | 'list';
  
  // Actions
  setFilters: (filters: Partial<TaskFilters>) => void;
  setSelectedTask: (task: Task | null) => void;
  toggleTaskModal: () => void;
  resetFilters: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  syncFiltersWithUrl: (url: URL) => void;
  getUrlFromFilters: (filters: TaskFilters) => string;
}

// Default filters
const defaultFilters: TaskFilters = {
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

// Create the store
export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      filters: defaultFilters,
      selectedTask: null,
      isTaskModalOpen: false,
      viewMode: 'grid',
      
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
        // Reset to page 1 if filters other than pagination change
        ...(filters.page === undefined && { 
          filters: { 
            ...state.filters, 
            ...filters, 
            page: 1 
          } 
        }),
      })),
      
      setSelectedTask: (task) => set({ selectedTask: task }),
      
      toggleTaskModal: () => set((state) => ({
        isTaskModalOpen: !state.isTaskModalOpen,
        // Reset selected task when closing modal
        ...(!state.isTaskModalOpen ? {} : { selectedTask: null }),
      })),
      
      resetFilters: () => set({ filters: defaultFilters }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      // Sync filters with URL parameters
      syncFiltersWithUrl: (url) => {
        const params = url.searchParams;
        const newFilters: Partial<TaskFilters> = {};
        
        // Extract filter values from URL
        if (params.has('status')) {
          newFilters.status = params.get('status') as TaskStatus;
        }
        
        if (params.has('search')) {
          newFilters.search = params.get('search') || undefined;
        }
        
        if (params.has('page')) {
          const page = parseInt(params.get('page') || '1', 10);
          newFilters.page = isNaN(page) ? 1 : page;
        }
        
        if (params.has('limit')) {
          const limit = parseInt(params.get('limit') || '10', 10);
          newFilters.limit = isNaN(limit) ? 10 : limit;
        }
        
        if (params.has('sortBy')) {
          newFilters.sortBy = params.get('sortBy') || 'createdAt';
        }
        
        if (params.has('sortOrder')) {
          newFilters.sortOrder = (params.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
        }
        
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },
      
      // Generate URL from filters
      getUrlFromFilters: (filters) => {
        const params = new URLSearchParams();
        
        if (filters.status) {
          params.set('status', filters.status);
        }
        
        if (filters.search) {
          params.set('search', filters.search);
        }
        
        if (filters.page !== 1) {
          params.set('page', filters.page.toString());
        }
        
        if (filters.limit !== 10) {
          params.set('limit', filters.limit.toString());
        }
        
        if (filters.sortBy !== 'createdAt') {
          params.set('sortBy', filters.sortBy);
        }
        
        if (filters.sortOrder !== 'desc') {
          params.set('sortOrder', filters.sortOrder);
        }
        
        return params.toString() ? `?${params.toString()}` : '';
      },
    }),
    {
      name: 'task-storage',
      partialize: (state) => ({
        viewMode: state.viewMode,
        // Don't persist filters, selected task, or modal state
      }),
    }
  )
);