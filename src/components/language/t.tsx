"use client";

import { useLanguage } from "@/components/language/language-provider";
import type { TranslationKey } from "@/lib/i18n/types";

/**
 * Thin client wrapper component for rendering translated text in server components.
 *
 * Usage in server components:
 *   <T k="home.hero.title" />
 *
 * Usage with fallback:
 *   <T k="home.hero.title" fallback="Default text" />
 */
export function T({
  k,
  fallback,
}: {
  k: TranslationKey;
  fallback?: string;
}) {
  const { t } = useLanguage();
  return <>{t(k) || fallback || k}</>;
}
