'use client';

import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui/Button';
import { useEffect, useState } from 'react';

export interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useUIStore();
  const [mounted, setMounted] = useState(false);
  
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle language change
  const handleLanguageChange = () => {
    const newLanguage = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className={className}
        aria-label={t('common:toggleLanguage')} 
        disabled
      >
        <span className="opacity-0">EN</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className={className}
      aria-label={t('common:toggleLanguage')} 
      onClick={handleLanguageChange}
    >
      {language === 'en' ? 'EN' : 'ES'}
    </Button>
  );
}