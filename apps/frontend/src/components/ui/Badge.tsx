'use client';

import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import { HTMLAttributes, ReactNode } from 'react';

// Define badge variants
const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary-500 text-primary-foreground',
        secondary: 'border-transparent bg-secondary-500 text-secondary-foreground',
        success: 'border-transparent bg-success text-white',
        warning: 'border-transparent bg-warning text-white',
        error: 'border-transparent bg-error text-white',
        info: 'border-transparent bg-info text-white',
        outline: 'text-foreground border-border',
        glass: 'glassmorphism text-foreground',
        subtle: 'bg-primary-100 text-primary-800 border-transparent dark:bg-primary-900 dark:text-primary-300',
      },
      size: {
        default: 'text-xs py-0.5 px-2.5',
        sm: 'text-xs py-0 px-2',
        lg: 'text-sm py-1 px-3',
        xl: 'text-sm py-1.5 px-4',
      },
      interactive: {
        true: 'cursor-pointer hover:opacity-80 active:opacity-70',
      },
      withDot: {
        true: 'pl-2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false,
      withDot: false,
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Optional icon to display before badge text
   */
  leftIcon?: ReactNode;
  /**
   * Optional icon to display after badge text
   */
  rightIcon?: ReactNode;
  /**
   * Optional dot color to display before badge text
   */
  dotColor?: string;
  /**
   * Whether the badge is removable
   */
  removable?: boolean;
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
}

function Badge({ 
  className, 
  variant, 
  size, 
  interactive,
  withDot,
  leftIcon,
  rightIcon,
  dotColor,
  removable,
  onRemove,
  children,
  ...props 
}: BadgeProps) {
  // Determine if we need to show a dot
  const showDot: boolean = (withDot || dotColor) ? true : false;
  
  return (
    <div 
      className={cn(
        badgeVariants({ 
          variant, 
          size, 
          interactive: interactive || removable, 
          withDot: showDot,
          className 
        })
      )} 
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {showDot && (
        <span 
          className={cn(
            "mr-1 h-2 w-2 rounded-full",
            dotColor ? undefined : "bg-current"
          )}
          style={dotColor ? { backgroundColor: dotColor } : undefined}
          aria-hidden="true"
        />
      )}
      
      {leftIcon && (
        <span className="mr-1 flex items-center" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      
      <span>{children}</span>
      
      {rightIcon && !removable && (
        <span className="ml-1 flex items-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
      
      {removable && (
        <button
          className="ml-1 -mr-1 h-3.5 w-3.5 rounded-full hover:bg-white/20 inline-flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          aria-label="Remove"
          type="button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="10" 
            height="10" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };