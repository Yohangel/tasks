import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm, RegisterForm, AuthGuard } from '@/components/features/auth';
import { useAuth } from '@/hooks';

// Mock the hooks
jest.mock('@/hooks', () => ({
  useAuth: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth:email': 'Email',
        'auth:password': 'Password',
        'auth:name': 'Name',
        'auth:login': 'Login',
        'auth:register': 'Register',
        'auth:confirmPassword': 'Confirm Password',
        'auth:alreadyHaveAccount': 'Already have an account?',
        'auth:dontHaveAccount': 'Don\'t have an account?',
        'auth:loginHere': 'Login here',
        'auth:registerHere': 'Register here',
        'auth:loginTitle': 'Login to your account',
        'auth:registerTitle': 'Create an account',
        'common:loading': 'Loading',
        'common:error.required': 'This field is required',
        'common:error.email': 'Invalid email',
        'common:error.minLength': 'Must be at least {min} characters',
        'common:error.passwordMatch': 'Passwords must match',
      };
      
      if (key.startsWith('common:error.minLength')) {
        return 'Must be at least 8 characters';
      }
      
      return translations[key] || key;
    },
  }),
}));

describe('Authentication Flow Integration Tests', () => {
  describe('LoginForm Component', () => {
    it('renders login form correctly', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      render(<LoginForm />);
      
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
    });
    
    it('validates form inputs correctly', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.fn();
      
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: null,
      });
      
      render(<LoginForm />);
      
      // Submit without filling in fields
      await user.click(screen.getByText('Login'));
      
      // Check for validation errors - look for any error alert
      await waitFor(() => {
        expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
      });
      
      // Fill in invalid email
      await user.type(screen.getByPlaceholderText('Email'), 'invalid-email');
      await user.click(screen.getByText('Login'));
      
      // Check for email validation error
      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
      
      // Login should not have been called
      expect(mockLogin).not.toHaveBeenCalled();
    });
    
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockLogin = jest.fn();
      
      (useAuth as jest.Mock).mockReturnValue({
        login: mockLogin,
        isLoading: false,
        error: null,
      });
      
      render(<LoginForm />);
      
      // Fill in valid data
      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');
      await user.click(screen.getByText('Login'));
      
      // Login should have been called with correct data
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
    
    it('displays loading state', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: jest.fn(),
        isLoading: true,
        error: null,
      });
      
      render(<LoginForm />);
      
      // Look for loading text on button
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
    
    it('displays error message', () => {
      (useAuth as jest.Mock).mockReturnValue({
        login: jest.fn(),
        isLoading: false,
        error: 'Invalid credentials',
      });
      
      render(<LoginForm />);
      
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
  
  describe('RegisterForm Component', () => {
    it('renders register form correctly', () => {
      (useAuth as jest.Mock).mockReturnValue({
        register: jest.fn(),
        isLoading: false,
        error: null,
      });
      
      render(<RegisterForm />);
      
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
      expect(screen.getByText('Register')).toBeInTheDocument();
      expect(screen.getByText('Already have an account?')).toBeInTheDocument();
      expect(screen.getByText('Login')).toBeInTheDocument();
    });
    
    it('validates form inputs correctly', async () => {
      const user = userEvent.setup();
      const mockRegister = jest.fn();
      
      (useAuth as jest.Mock).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: null,
      });
      
      render(<RegisterForm />);
      
      // Submit without filling in fields
      await user.click(screen.getByText('Register'));
      
      // Check for validation errors
      await waitFor(() => {
        expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
      });
      
      // Fill in invalid email
      await user.type(screen.getByPlaceholderText('Email'), 'invalid-email');
      await user.click(screen.getByText('Register'));
      
      // Check for email validation error
      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
      
      // Register should not have been called
      expect(mockRegister).not.toHaveBeenCalled();
    });
    
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      const mockRegister = jest.fn();
      
      (useAuth as jest.Mock).mockReturnValue({
        register: mockRegister,
        isLoading: false,
        error: null,
      });
      
      render(<RegisterForm />);
      
      // Fill in valid data
      await user.type(screen.getByPlaceholderText('Name'), 'Test User');
      await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
      await user.type(screen.getByPlaceholderText('Password'), 'password123');
      await user.click(screen.getByText('Register'));
      
      // Register should have been called with correct data
      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });
  });
  
  describe('AuthGuard Component', () => {
    it('redirects unauthenticated users', () => {
      const mockRouter = { push: jest.fn() };
      
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });
      
      jest.spyOn(require('next/navigation'), 'useRouter').mockReturnValue(mockRouter);
      
      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );
      
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
    
    it('shows loading state', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });
      
      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );
      
      // Look for loading spinner with sr-only text
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });
    
    it('renders children for authenticated users', () => {
      (useAuth as jest.Mock).mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });
      
      render(
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      );
      
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});