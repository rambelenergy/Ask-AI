"use client";

import { useEffect, useState } from "react";

const SLOGAN_PARTS = [
  "Connecting Algeria,",
  "Europe and Africa",
  "Through Energy",
] as const;

export function HomeSlogan() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-[var(--navy)]">
      {/* Decorative geometric background */}
      <div className="pointer-events-none absolute inset-0 select-none">
        {/* Concentric world-map hint — abstract circles */}
        <svg
          viewBox="0 0 1200 300"
          className="h-full w-full opacity-[0.04]"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <circle cx="600" cy="150" r="260" stroke="white" strokeWidth="0.8" />
          <circle cx="600" cy="150" r="200" stroke="white" strokeWidth="0.5" />
          <circle cx="600" cy="150" r="140" stroke="white" strokeWidth="0.4" />
          {/* Latitude lines */}
          <line x1="200" y1="150" x2="1000" y2="150" stroke="white" strokeWidth="0.3" />
          <line x1="300" y1="80" x2="900" y2="80" stroke="white" strokeWidth="0.25" />
          <line x1="300" y1="220" x2="900" y2="220" stroke="white" strokeWidth="0.25" />
          {/* Meridian */}
          <line x1="600" y1="20" x2="600" y2="280" stroke="white" strokeWidth="0.35" />
        </svg>
      </div>

      {/* Top gold accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />

      {/* Content */}
      <div className="container-page">
        <div
          className={`flex flex-col items-center py-16 text-center transition-all duration-1000 ease-[cubic-bezier(0.22,0.61,0.36,1)] sm:py-20 lg:py-24 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          {/* Left-right gold line with dot */}
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/40 sm:w-16" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/40 sm:w-16" />
          </div>

          {/* Slogan */}
          <p className="max-w-4xl text-balance font-serif text-[1.75rem] font-light leading-[1.35] tracking-[0.01em] text-white sm:text-[2.25rem] md:text-[2.8rem] lg:text-[3.25rem]">
            <span className="block">{SLOGAN_PARTS[0]}</span>
            <span className="block text-[var(--gold)]">{SLOGAN_PARTS[1]}</span>
            <span className="mt-1 block text-[1.15rem] font-normal uppercase tracking-[0.22em] text-white/50 sm:text-[1.05rem] md:text-[1.15rem]">
              {SLOGAN_PARTS[2]}
            </span>
          </p>

          {/* Bottom gold line with dot */}
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--gold)]/40 sm:w-16" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--gold)]/40 sm:w-16" />
          </div>
        </div>
      </div>

      {/* Bottom gold accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-[var(--gold)]/60 to-transparent" />
    </section>
  );
}
