import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { useAuthStore, LoginCredentials, RegisterData, User } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useRouter } from 'next/navigation';

/**
 * Hook for authentication operations
 */
export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  
  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authStore.login(credentials),
    onSuccess: () => {
      uiStore.addToast({
        type: 'success',
        message: 'Login successful',
        duration: 3000,
      });
      
      // Invalidate any queries that might depend on authentication
      queryClient.invalidateQueries();
      
      // Redirect to dashboard
      router.push('/dashboard');
    },
    onError: (error: Error) => {
      uiStore.addToast({
        type: 'error',
        message: error.message || 'Login failed',
        duration: 5000,
      });
    },
  });
  
  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authStore.register(userData),
    onSuccess: () => {
      uiStore.addToast({
        type: 'success',
        message: 'Registration successful. Please log in.',
        duration: 3000,
      });
      
      // Redirect to login page
      router.push('/login');
    },
    onError: (error: Error) => {
      uiStore.addToast({
        type: 'error',
        message: error.message || 'Registration failed',
        duration: 5000,
      });
    },
  });
  
  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (userData: Partial<User>) => authStore.updateProfile(userData),
    onSuccess: () => {
      uiStore.addToast({
        type: 'success',
        message: 'Profile updated successfully',
        duration: 3000,
      });
    },
    onError: (error: Error) => {
      uiStore.addToast({
        type: 'error',
        message: error.message || 'Failed to update profile',
        duration: 5000,
      });
    },
  });
  
  // Logout function
  const logout = () => {
    authStore.logout();
    
    // Clear all queries from the cache
    queryClient.clear();
    
    uiStore.addToast({
      type: 'info',
      message: 'You have been logged out',
      duration: 3000,
    });
    
    // Redirect to login page
    router.push('/login');
  };
  
  return {
    // State
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading || 
               loginMutation.isPending || 
               registerMutation.isPending || 
               updateProfileMutation.isPending,
    error: authStore.error,
    
    // Actions
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    logout,
    clearError: authStore.clearError,
  };
};