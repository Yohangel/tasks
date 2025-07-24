'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-6",
      className
    )}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Task Management App. {t('common.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}