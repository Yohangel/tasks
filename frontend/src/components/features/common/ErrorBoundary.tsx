'use client';

import { Button } from '@/components/ui/Button';
import { Component, ErrorInfo, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorBoundaryProps {
  /**
   * Content to render when there's no error
   */
  children: ReactNode;
  /**
   * Custom fallback component to render when an error occurs
   */
  fallback?: ReactNode;
  /**
   * Function to call when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /**
   * Whether to reset the error state when the children change
   */
  resetOnChange?: boolean;
  /**
   * Props to pass to the default fallback component
   */
  fallbackProps?: {
    title?: string;
    message?: string;
    actionLabel?: string;
  };
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component that catches JavaScript errors in its child component tree
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset the error state if the children change and resetOnChange is true
    if (
      this.state.hasError &&
      this.props.resetOnChange &&
      prevProps.children !== this.props.children
    ) {
      this.setState({ hasError: false, error: null });
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise use default fallback
      return (
        <ErrorFallback
          error={this.state.error!}
          resetErrorBoundary={this.resetErrorBoundary}
          {...this.props.fallbackProps}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
  message?: string;
  actionLabel?: string;
}

/**
 * Default fallback component for the ErrorBoundary
 */
export function ErrorFallback({
  error,
  resetErrorBoundary,
  title,
  message,
  actionLabel,
}: ErrorFallbackProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-error/20 bg-error/5 text-error">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error/10 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold mb-2">
        {title || t('common.error')}
      </h2>
      <p className="text-sm text-center mb-4">
        {message || error.message || t('common.error')}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          size="sm"
        >
          {t('common.retry')}
        </Button>
        <Button onClick={resetErrorBoundary} size="sm">
          {actionLabel || t('common.retry')}
        </Button>
      </div>
    </div>
  );
}

/**
 * Error message component for displaying API errors
 */
export function ErrorMessage({
  message,
  onRetry,
  className,
}: {
  message: string;
  onRetry?: () => void;
  className?: string;
}): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className={`rounded-md bg-error/5 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-error"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-error">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-auto pl-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRetry}
              className="text-error hover:bg-error/10"
            >
              {t('common.retry')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}