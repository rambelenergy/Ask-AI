"use client";

import { useState, useCallback } from "react";
import { Loader2, Copy, Check, ListChecks } from "lucide-react";

interface SummaryBoxProps {
  text: string;
}

export function SummaryBox({ text }: SummaryBoxProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSummarize = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const response = await fetch("/api/ask-energy/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Summarization failed");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to summarize this response right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [text, loading]);

  const handleCopySummary = useCallback(async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [summary]);

  // Only show summarize button if text is long enough
  if (text.length < 600) return null;

  return (
    <div>
      {/* Summarize button */}
      {!summary && !loading && !error && (
        <button
          onClick={handleSummarize}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--navy)]"
        >
          <ListChecks size={12} />
          Summarize
        </button>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
          <Loader2 size={12} className="animate-spin" />
          Summarizing response...
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="space-y-2">
          <p className="text-[11px] text-red-500">{error}</p>
          <button
            onClick={handleSummarize}
            className="text-[11px] font-medium text-[var(--navy)] underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Summary result */}
      {summary && (
        <div className="rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3.5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ListChecks size={11} className="text-[var(--gold)]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                Short Summary
              </span>
              <span className="rounded-full bg-[var(--gold)]/10 px-1.5 py-0.5 text-[9px] text-[var(--gold)]">
                AI-generated
              </span>
            </div>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[var(--muted)] transition hover:bg-[var(--navy-light)] hover:text-[var(--navy)]"
              title="Copy summary"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-[var(--green)]" />
                  <span className="text-[var(--green)]">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={11} />
                  <span>Copy Summary</span>
                </>
              )}
            </button>
          </div>
          <div className="whitespace-pre-wrap break-words overflow-hidden text-[12px] leading-relaxed text-[var(--navy)]">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
