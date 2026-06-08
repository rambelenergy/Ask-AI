"use client";

import { useEffect } from "react";
import { useLanguage } from "./language-provider";

/** Updates <html lang> and dir attributes based on selected language */
export function HtmlAttributes() {
  const { language } = useLanguage();

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return null;
}
