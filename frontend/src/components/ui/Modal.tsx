'use client';

import { Fragment, ReactNode, useEffect, useRef } from 'react';
import { cn } from '@/utils/cn';
import { AnimatePresence, motion } from 'framer-motion';

export interface ModalProps {
  /**
   * Controls whether the modal is displayed
   */
  isOpen: boolean;
  /**
   * Function to call when the modal should close
   */
  onClose: () => void;
  /**
   * Content to display inside the modal
   */
  children: ReactNode;
  /**
   * Optional title for the modal
   */
  title?: string;
  /**
   * Optional description text
   */
  description?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to show the close button
   */
  showCloseButton?: boolean;
  /**
   * Visual style variant
   */
  variant?: 'default' | 'glass' | 'borderless';
  /**
   * Size of the modal
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /**
   * Whether to center the modal vertically
   */
  centered?: boolean;
  /**
   * Whether clicking outside the modal should close it
   */
  closeOnClickOutside?: boolean;
  /**
   * Whether pressing escape should close the modal
   */
  closeOnEscape?: boolean;
  /**
   * Optional footer content
   */
  footer?: ReactNode;
  /**
   * Whether the modal has a border at the top of the footer
   */
  footerBorder?: boolean;
  /**
   * Whether the modal is in a loading state
   */
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  className,
  showCloseButton = true,
  variant = 'default',
  size = 'md',
  centered = true,
  closeOnClickOutside = true,
  closeOnEscape = true,
  footer,
  footerBorder = true,
  isLoading = false,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && closeOnEscape) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        isOpen &&
        closeOnClickOutside
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, closeOnClickOutside]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Determine modal width based on size
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-4rem)] md:max-w-[calc(100vw-6rem)] h-[calc(100vh-2rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          />

          {/* Modal */}
          <div 
            className={cn(
              "fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-8",
              centered && "items-center"
            )}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              aria-describedby={description ? 'modal-description' : undefined}
              className={cn(
                'w-full rounded-lg shadow-lg',
                sizeClasses[size],
                variant === 'default' ? 'bg-card text-card-foreground border border-border' : 
                variant === 'glass' ? 'glassmorphism' : 
                'bg-card text-card-foreground',
                isLoading && 'opacity-80 pointer-events-none',
                className
              )}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-4 sm:p-6">
                  {title && (
                    <div>
                      <h2
                        id="modal-title"
                        className="text-lg font-semibold leading-none tracking-tight"
                      >
                        {title}
                      </h2>
                      {description && (
                        <p
                          id="modal-description"
                          className="mt-1.5 text-sm text-muted-foreground"
                        >
                          {description}
                        </p>
                      )}
                    </div>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label="Close modal"
                      type="button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={cn(
                !title && !showCloseButton ? 'p-4 sm:p-6' : 'px-4 pb-6 sm:px-6',
                size === 'full' && 'overflow-y-auto max-h-[calc(100%-4rem)]'
              )}>
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg z-10">
                    <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary-500 border-t-transparent" />
                  </div>
                ) : null}
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className={cn(
                  "p-4 sm:p-6 pt-2 sm:pt-2",
                  footerBorder && "border-t border-border mt-2"
                )}>
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
}