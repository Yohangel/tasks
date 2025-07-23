'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';

// Define card variants
const cardVariants = cva(
  'rounded-lg border shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        glass: 'glassmorphism',
        outline: 'bg-transparent border-border text-foreground',
        elevated: 'bg-card text-card-foreground border-border shadow-md hover:shadow-lg',
      },
      padding: {
        default: 'p-6',
        sm: 'p-4',
        lg: 'p-8',
        none: 'p-0',
      },
      hover: {
        true: 'hover:border-primary-500/50 hover:shadow-md',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
      hover: false,
      interactive: false,
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Whether the card is in a loading state
   */
  isLoading?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, hover, interactive, isLoading, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, hover, interactive, className }),
          isLoading && 'animate-pulse pointer-events-none'
        )}
        {...props}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
      />
    );
  }
);
Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add a border at the bottom of the header
   */
  withBorder?: boolean;
}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        withBorder && 'border-b border-border pb-4',
        className
      )}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add padding to the content
   */
  noPadding?: boolean;
}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, noPadding = false, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        noPadding ? 'px-0' : 'p-6 pt-0',
        className
      )} 
      {...props} 
    />
  )
);
CardContent.displayName = 'CardContent';

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether to add a border at the top of the footer
   */
  withBorder?: boolean;
}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withBorder = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-6 pt-0',
        withBorder && 'border-t border-border mt-4 pt-4',
        className
      )}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };