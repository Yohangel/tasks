"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks";
import Link from "next/link";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { t } = useTranslation();
  const { register: signup, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    signup(data);
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
      />
      <Input
        {...register("password")}
        type="password"
        placeholder={t("auth:password")}
        error={errors.password?.message}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? t("common:loading") : t("auth:register")}
      </Button>
      <div className="text-center text-sm">
        {t("auth:alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-semibold">
          {t("auth:login")}
        </Link>
      </div>
    </form>
  );
}
