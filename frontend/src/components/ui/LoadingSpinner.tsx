'use client';

import { cn } from '@/utils/cn';
import { HTMLAttributes } from 'react';

interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the spinner
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Color of the spinner
   */
  color?: 'primary' | 'secondary' | 'white' | 'current';
  /**
   * Whether to show a label
   */
  showLabel?: boolean;
  /**
   * Custom label text (uses i18n "common.loading" by default)
   */
  label?: string;
  /**
   * Whether to center the spinner in its container
   */
  centered?: boolean;
  /**
   * Whether to use glassmorphism effect
   */
  glass?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  centered = false,
  glass = false,
  className,
  ...props
}: LoadingSpinnerProps) {
  // Size mappings
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
    xl: 'h-16 w-16 border-4',
  };

  // Color mappings
  const colorClasses = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        centered && 'absolute inset-0',
        glass && 'glassmorphism p-4 rounded-lg',
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div
        className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {showLabel && (
        <span className="mt-2 text-sm text-muted-foreground">
          {label || 'Loading...'}
        </span>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function FullPageSpinner({
  message,
  glass = true,
}: {
  message?: string;
  glass?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className={cn(
          'flex flex-col items-center justify-center p-6 rounded-lg',
          glass && 'glassmorphism'
        )}
      >
        <LoadingSpinner size="lg" showLabel={!!message} label={message} />
      </div>
    </div>
  );
}

export function LoadingOverlay({
  message,
  glass = true,
}: {
  message?: string;
  glass?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 rounded-lg">
      <div
        className={cn(
          'flex flex-col items-center justify-center p-4',
          glass && 'glassmorphism rounded-lg'
        )}
      >
        <LoadingSpinner size="md" showLabel={!!message} label={message} />
      </div>
    </div>
  );
}