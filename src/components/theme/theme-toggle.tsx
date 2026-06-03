"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { Theme } from "./theme-provider";

export { type Theme };

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center rounded-full border border-[var(--line)] bg-[var(--paper)] p-0.5">
      {options.map(({ value, icon: Icon, label }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
              active
                ? "bg-[var(--green)] text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--navy)]"
            }`}
            title={label}
            aria-label={`${label} mode`}
          >
            <Icon size={13} />
          </button>
        );
      })}
    </div>
  );
}
