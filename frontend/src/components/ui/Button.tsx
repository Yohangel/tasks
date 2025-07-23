'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all variants
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-primary-foreground hover:bg-primary-600',
        destructive: 'bg-error text-white hover:bg-red-700',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary-500 text-secondary-foreground hover:bg-secondary-600',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary-500 underline-offset-4 hover:underline',
        glass: 'glassmorphism text-foreground hover:bg-white/10 dark:hover:bg-white/5',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-2',
        iconSm: 'h-8 w-8 p-1.5',
        iconLg: 'h-12 w-12 p-2.5',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

// Extend button props with our variants
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * Shows a loading spinner and disables the button when true
   */
  isLoading?: boolean;
  /**
   * Optional icon to display before button text
   */
  leftIcon?: React.ReactNode;
  /**
   * Optional icon to display after button text
   */
  rightIcon?: React.ReactNode;
}

// Create the Button component with forwardRef to allow ref passing
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth, 
    isLoading, 
    leftIcon, 
    rightIcon,
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        aria-disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2" aria-hidden="true">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        ) : leftIcon ? (
          <span className="mr-2 flex items-center" aria-hidden="true">
            {leftIcon}
          </span>
        ) : null}
        {children}
        {rightIcon && !isLoading && (
          <span className="ml-2 flex items-center" aria-hidden="true">
            {rightIcon}
          </span>
        )}
        {isLoading && <span className="sr-only">Loading</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };