import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { env } from '@/lib/env';

/**
 * i18next configuration for internationalization
 */
i18n
  // Load translations from the /public/locales folder
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    // Default language
    fallbackLng: env.defaultLocale,
    // Debug mode in development
    debug: env.isDevelopment,
    // Supported languages
    supportedLngs: env.supportedLocales,
    // Namespace for translations
    defaultNS: 'common',
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // Detection options
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;