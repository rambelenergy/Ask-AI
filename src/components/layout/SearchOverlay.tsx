"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Search, X, Loader2, FileText, BookOpen } from "lucide-react";
import { useLanguage } from "@/components/language/language-provider";

interface SearchResult {
  id: string;
  type: "article" | "publication";
  title: string;
  excerpt: string;
  href: string;
}

export function SearchOverlay() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape + open on Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
        setResults([]);
      }
      // Ctrl+K / Cmd+K to open search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node) && open) {
        setOpen(false);
        setQuery("");
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setError(true);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  }

  function handleClose() {
    setOpen(false);
    setQuery("");
    setResults([]);
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        type="button"
        aria-label={t("nav.search")}
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted-soft)] transition-all hover:border-[var(--muted-soft)] hover:text-[var(--navy)]"
      >
        <Search size={16} />
      </button>

      {/* Search overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={handleClose}
          />

          {/* Search panel */}
          <div
            ref={containerRef}
            className="fixed inset-x-0 top-0 z-[70] mx-auto w-full max-w-[640px] px-4 pt-[15vh]"
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-2xl shadow-slate-300/40">
              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-[var(--line)] px-5 py-4">
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-[var(--green)]" />
                ) : (
                  <Search size={18} className="text-[var(--muted)]" />
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder={t("nav.search") + "..."}
                  className="flex-1 bg-transparent text-[15px] text-[var(--navy)] outline-none placeholder:text-[var(--muted)]"
                />
                <button
                  onClick={handleClose}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--muted)] transition-colors hover:bg-slate-100 hover:text-[var(--navy)]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[420px] overflow-y-auto">
                {error && (
                  <div className="px-5 py-8 text-center text-sm text-red-600">
                    Unable to search. Please try again.
                  </div>
                )}

                {!loading && !error && query.length >= 2 && results.length === 0 && (
                  <div className="px-5 py-10 text-center">
                    <Search size={24} className="mx-auto mb-3 text-[var(--line)]" />
                    <p className="text-sm text-[var(--muted)]">No results found for &ldquo;{query}&rdquo;</p>
                  </div>
                )}

                {!loading && !error && query.length < 2 && query.length > 0 && (
                  <div className="px-5 py-8 text-center text-sm text-[var(--muted)]">
                    Type at least 2 characters to search
                  </div>
                )}

                {!query && (
                  <div className="px-5 py-10 text-center">
                    <Search size={24} className="mx-auto mb-3 text-[var(--line)]" />
                    <p className="text-sm text-[var(--muted)]">Search articles and publications</p>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="py-2">
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={handleClose}
                        className="flex items-start gap-3.5 px-5 py-3.5 transition-colors hover:bg-[var(--surface)]"
                      >
                        <div className="mt-0.5 shrink-0">
                          {result.type === "article" ? (
                            <FileText size={16} className="text-[var(--green)]" />
                          ) : (
                            <BookOpen size={16} className="text-[var(--gold)]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold leading-snug text-[var(--navy)]">
                            {result.title}
                          </p>
                          {result.excerpt && (
                            <p className="mt-0.5 truncate text-[12px] text-[var(--muted)]">
                              {result.excerpt}
                            </p>
                          )}
                          <span className={`mt-1 inline-block text-[10px] font-semibold uppercase tracking-[0.08em] ${result.type === "article" ? "text-[var(--green)]" : "text-[var(--gold)]"}`}>
                            {result.type}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
