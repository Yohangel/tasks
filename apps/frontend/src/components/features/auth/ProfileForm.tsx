"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks";
import { useEffect } from "react";

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { t } = useTranslation();
  const { user, updateProfile, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        {...register("name")}
        type="text"
        placeholder={t("auth:name")}
        error={errors.name?.message}
      />
      <Input
        {...register("email")}
        type="email"
        placeholder={t("auth:email")}
        error={errors.email?.message}
        disabled
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? t("common:loading") : t("common:save")}
      </Button>
    </form>
  );
}
