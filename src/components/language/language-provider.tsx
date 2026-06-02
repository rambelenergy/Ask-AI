"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { Language, TranslationKey } from "@/lib/i18n/types";
import { DEFAULT_LANGUAGE, LANGUAGES } from "@/lib/i18n/types";
import { t as translate } from "@/lib/i18n/translations";

const STORAGE_KEY = "rambelenergy-lang";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  t: (key) => key,
  dir: "ltr",
});

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && LANGUAGES.some((l) => l.code === stored)) {
        setLanguageState(stored as Language);
      }
    } catch {
      // localStorage unavailable; use default
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // silent fail
    }
  }, []);

  // Update document direction and lang attribute
  useEffect(() => {
    const dir = LANGUAGES.find((l) => l.code === language)?.dir ?? "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const dir = LANGUAGES.find((l) => l.code === language)?.dir ?? "ltr";

  const value = {
    language,
    setLanguage,
    t: useCallback(
      (key: TranslationKey) => translate(language, key),
      [language]
    ),
    dir,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
