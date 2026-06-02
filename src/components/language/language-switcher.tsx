"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./language-provider";
import { LANGUAGES } from "@/lib/i18n/types";
import type { Language } from "@/lib/i18n/types";
import { Globe, Check, ChevronDown } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === language);

  function handleSelect(lang: Language) {
    setLanguage(lang);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[12px] font-medium text-[var(--navy)] transition-all hover:border-slate-300 hover:shadow-sm"
      >
        <Globe size={13} className="text-[var(--muted)]" />
        <span className="max-w-[60px] truncate">{current?.nativeLabel ?? "EN"}</span>
        <ChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-[var(--line)] bg-white py-1.5 shadow-lg shadow-slate-200/60">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleSelect(lang.code)}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] transition-colors ${
                lang.code === language
                  ? "bg-[var(--green-soft)] text-[var(--green)] font-semibold"
                  : "text-[var(--navy)] hover:bg-[var(--surface)]"
              }`}
            >
              <span className={lang.dir === "rtl" ? "text-right" : ""}>
                {lang.nativeLabel}
              </span>
              <span className="text-[11px] text-[var(--muted-soft)]">
                ({lang.label})
              </span>
              {lang.code === language && (
                <Check size={14} className="ml-auto text-[var(--green)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
