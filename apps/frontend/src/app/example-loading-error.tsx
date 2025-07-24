'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorBoundary, ErrorMessage } from '@/components/features/common/ErrorBoundary';
import { FullPageSpinner, LoadingOverlay, LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Component that will throw an error for testing ErrorBoundary
const ErrorComponent = () => {
  throw new Error('This is a test error');
  return null;
};

export default function ExampleLoadingError() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullPageLoader, setShowFullPageLoader] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  // Function to simulate loading
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Loading completed successfully!');
    }, 2000);
  };

  // Function to simulate full page loading
  const simulateFullPageLoading = () => {
    setShowFullPageLoader(true);
    setTimeout(() => {
      setShowFullPageLoader(false);
      toast.info('Full page loading completed!');
    }, 2000);
  };

  // Function to simulate overlay loading
  const simulateOverlayLoading = () => {
    setShowOverlay(true);
    setTimeout(() => {
      setShowOverlay(false);
      toast.info('Overlay loading completed!');
    }, 2000);
  };

  // Function to show different toast types
  const showToasts = () => {
    toast.success('This is a success message!');
    setTimeout(() => toast.error('This is an error message!'), 1000);
    setTimeout(() => toast.warning('This is a warning message!'), 2000);
    setTimeout(() => toast.info('This is an info message!'), 3000);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">{t('common.loading')} & {t('common.error')} Components</h1>

      {/* Loading Spinners Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Loading Spinners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Sizes</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <LoadingSpinner size="sm" />
                <span className="mt-2 text-sm">Small</span>
              </div>
              <div className="flex flex-col items-center">
                <LoadingSpinner size="md" />
                <span className="mt-2 text-sm">Medium</span>
              </div>
              <div className="flex flex-col items-center">
                <LoadingSpinner size="lg" />
                <span className="mt-2 text-sm">Large</span>
              </div>
              <div className="flex flex-col items-center">
                <LoadingSpinner size="xl" />
                <span className="mt-2 text-sm">Extra Large</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Colors</h3>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center">
                <LoadingSpinner color="primary" />
                <span className="mt-2 text-sm">Primary</span>
              </div>
              <div className="flex flex-col items-center">
                <LoadingSpinner color="secondary" />
                <span className="mt-2 text-sm">Secondary</span>
              </div>
              <div className="flex flex-col items-center">
                <LoadingSpinner color="white" className="bg-gray-800 p-2 rounded-full" />
                <span className="mt-2 text-sm">White</span>
              </div>
              <div className="flex flex-col items-center">
                <LoadingSpinner color="current" />
                <span className="mt-2 text-sm">Current</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">With Labels</h3>
          <div className="flex items-center gap-6">
            <LoadingSpinner showLabel label={t('common.loading')} />
            <LoadingSpinner showLabel glass />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Interactive Examples</h3>
          <div className="flex flex-wrap gap-4">
            <Button onClick={simulateLoading} isLoading={isLoading}>
              {isLoading ? t('common.loading') : 'Simulate Loading'}
            </Button>
            <Button onClick={simulateFullPageLoading} variant="secondary">
              Show Full Page Loader
            </Button>
            <Button onClick={simulateOverlayLoading} variant="outline">
              Show Loading Overlay
            </Button>
          </div>
        </div>
      </Card>

      {/* Error Handling Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Error Handling</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Error Boundary</h3>
            <ErrorBoundary
              fallbackProps={{
                title: 'Component Error',
                message: 'This component has crashed, but the rest of the app is still working.',
                actionLabel: 'Reset',
              }}
              resetOnChange={true}
            >
              {showError ? (
                <ErrorComponent />
              ) : (
                <Button onClick={() => setShowError(true)} variant="destructive">
                  Trigger Error
                </Button>
              )}
            </ErrorBoundary>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Error Message</h3>
            <ErrorMessage
              message="This is an example error message"
              onRetry={() => toast.info('Retry clicked')}
            />
          </div>
        </div>
      </Card>

      {/* Toast Notifications Section */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Toast Notifications</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Click the button below to see different types of toast notifications.
          </p>
          <div className="flex gap-4">
            <Button onClick={showToasts}>Show Toast Examples</Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.custom({
                  type: 'info',
                  message: 'This is a custom toast with an action button',
                  title: 'Custom Toast',
                  action: {
                    label: 'Action',
                    onClick: () => toast.info('Action clicked!'),
                  },
                })
              }
            >
              Custom Toast with Action
            </Button>
          </div>
        </div>
      </Card>

      {/* Show loading overlay conditionally */}
      <div className="relative">
        {showOverlay && <LoadingOverlay message="Loading content..." />}
      </div>

      {/* Show full page spinner conditionally */}
      {showFullPageLoader && <FullPageSpinner message="Loading page..." />}
    </div>
  );
}