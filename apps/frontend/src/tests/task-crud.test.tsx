import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskList } from '@/components/features/tasks/TaskList';
import { TaskCard } from '@/components/features/tasks/TaskCard';
import { useTaskMutations, useTasks } from '@/hooks';
import { useTaskStore } from '@/store';
import { Task } from '@/store/useTaskStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks
jest.mock('@/hooks', () => ({
  useTasks: jest.fn(),
  useTaskMutations: jest.fn(),
}));

// Mock the store
jest.mock('@/store', () => ({
  useTaskStore: jest.fn(),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common:edit': 'Edit',
        'common:delete': 'Delete',
        'tasks:confirmDelete': 'Are you sure you want to delete this task?',
        'tasks:empty': 'No tasks found',
        'tasks:status.pending': 'Pending',
        'tasks:status.in_progress': 'In Progress',
        'tasks:status.completed': 'Completed',
        'tasks:status.cancelled': 'Cancelled',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock window.confirm
const originalConfirm = window.confirm;
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});
afterEach(() => {
  window.confirm = originalConfirm;
});

// Sample task data
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'This is a test task',
    status: 'PENDING',
    userId: 'user1',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'This is another test task',
    status: 'IN_PROGRESS',
    userId: 'user1',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
];

// Create a wrapper with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Task CRUD Operations', () => {
  describe('TaskCard Component', () => {
    it('renders task information correctly', () => {
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      
      render(
        <TaskCard 
          task={mockTasks[0]} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      );
      
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('This is a test task')).toBeInTheDocument();
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
    
    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      
      render(
        <TaskCard 
          task={mockTasks[0]} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      );
      
      await user.click(screen.getByText('Edit'));
      expect(onEdit).toHaveBeenCalledWith(mockTasks[0]);
    });
    
    it('calls onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      const onEdit = jest.fn();
      const onDelete = jest.fn();
      
      render(
        <TaskCard 
          task={mockTasks[0]} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      );
      
      await user.click(screen.getByText('Delete'));
      expect(onDelete).toHaveBeenCalledWith(mockTasks[0]);
    });
  });
  
  describe('TaskList Component', () => {
    it('renders loading state correctly', () => {
      (useTasks as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        setSelectedTask: jest.fn(),
        toggleTaskModal: jest.fn(),
      });
      
      (useTaskMutations as jest.Mock).mockReturnValue({
        deleteTask: jest.fn(),
      });
      
      render(<TaskList />);
      
      // Should render 6 skeleton loaders
      const skeletons = document.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });
    
    it('renders error state correctly', () => {
      (useTasks as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch tasks'),
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        setSelectedTask: jest.fn(),
        toggleTaskModal: jest.fn(),
      });
      
      (useTaskMutations as jest.Mock).mockReturnValue({
        deleteTask: jest.fn(),
      });
      
      render(<TaskList />);
      
      expect(screen.getByText('Failed to fetch tasks')).toBeInTheDocument();
    });
    
    it('renders tasks correctly', () => {
      const mockSetSelectedTask = jest.fn();
      const mockToggleTaskModal = jest.fn();
      const mockDeleteTask = jest.fn();
      
      (useTasks as jest.Mock).mockReturnValue({
        data: {
          data: mockTasks,
          meta: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
        isLoading: false,
        error: null,
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        setSelectedTask: mockSetSelectedTask,
        toggleTaskModal: mockToggleTaskModal,
      });
      
      (useTaskMutations as jest.Mock).mockReturnValue({
        deleteTask: mockDeleteTask,
      });
      
      render(<TaskList />);
      
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('This is a test task')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.getByText('This is another test task')).toBeInTheDocument();
    });
    
    it('handles edit task correctly', async () => {
      const user = userEvent.setup();
      const mockSetSelectedTask = jest.fn();
      const mockToggleTaskModal = jest.fn();
      const mockDeleteTask = jest.fn();
      
      (useTasks as jest.Mock).mockReturnValue({
        data: {
          data: mockTasks,
          meta: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
        isLoading: false,
        error: null,
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        setSelectedTask: mockSetSelectedTask,
        toggleTaskModal: mockToggleTaskModal,
      });
      
      (useTaskMutations as jest.Mock).mockReturnValue({
        deleteTask: mockDeleteTask,
      });
      
      render(<TaskList />);
      
      // Find all edit buttons and click the first one
      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);
      
      expect(mockSetSelectedTask).toHaveBeenCalledWith(mockTasks[0]);
      expect(mockToggleTaskModal).toHaveBeenCalled();
    });
    
    it('handles delete task correctly', async () => {
      const user = userEvent.setup();
      const mockSetSelectedTask = jest.fn();
      const mockToggleTaskModal = jest.fn();
      const mockDeleteTask = jest.fn();
      
      (useTasks as jest.Mock).mockReturnValue({
        data: {
          data: mockTasks,
          meta: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        },
        isLoading: false,
        error: null,
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        setSelectedTask: mockSetSelectedTask,
        toggleTaskModal: mockToggleTaskModal,
      });
      
      (useTaskMutations as jest.Mock).mockReturnValue({
        deleteTask: mockDeleteTask,
      });
      
      render(<TaskList />);
      
      // Find all delete buttons and click the first one
      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);
      
      expect(window.confirm).toHaveBeenCalled();
      expect(mockDeleteTask).toHaveBeenCalledWith(mockTasks[0].id);
    });
    
    it('renders empty state correctly', () => {
      (useTasks as jest.Mock).mockReturnValue({
        data: {
          data: [],
          meta: {
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0,
          },
        },
        isLoading: false,
        error: null,
      });
      
      (useTaskStore as jest.Mock).mockReturnValue({
        setSelectedTask: jest.fn(),
        toggleTaskModal: jest.fn(),
      });
      
      (useTaskMutations as jest.Mock).mockReturnValue({
        deleteTask: jest.fn(),
      });
      
      render(<TaskList />);
      
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
    });
  });
});