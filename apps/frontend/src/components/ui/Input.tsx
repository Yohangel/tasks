'use client';

import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Error message to display below the input
   */
  error?: string;
  /**
   * Label text for the input
   */
  label?: string;
  /**
   * Optional helper text to display below the input
   */
  helperText?: string;
  /**
   * Optional icon to display at the start of the input
   */
  leftIcon?: ReactNode;
  /**
   * Optional icon to display at the end of the input
   */
  rightIcon?: ReactNode;
  /**
   * Whether to use glassmorphism effect
   */
  glass?: boolean;
  /**
   * Whether the input is in a loading state
   */
  isLoading?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    error, 
    label, 
    helperText,
    leftIcon,
    rightIcon,
    glass = false,
    isLoading = false,
    type, 
    ...props 
  }, ref) => {
    const id = props.id || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className="w-full">
        {label && (
          <label
            className="block text-sm font-medium text-foreground mb-1"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            id={id}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              glass && 'glassmorphism border-transparent',
              error && 'border-error focus-visible:ring-error',
              isLoading && 'opacity-70',
              className
            )}
            ref={ref}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error 
                ? `${id}-error` 
                : helperText 
                  ? `${id}-helper` 
                  : undefined
            }
            disabled={isLoading || props.disabled}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
              {rightIcon}
            </div>
          )}
          
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg 
                className="animate-spin h-4 w-4 text-muted-foreground" 
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
            </div>
          )}
        </div>
        
        {error && (
          <p
            className="mt-1 text-sm text-error"
            id={`${id}-error`}
            role="alert"
          >
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p
            className="mt-1 text-sm text-muted-foreground"
            id={`${id}-helper`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };