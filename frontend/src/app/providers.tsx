'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect, ReactNode } from 'react';
import { useUIStore, useAuthStore } from '@/store';
import { ThemeProvider } from 'next-themes';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/features/common';
import { ApiError, NetworkMonitor } from '@/api/client';
import { env } from '@/lib/env';

// Import i18n configuration
import '@/i18n/config';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create a client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: (failureCount, error) => {
          // Don't retry on 401, 403, 404
          if (error instanceof ApiError) {
            if ([401, 403, 404].includes(error.status)) {
              return false;
            }
          }
          return failureCount < 2; // Retry up to 2 times for other errors
        },
        refetchOnWindowFocus: env.isDevelopment ? false : true,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: false,
        onError: (error) => {
          // Global error handling for mutations
          if (error instanceof ApiError) {
            const uiStore = useUIStore.getState();
            uiStore.addToast({
              type: 'error',
              message: error.getUserFriendlyMessage(),
              duration: 5000,
            });
          }
        },
      },
    },
  }));

  // Get theme from store
  const { theme } = useUIStore();

  // Initialize auth state on mount
  useEffect(() => {
    const authStore = useAuthStore.getState();
    if (authStore.token) {
      authStore.initializeAuth();
    }
  }, []);

  // Handle theme class
  useEffect(() => {
    // Apply dark mode class based on theme setting
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  // Handle network status changes
  useEffect(() => {
    const networkMonitor = NetworkMonitor.getInstance();
    const uiStore = useUIStore.getState();

    const unsubscribe = networkMonitor.addListener((online) => {
      if (online) {
        uiStore.addToast({
          type: 'success',
          message: 'You are back online',
          duration: 3000,
        });

        // Refetch any stale queries when coming back online
        queryClient.refetchQueries();
      } else {
        uiStore.addToast({
          type: 'error',
          message: 'You are offline. Some features may be unavailable.',
          duration: 0, // No auto-dismiss
        });
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme={theme} enableSystem>
        <ToastProvider>
          <ErrorBoundary fallbackProps={{
            title: 'Application Error',
            message: 'Something went wrong. Please try refreshing the page.'
          }}>
            {children}
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
      {env.isDevelopment && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}