"use client";

import { useEffect } from "react";
import { useShopStore } from "@/lib/store";

/**
 * ThemeInitializer — applies saved theme + language on mount.
 * Prevents "flash of wrong theme" by applying attributes ASAP.
 */
export function ThemeInitializer() {
  const { theme, language } = useShopStore();

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", theme);
    // Apply language
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [theme, language]);

  return null;
}
