'use client';

import { LoginForm } from "@/components/features/auth";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-8">
        <h1 className="mb-4 text-2xl font-bold text-center">
          {t("auth.login")}
        </h1>
        <LoginForm />
      </Card>
    </div>
  );
}
