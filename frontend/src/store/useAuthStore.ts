import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/api/client';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => void;
}

// Create the store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{ user: User; access_token: string }>('/auth/login', credentials);
          const { user, access_token } = response;
          
          // Set the token in the API client
          apiClient.setToken(access_token);
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to login',
          });
          throw error;
        }
      },
      
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/auth/register', userData);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to register',
          });
          throw error;
        }
      },
      
      logout: () => {
        // Clear the token from the API client
        apiClient.setToken(null);
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
      
      updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.put<User>('/users/profile', userData);
          set({
            user: response,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'Failed to update profile',
          });
          throw error;
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      initializeAuth: () => {
        set({ isLoading: true });
        try {
          // Check if the token is valid by making a request to get the current user
          apiClient.get<User>('/users/me')
            .then(user => {
              set({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            })
            .catch(() => {
              // If the request fails, clear the auth state
              apiClient.setToken(null);
              set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
              });
            });
        } catch (error) {
          // Handle any synchronous errors
          set({
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Error rehydrating auth store:', error);
          }
          
          if (rehydratedState?.token) {
            // Set the token in the API client on rehydration
            apiClient.setToken(rehydratedState.token);
          }
        };
      },
    }
  )
);