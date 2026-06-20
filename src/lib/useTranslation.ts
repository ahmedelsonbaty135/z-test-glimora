"use client";

import { useShopStore } from "@/lib/store";
import { translate, type TranslationKey } from "@/lib/i18n";

/**
 * useTranslation — returns a `t` function bound to the current language.
 *
 * Usage:
 * const { t, lang } = useTranslation();
 * <p>{t("addToCart")}</p>
 * <p>{t("lowStock", { count: 5 })}</p>
 */
export function useTranslation() {
  const language = useShopStore((s) => s.language);

  const t = (key: TranslationKey, vars?: Record<string, string | number>) =>
    translate(language, key, vars);

  return { t, lang: language };
}
