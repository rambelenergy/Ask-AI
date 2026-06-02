"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { useState } from "react";
import type { NavItem } from "@/data/homepage";

type HeaderProps = {
  items: NavItem[];
  activeHref?: string;
};

export function Header({ items, activeHref = "/" }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--paper)]/95 backdrop-blur-sm">
      <div className="container-page flex h-[84px] items-center justify-between gap-6">
        <Link href="/" aria-label="RamBelEnergy home" className="shrink-0">
          <span className="block text-[1.35rem] font-bold tracking-[-0.03em] text-[var(--navy)]">RamBelEnergy</span>
          <span className="mt-1 block text-[0.63rem] font-semibold uppercase tracking-[0.2em] text-[var(--green)]">
            Energy intelligence
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {items.map((item) => {
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`border-b-2 py-2 text-sm font-medium transition ${
                  active
                    ? "border-[var(--green)] text-[var(--green)]"
                    : "border-transparent text-slate-700 hover:text-[var(--navy)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center lg:flex">
          <ButtonLink href="/analysis" className="rounded-sm px-5 py-3">
            Explore Analysis
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-[var(--line)] text-[var(--navy)] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`h-0.5 w-5 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-5 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile navigation" className="border-t border-[var(--line)] bg-[var(--paper)] px-4 py-5 lg:hidden">
          <div className="container-page flex flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-[var(--line)] py-4 text-sm font-semibold ${
                  item.href === activeHref ? "text-[var(--green)]" : "text-[var(--navy)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/analysis" className="mt-5 py-3">
              Explore Analysis
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
