"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ImageOff,
  Clock,
} from "lucide-react";
import type { Article as ArticleType } from "@/types/article";

type ArticleCarouselProps = {
  articles: ArticleType[];
};

function fmtDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

const AUTOPLAY_MS = 10000;

export function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTickRef = useRef(Date.now());

  const goNext = useCallback(() => {
    setCurrent((c) => (c === articles.length - 1 ? 0 : c + 1));
    setProgress(0);
    lastTickRef.current = Date.now();
  }, [articles.length]);

  const goPrev = useCallback(() => {
    setCurrent((c) => (c === 0 ? articles.length - 1 : c - 1));
    setProgress(0);
    lastTickRef.current = Date.now();
  }, [articles.length]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setProgress(0);
    lastTickRef.current = Date.now();
  }, []);

  // Progress ticker — smooth every 100ms
  useEffect(() => {
    if (isPaused) return;
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 100 / (AUTOPLAY_MS / 100);
      });
    }, 100);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused, current]);

  // Auto-advance every AUTOPLAY_MS, respects pause
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c === articles.length - 1 ? 0 : c + 1));
      setProgress(0);
      lastTickRef.current = Date.now();
    }, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [articles.length, isPaused]);

  const total = articles.length;
  if (!total) return null;

  return (
    <div
      className="group/carousel relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setProgress(0);
        lastTickRef.current = Date.now();
      }}
    >
      {/* ── Main card ── */}
      <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper)] shadow-sm transition-shadow duration-500 group-hover/carousel:shadow-lg">
        {/* ── Animated progress bar ── */}
        <div className="absolute left-0 right-0 top-0 z-20 h-[3px] bg-[var(--line-soft)]">
          <div
            className="h-full bg-[var(--green)] transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Slide track ── */}
        <div
          className="flex transition-transform duration-600 ease-[cubic-bezier(0.22,0.61,0.36,1)]"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {articles.map((a) => {
            const hasImage = !!a.cover_image_url;
            const displayDate = fmtDate(a.published_at) || "Draft";

            return (
              <div
                key={a.id}
                className="grid h-auto w-full shrink-0 md:h-[440px] md:grid-cols-[1fr_1fr]"
              >
                {/* ═══ LEFT: Text content ═══ */}
                <div className="relative flex flex-col justify-start overflow-hidden px-5 py-6 sm:px-10 md:justify-center md:px-14 md:py-12">
                  {/* Subtle left accent line */}
                  <div className="absolute bottom-8 left-0 top-8 w-[3px] rounded-r-full bg-[var(--green-muted)]" />

                  {/* Meta row */}
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    {a.category && (
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--green)]/20 bg-[var(--green-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--green)]">
                        {a.category}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--muted-soft)]">
                      <Clock size={12} />
                      {displayDate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="line-clamp-3 text-balance text-[1.2rem] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--navy)] sm:text-[1.45rem] md:text-[1.75rem]">
                    <Link
                      href={`/analysis/${a.slug}`}
                      className="transition-colors duration-300 hover:text-[var(--green)]"
                    >
                      {a.title}
                    </Link>
                  </h3>

                  {/* Excerpt */}
                  {a.excerpt && (
                    <p className="mt-3 line-clamp-2 text-[13px] leading-[1.7] text-[var(--muted)] sm:text-[15px] sm:leading-[1.8] sm:line-clamp-3">
                      {a.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="mt-4 sm:mt-6">
                    <Link
                      href={`/analysis/${a.slug}`}
                      className="group/link inline-flex items-center gap-2 rounded-lg border border-[var(--green)]/20 bg-[var(--green-soft)] px-3 py-2 text-[12px] font-semibold text-[var(--green)] transition-all duration-300 hover:border-[var(--green)] hover:bg-[var(--green)] hover:text-white hover:shadow-md hover:shadow-[var(--green)]/20 sm:px-4 sm:py-2.5 sm:text-[13px]"
                    >
                      Read full analysis
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover/link:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>

                {/* ═══ RIGHT: Image ═══ */}
                <div className="relative order-first overflow-hidden md:order-last">
                  {hasImage ? (
                    <>
                      <img
                        src={a.cover_image_url!}
                        alt={a.title}
                        className="h-[220px] w-full object-cover md:h-full"
                        loading="lazy"
                        decoding="async"
                      />
                      {/* Gradient overlays */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--navy)]/70 via-[var(--navy)]/10 to-transparent md:bg-gradient-to-l md:from-[var(--navy)]/60 md:via-transparent md:to-transparent" />
                      {/* Bottom label on mobile / right label on desktop */}
                      <div className="absolute bottom-4 left-4 md:bottom-auto md:left-auto md:right-4 md:top-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                          {a.category || "Analysis"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[220px] w-full items-center justify-center bg-gradient-to-br from-[var(--navy-soft)] to-[var(--navy)] md:h-full">
                      <div className="flex flex-col items-center gap-3 text-white/25">
                        <ImageOff size={44} strokeWidth={1.5} />
                        <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-white/35">
                          No cover image
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Navigation arrows ── */}
        <button
          onClick={goPrev}
          aria-label="Previous article"
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--navy)] shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:border-[var(--green-muted)] hover:bg-[var(--surface)] hover:shadow-xl sm:left-4 sm:h-11 sm:w-11"
        >
          <ChevronLeft size={16} className="sm:size-[19px]" />
        </button>
        <button
          onClick={goNext}
          aria-label="Next article"
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--paper)] text-[var(--navy)] shadow-lg backdrop-blur transition-all duration-300 hover:scale-110 hover:border-[var(--green-muted)] hover:bg-[var(--surface)] hover:shadow-xl sm:right-4 sm:h-11 sm:w-11"
        >
          <ChevronRight size={16} className="sm:size-[19px]" />
        </button>
      </div>

      {/* ── Bottom bar: dots + counter ── */}
      <div className="mt-5 flex items-center justify-between">
        {/* Dots */}
        <div className="flex items-center gap-2">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to article ${i + 1}`}
              className={`rounded-full transition-all duration-400 ${
                i === current
                  ? "h-2.5 w-9 bg-[var(--green)]"
                  : "h-2.5 w-2.5 bg-[var(--line)] hover:bg-[var(--green-muted)]"
              }`}
            />
          ))}
        </div>

        {/* Counter */}
        <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--muted-soft)]">
          {String(current + 1).padStart(2, "0")}
          <span className="mx-1 text-[var(--line)]">/</span>
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
