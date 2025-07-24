'use client';

import { cn } from '@/utils/cn';
import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Predefined skeleton variants
   */
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button' | 'input' | 'badge';
  /**
   * Whether to use glassmorphism effect
   */
  glass?: boolean;
  /**
   * Whether to show a shimmer effect
   */
  shimmer?: boolean;
}

export function Skeleton({
  className,
  variant = 'default',
  glass = false,
  shimmer = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        'rounded-md',
        shimmer ? 'animate-pulse' : '',
        glass ? 'bg-white/10 dark:bg-black/10 backdrop-blur-sm' : 'bg-muted',
        {
          'h-4 w-full': variant === 'text',
          'h-12 w-12 rounded-full': variant === 'avatar',
          'h-10 w-24': variant === 'button',
          'h-48 w-full': variant === 'card',
          'h-10 w-full': variant === 'input',
          'h-6 w-16 rounded-full': variant === 'badge',
        },
        className
      )}
      {...props}
      aria-hidden="true"
      role="status"
      aria-label="Loading"
    />
  );
}

// Specialized skeleton components for common use cases
export function SkeletonText({
  className,
  width = 'full',
  ...props
}: HTMLAttributes<HTMLDivElement> & { width?: 'full' | '1/2' | '1/3' | '2/3' | '3/4' }) {
  const widthClass = width === 'full' ? 'w-full' : `w-${width}`;
  return <Skeleton variant="text" className={cn('my-1.5', widthClass, className)} {...props} />;
}

export function SkeletonButton({
  className,
  size = 'default',
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClass = {
    sm: 'h-8 w-20',
    default: 'h-10 w-24',
    lg: 'h-12 w-32',
  };

  return <Skeleton className={cn('my-2', sizeClass[size], className)} {...props} />;
}

export function SkeletonAvatar({
  className,
  size = 'default',
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClass = {
    sm: 'h-8 w-8',
    default: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return <Skeleton className={cn('rounded-full', sizeClass[size], className)} {...props} />;
}

export function SkeletonBadge({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="badge" className={cn(className)} {...props} />;
}

export function SkeletonInput({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <Skeleton variant="input" className={cn(className)} {...props} />;
}

export function SkeletonCard({
  className,
  rows = 3,
  ...props
}: HTMLAttributes<HTMLDivElement> & { rows?: number }) {
  return (
    <div
      className={cn('space-y-3 rounded-lg border p-4', className)}
      {...props}
      aria-hidden="true"
    >
      <Skeleton className="h-4 w-1/2" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={`h-4 w-${i % 2 === 0 ? 'full' : '3/4'}`} />
      ))}
      <div className="flex justify-between pt-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
  showHeader = true,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}) {
  return (
    <div
      className={cn('w-full space-y-3', className)}
      {...props}
      aria-hidden="true"
    >
      {showHeader && (
        <div className="flex w-full gap-3 pb-2">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={`header-${i}`} className={`h-6 ${i === 0 ? 'w-1/4' : 'flex-1'}`} />
          ))}
        </div>
      )}

      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex w-full gap-3 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${colIndex}`}
              className={`h-4 ${colIndex === 0 ? 'w-1/4' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}