'use client';

import { env } from './env';

/**
 * Initialize accessibility testing in development mode
 * This function loads axe-core and runs accessibility checks
 */
export function initA11y(): void {
  // Only run in development or when debug is enabled
  if (typeof window === 'undefined' || (!env.isDevelopment && !env.debug)) {
    return;
  }
  
  // Dynamically import axe-core to avoid bundling in production
  import('axe-core').then(axe => {
    // Run axe after the page has loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        axe.default.run(document, {
          rules: {
            // Configure specific rules if needed
          }
        }).then(results => {
          if (results.violations.length > 0) {
            console.group('Accessibility issues found:');
            results.violations.forEach(violation => {
              console.warn(
                `${violation.impact} impact: ${violation.help} - ${violation.helpUrl}`,
                violation.nodes.map(node => node.target)
              );
            });
            console.groupEnd();
          } else {
            console.info('No accessibility issues detected.');
          }
        }).catch(error => {
          console.error('Error running accessibility checks:', error);
        });
      }, 1000); // Delay to ensure the page is fully rendered
    });
  }).catch(error => {
    console.error('Error loading axe-core:', error);
  });
}