/**
 * Web Vitals reporting module
 * This module collects and reports Core Web Vitals metrics
 * 
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): measures loading performance
 * - FID (First Input Delay): measures interactivity
 * - CLS (Cumulative Layout Shift): measures visual stability
 */

import { ReportHandler } from 'web-vitals';
import { env } from './env';

// Function to send metrics to analytics service
const sendToAnalytics = (metric: any) => {
  // Only send metrics in production
  if (!env.isProduction || !env.enableAnalytics) {
    return;
  }

  // Log metrics to console in development
  if (env.isDevelopment) {
    console.log('Web Vitals:', metric);
  }

  // Send metrics to analytics endpoint
  const analyticsUrl = `${env.apiUrl}/analytics/web-vitals`;
  
  // Use Navigator.sendBeacon() for better performance
  // This allows the data to be sent without blocking the page unload
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(metric)], { type: 'application/json' });
    navigator.sendBeacon(analyticsUrl, blob);
  } else {
    // Fallback to fetch API
    fetch(analyticsUrl, {
      method: 'POST',
      body: JSON.stringify(metric),
      headers: { 'Content-Type': 'application/json' },
      // Use keepalive to ensure the request completes even if the page unloads
      keepalive: true,
    }).catch(error => {
      console.error('Error sending web vitals:', error);
    });
  }
};

// Function to report web vitals
export function reportWebVitals(onPerfEntry?: ReportHandler): void {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      // Core Web Vitals
      onLCP(metric => {
        onPerfEntry(metric);
        sendToAnalytics({ name: 'LCP', value: metric.value, id: metric.id });
      });
      onFID(metric => {
        onPerfEntry(metric);
        sendToAnalytics({ name: 'FID', value: metric.value, id: metric.id });
      });
      onCLS(metric => {
        onPerfEntry(metric);
        sendToAnalytics({ name: 'CLS', value: metric.value, id: metric.id });
      });
      
      // Additional metrics
      onFCP(metric => {
        onPerfEntry(metric);
        sendToAnalytics({ name: 'FCP', value: metric.value, id: metric.id });
      });
      onTTFB(metric => {
        onPerfEntry(metric);
        sendToAnalytics({ name: 'TTFB', value: metric.value, id: metric.id });
      });
    });
  }
}

// Function to measure custom performance metrics
export function measurePerformance(name: string, startMark: string, endMark: string): void {
  if (!env.isProduction || typeof performance === 'undefined') {
    return;
  }
  
  try {
    // Create performance marks
    performance.mark(startMark);
    
    // Return a function to end the measurement
    return () => {
      performance.mark(endMark);
      performance.measure(name, startMark, endMark);
      
      // Get the measurement
      const entries = performance.getEntriesByName(name);
      const lastEntry = entries[entries.length - 1];
      
      // Send to analytics
      if (lastEntry) {
        sendToAnalytics({
          name: 'CustomMetric',
          metricName: name,
          value: lastEntry.duration,
          id: Date.now().toString(),
        });
      }
      
      // Clear marks and measures to avoid memory leaks
      performance.clearMarks(startMark);
      performance.clearMarks(endMark);
      performance.clearMeasures(name);
    };
  } catch (error) {
    console.error('Error measuring performance:', error);
    return () => {}; // Return empty function if measurement fails
  }
}