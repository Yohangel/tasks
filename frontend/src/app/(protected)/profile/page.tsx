"use client";

import { ProfileForm } from "@/components/features/auth/ProfileForm";
import { useAuth } from "@/hooks";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t("profile:title")}</h1>
      <Card className="p-6">
        <div className="mb-4">
          <p>
            <strong>{t("auth:name")}:</strong> {user?.name}
          </p>
          <p>
            <strong>{t("auth:email")}:</strong> {user?.email}
          </p>
          <p>
            <strong>{t("profile:createdAt")}:</strong>{" "}
            {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
        <ProfileForm />
      </Card>
    </div>
  );
}
