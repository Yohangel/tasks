'use client';

import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ThemeToggle } from '@/components/features/common/ThemeToggle';
import { LanguageSelector } from '@/components/features/common/LanguageSelector';

// Icons
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { t } = useTranslation();
  const { toggleSidebar } = useUIStore();

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900",
      className
    )}>
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            id="sidebar-toggle"
            aria-label={t('common.toggleSidebar')} 
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </Button>
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">TaskApp</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}