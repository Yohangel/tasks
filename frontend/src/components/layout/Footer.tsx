'use client';

import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import Link from 'next/link';

export interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6",
      className
    )}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} TaskApp. {t('common:allRightsReserved')}
          </p>
        </div>
        
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link 
            href="/privacy" 
            className="hover:text-foreground transition-colors"
          >
            {t('common:privacy')}
          </Link>
          <Link 
            href="/terms" 
            className="hover:text-foreground transition-colors"
          >
            {t('common:terms')}
          </Link>
          <Link 
            href="/help" 
            className="hover:text-foreground transition-colors"
          >
            {t('common:help')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}