"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { t } = useTranslation();
  const { login, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        {...register("email")}
        type="email"
        placeholder={t("auth:email")}
        error={errors.email?.message}
      />
      <Input
        {...register("password")}
        type="password"
        placeholder={t("auth:password")}
        error={errors.password?.message}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? t("common:loading") : t("auth:login")}
      </Button>
      <div className="text-center text-sm">
        <Link href="/reset-password">{t("auth:forgotPassword")}</Link>
      </div>
      <div className="text-center text-sm">
        {t("auth:dontHaveAccount")}{" "}
        <Link href="/register" className="font-semibold">
          {t("auth:register")}
        </Link>
      </div>
    </form>
  );
}
