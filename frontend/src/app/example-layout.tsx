'use client';

import { Layout } from '@/components/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTranslation } from 'react-i18next';

export default function ExampleLayout() {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('common:dashboard')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('common:welcomeMessage')}
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">{t('common:tasks')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('common:tasksSummary')}
            </p>
            <Button>{t('common:viewTasks')}</Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">{t('common:profile')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('common:profileSummary')}
            </p>
            <Button variant="outline">{t('common:editProfile')}</Button>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">{t('common:settings')}</h2>
            <p className="text-muted-foreground mb-4">
              {t('common:settingsSummary')}
            </p>
            <Button variant="secondary">{t('common:manageSettings')}</Button>
          </Card>
        </div>
      </div>
    </Layout>
  );
}