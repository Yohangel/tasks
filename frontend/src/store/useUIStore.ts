import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { env } from '@/lib/env';

// Types
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es';

export interface UIState {
  theme: Theme;
  language: Language;
  sidebarOpen: boolean;
  toasts: Toast[];
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Create the store
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      language: env.defaultLocale as Language,
      sidebarOpen: false,
      toasts: [],
      
      setTheme: (theme) => set({ theme }),
      
      setLanguage: (language) => set({ language }),
      
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      setSidebarOpen: (open) => set({ 
        sidebarOpen: open 
      }),
      
      addToast: (toast) => set((state) => ({
        toasts: [
          ...state.toasts,
          { ...toast, id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}` }
        ]
      })),
      
      removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(toast => toast.id !== id)
      })),
      
      clearToasts: () => set({ toasts: [] }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        // Don't persist toasts or sidebar state
      }),
    }
  )
);