'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUIStore, Toast as ToastType } from '@/store/useUIStore';
import { cn } from '@/lib/utils';

// Context for toast provider
const ToastContext = createContext<{
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
}>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

// Hook to use toast context
export const useToast = () => useContext(ToastContext);

// Toast provider component
export function ToastProvider({ children }: { children: ReactNode }) {
  const { toasts, addToast, removeToast } = useUIStore();

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// Toast container component
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-md w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Individual toast component
function Toast({
  toast,
  onClose,
}: {
  toast: ToastType;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const animateInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 10);

    // Auto dismiss if duration is set
    let dismissTimeout: NodeJS.Timeout | undefined;
    if (toast.duration && toast.duration > 0) {
      dismissTimeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, toast.duration);
    }

    return () => {
      clearTimeout(animateInTimeout);
      if (dismissTimeout) clearTimeout(dismissTimeout);
    };
  }, [toast.duration, onClose]);

  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  // Determine toast styles based on type
  const toastStyles = {
    success: 'bg-success/10 border-success text-success',
    error: 'bg-error/10 border-error text-error',
    warning: 'bg-warning/10 border-warning text-warning',
    info: 'bg-info/10 border-info text-info',
  };

  return (
    <div
      className={cn(
        'transform transition-all duration-300 ease-in-out',
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0'
      )}
    >
      <div
        className={cn(
          'rounded-lg border p-4 shadow-md',
          toastStyles[toast.type]
        )}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">{toast.message}</div>
          <button
            onClick={handleClose}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-black/10"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}