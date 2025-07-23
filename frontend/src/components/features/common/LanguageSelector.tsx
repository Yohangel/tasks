"use client";

import { useTranslation } from "react-i18next";
import { useUIStore, type Language } from "@/store";
import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className }: LanguageSelectorProps) {
  const { t, i18n } = useTranslation();
  const { language, setLanguage } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as Language;
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  if (!mounted) {
    // Render a placeholder or null to avoid hydration mismatch
    return (
      <div
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 w-10",
          className
        )}
      />
    );
  }

  return (
    <div className={cn("relative", className)}>
      <select
        value={language}
        onChange={handleLanguageChange}
        aria-label={t("common:toggleLanguage")}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-full bg-transparent appearance-none text-center cursor-pointer"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
      </select>
    </div>
  );
}
