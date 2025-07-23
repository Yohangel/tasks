/**
 * Environment configuration with type safety
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
} as const;