/**
 * Environment configuration with type safety
 * This module provides a centralized, type-safe way to access environment variables
 * across different deployment environments (development, production, test)
 */

export const env = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 10000),
  
  // Feature Flags
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  
  // Internationalization
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'es',
  supportedLocales: (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'es,en').split(','),
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Performance and Optimization
  enablePrefetching: process.env.NEXT_PUBLIC_ENABLE_PREFETCHING !== 'false',
  
  // Deployment
  deploymentStage: process.env.NEXT_PUBLIC_DEPLOYMENT_STAGE || 'development',
  
  // Cache Control
  staticCacheMaxAge: Number(process.env.NEXT_PUBLIC_STATIC_CACHE_MAX_AGE || 31536000), // 1 year in seconds
  
  // Security
  enableCSP: process.env.NEXT_PUBLIC_ENABLE_CSP === 'true',
  
  // Debug
  debug: process.env.NEXT_PUBLIC_DEBUG === 'true',
  
  // Build Info
  buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'development',
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  
  // Helper functions
  isDeployment: (stage: string) => env.deploymentStage === stage,
} as const;