'use client';

import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-12">
      
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl font-bold mb-6">
          {t('common.welcomeMessage')}
        </h1>
        
        <Card className="p-6 mb-8 max-w-lg w-full">
          <p className="mb-4">
            {t('common.appDescription')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/login">
                {t('auth.login')}
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link href="/register">
                {t('auth.register')}
              </Link>
            </Button>
          </div>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">{t('features.organize.title')}</h2>
            <p>{t('features.organize.description')}</p>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">{t('features.track.title')}</h2>
            <p>{t('features.track.description')}</p>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">{t('features.collaborate.title')}</h2>
            <p>{t('features.collaborate.description')}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}