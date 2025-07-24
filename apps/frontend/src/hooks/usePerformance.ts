'use client';

import { useEffect, useRef } from 'react';
import { measurePerformance } from '@/lib/web-vitals';
import { env } from '@/lib/env';

/**
 * Hook to measure component performance
 * @param componentName Name of the component being measured
 * @param dependencies Array of dependencies to trigger remeasurement
 */
export function usePerformance(componentName: string, dependencies: any[] = []) {
  const endMeasurement = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    // Only measure in production or when debug is enabled
    if (!env.isProduction && !env.debug) {
      return;
    }
    
    // Start measurement
    const startMark = `${componentName}-start-${Date.now()}`;
    const endMark = `${componentName}-end-${Date.now()}`;
    
    endMeasurement.current = measurePerformance(
      `component-render-${componentName}`,
      startMark,
      endMark
    );
    
    // End measurement on cleanup
    return () => {
      if (endMeasurement.current) {
        endMeasurement.current();
      }
    };
  }, dependencies);
  
  // Return a function to manually end measurement
  return () => {
    if (endMeasurement.current) {
      endMeasurement.current();
      endMeasurement.current = null;
    }
  };
}