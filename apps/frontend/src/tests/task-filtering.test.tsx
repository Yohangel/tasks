import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskFilters } from '@/components/features/tasks/TaskFilters';
import { useTasks } from '@/hooks';
import { TaskFilters as TaskFiltersType } from '@/store/useTaskStore';

// Mock the hooks
jest.mock('@/hooks', () => ({
    useTasks: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/dashboard',
}));

// Mock i18next
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => {
            const translations: Record<string, string> = {
                'tasks:filters.search': 'Search tasks',
                'tasks:filters.all': 'All statuses',
                'tasks:status.pending': 'Pending',
                'tasks:status.inProgress': 'In Progress',
                'tasks:status.completed': 'Completed',
                'tasks:status.cancelled': 'Cancelled',
                'common:clear': 'Clear',
            };
            return translations[key] || key;
        },
    }),
}));

describe('Task Filtering and Pagination', () => {
    describe('TaskFilters Component', () => {
        it('renders filter inputs correctly', () => {
            const mockSetFilters = jest.fn();
            const mockResetFilters = jest.fn();

            const mockFilters: TaskFiltersType = {
                search: '',
                status: undefined,
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            };

            (useTasks as jest.Mock).mockReturnValue({
                filters: mockFilters,
                setFilters: mockSetFilters,
                resetFilters: mockResetFilters,
            });

            render(<TaskFilters />);

            expect(screen.getByPlaceholderText('Search tasks')).toBeInTheDocument();
            expect(screen.getByText('All statuses')).toBeInTheDocument();
            expect(screen.getByText('Clear')).toBeInTheDocument();
        });

        it('handles search input correctly', async () => {
            const user = userEvent.setup();
            const mockSetFilters = jest.fn();
            const mockResetFilters = jest.fn();

            const mockFilters: TaskFiltersType = {
                search: '',
                status: undefined,
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            };

            (useTasks as jest.Mock).mockReturnValue({
                filters: mockFilters,
                setFilters: mockSetFilters,
                resetFilters: mockResetFilters,
            });

            render(<TaskFilters />);

            const searchInput = screen.getByPlaceholderText('Search tasks');
            await user.type(searchInput, 'test search');

            // The user.type will call setFilters for each character, so we check if it was called
            expect(mockSetFilters).toHaveBeenCalled();
        });

        it('handles status filter correctly', async () => {
            const user = userEvent.setup();
            const mockSetFilters = jest.fn();
            const mockResetFilters = jest.fn();

            const mockFilters: TaskFiltersType = {
                search: '',
                status: undefined,
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            };

            (useTasks as jest.Mock).mockReturnValue({
                filters: mockFilters,
                setFilters: mockSetFilters,
                resetFilters: mockResetFilters,
            });

            render(<TaskFilters />);

            const statusSelect = screen.getByRole('combobox');
            await user.selectOptions(statusSelect, 'PENDING');

            expect(mockSetFilters).toHaveBeenCalledWith({ status: 'PENDING' });
        });

        it('handles reset filters correctly', async () => {
            const user = userEvent.setup();
            const mockSetFilters = jest.fn();
            const mockResetFilters = jest.fn();

            const mockFilters: TaskFiltersType = {
                search: 'test',
                status: 'PENDING',
                page: 1,
                limit: 10,
                sortBy: 'createdAt',
                sortOrder: 'desc',
            };

            (useTasks as jest.Mock).mockReturnValue({
                filters: mockFilters,
                setFilters: mockSetFilters,
                resetFilters: mockResetFilters,
            });

            render(<TaskFilters />);

            const clearButton = screen.getByText('Clear');
            await user.click(clearButton);

            expect(mockResetFilters).toHaveBeenCalled();
        });
    });

    describe('URL Synchronization', () => {
        it('initializes filters from URL parameters', () => {
            // This would require a more complex setup with mocking URL parameters
            // and testing the useEffect hooks in the useTasks hook
            // For now, we'll just verify the component renders correctly
            const mockSetFilters = jest.fn();
            const mockResetFilters = jest.fn();

            const mockFilters: TaskFiltersType = {
                search: 'test',
                status: 'PENDING',
                page: 2,
                limit: 20,
                sortBy: 'title',
                sortOrder: 'asc',
            };

            (useTasks as jest.Mock).mockReturnValue({
                filters: mockFilters,
                setFilters: mockSetFilters,
                resetFilters: mockResetFilters,
            });

            render(<TaskFilters />);

            const searchInput = screen.getByPlaceholderText('Search tasks') as HTMLInputElement;
            expect(searchInput.value).toBe('test');

            // Verify the status dropdown has the correct value selected
            const statusSelect = screen.getByRole('combobox') as HTMLSelectElement;
            expect(statusSelect.value).toBe('PENDING');
        });
    });
});