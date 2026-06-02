"use client";

import { useState, useCallback } from "react";
import { Sparkles, Copy, Check, Loader2, Trash2, AlertTriangle } from "lucide-react";
import type { AiResponse } from "@/types/ai";

const MAX_CONTENT_LENGTH = 50_000;

export function AiSummarizerPanel() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CONTENT_LENGTH;
  const isEmpty = text.trim().length === 0;

  const handleClear = useCallback(() => {
    setText("");
    setResult(null);
    setError(null);
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard.");
    }
  }, [result]);

  const handleGenerate = useCallback(async () => {
    setError(null);
    setResult(null);

    if (isEmpty) { setError("Please enter content to summarize."); return; }
    if (isOverLimit) { setError(`Content exceeds maximum length of ${MAX_CONTENT_LENGTH.toLocaleString()} characters.`); return; }

    setLoading(true);
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "summarize", content: text.trim() }),
      });
      const data: AiResponse = await response.json();
      if (!data.success) { setError(data.error ?? "AI service returned an error."); return; }
      setResult(data.result ?? null);
    } catch { setError("Unable to reach AI service. Check your connection and try again.");
    } finally { setLoading(false); }
  }, [text, isEmpty, isOverLimit]);

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-[15px] font-bold text-[#07152a]">AI Content Summarization</h2>
          <p className="mt-0.5 text-[12px] text-slate-500">Generate summaries from article text or research notes</p>
        </div>
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#f4efe6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#94651f]">
          <AlertTriangle size={11} />
          Prototype
        </span>
      </div>

      <div className="p-4 sm:p-6">
        {/* Input */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">Input Text</span>
          <span className={`text-[11px] ${isOverLimit ? "font-semibold text-red-600" : "text-slate-400"}`}>
            {charCount.toLocaleString()} / {MAX_CONTENT_LENGTH.toLocaleString()}
          </span>
        </div>

        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); if (error) setError(null); }}
          placeholder="Paste article text, research notes, or any content you want summarized..."
          rows={10}
          className={`cms-input w-full resize-y rounded-lg border bg-[#f8faf9] px-4 py-3 text-[14px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none ${isOverLimit ? "border-red-300" : "border-slate-200"}`}
        />

        {isOverLimit && (
          <p className="mt-2 text-[12px] text-red-600">Content exceeds the {MAX_CONTENT_LENGTH.toLocaleString()}-character limit.</p>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading || isEmpty || isOverLimit}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--green)] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {loading ? "Generating..." : "Generate Summary"}
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={15} /> Clear
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && !error && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-800">Generated Summary</h3>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-700 transition hover:text-emerald-900"
              >
                {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <p className="text-[14px] leading-relaxed text-slate-700">{result}</p>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="border-t border-slate-100 bg-[#f8faf9] px-4 py-3 sm:px-6">
        <p className="text-[11px] leading-5 text-slate-400">
          AI-generated summaries must be reviewed and approved before being used as published content.
        </p>
      </div>
    </section>
  );
}
