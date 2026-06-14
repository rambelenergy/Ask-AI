import { Sparkles, ExternalLink, Copy, Check, AlertTriangle } from "lucide-react";
import { useState, useCallback } from "react";
import { SummaryBox } from "./SummaryBox";

/** Detect if text contains Arabic script (Unicode property escape) */
export function hasArabic(text: string): boolean {
  return /\p{Script=Arabic}/u.test(text);
}

interface Source {
  title: string;
  url: string;
  domain: string;
  priorityGroup: string;
  trusted: boolean;
  priority: number;
}

interface ChatMessageProps {
  role: "user" | "assistant" | "error";
  content: string;
  sources?: Source[];
  suggestions?: string[];
  livePrices?: { source: string; url: string; date: string | undefined; prices: { label: string; value: string; change?: string }[] | undefined; fetchedAt: string }[];
}

/** Priority badge color */
function priorityBadge(priority: number): string {
  if (priority === 1) return "bg-green-100 text-green-800 border-green-200";
  if (priority === 2) return "bg-blue-100 text-blue-800 border-blue-200";
  if (priority === 3) return "bg-purple-100 text-purple-800 border-purple-200";
  if (priority === 4) return "bg-amber-100 text-amber-800 border-amber-200";
  return "bg-gray-100 text-gray-600 border-gray-200";
}

function SourceCards({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-5 border-t border-[var(--line)] pt-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
        Trusted Sources ({sources.length})
      </p>
      <div className="space-y-2">
        {sources.map((s, i) => {
          const untrusted = !s.trusted || s.priorityGroup === "General Web Search";
          return (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-xs transition hover:border-[var(--green)] hover:bg-[var(--surface)] active:scale-[0.98] ${
                untrusted
                  ? "border-amber-200 bg-amber-50/50"
                  : "border-[var(--line)]"
              }`}
            >
              {untrusted ? (
                <AlertTriangle size={13} className="mt-0.5 shrink-0 text-amber-500" />
              ) : (
                <ExternalLink size={13} className="mt-0.5 shrink-0 text-[var(--muted)]" />
              )}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 font-medium text-[var(--navy)] leading-snug">{s.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-[var(--muted-soft)]">{s.domain}</span>
                  <span className={`inline-block rounded-full border px-1.5 py-0.5 text-[9px] font-semibold ${priorityBadge(s.priority)}`}>
                    P{s.priority}
                  </span>
                  <span className="hidden sm:inline text-[var(--muted-soft)]">· {s.priorityGroup}</span>
                  {untrusted && (
                    <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700">
                      ⚠ Unverified
                    </span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function ChatMessage({ role, content, sources, suggestions, livePrices }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="mb-4 flex justify-end">
        <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-[var(--navy)] px-4 py-3 text-sm leading-relaxed text-white shadow-sm">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  if (role === "error") {
    return (
      <div className="mb-4 flex justify-start">
        <div className="w-full sm:max-w-[85%] rounded-2xl rounded-bl-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
          <div className="mb-1.5 flex items-center gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-600">
              Ask Energy
            </span>
          </div>
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          {suggestions && suggestions.length > 0 && (
            <div className="mt-3 border-t border-amber-200 pt-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-500">
                Try asking
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[11px] text-amber-800"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isArabic = hasArabic(content);
  const hasUntrustedSources = sources && sources.length > 0 && sources.some((s) => !s.trusted || s.priorityGroup === "General Web Search");

  return (
    <div className="mb-5 flex justify-start">
      <div className={`ask-energy-assistant w-full sm:max-w-[88%] md:max-w-[82%] rounded-2xl rounded-bl-md border border-[var(--line)] bg-white px-4 sm:px-5 py-4 text-sm leading-relaxed text-[var(--navy)] shadow-sm break-words ${isArabic ? "text-right" : "text-left"}`} dir={isArabic ? "rtl" : "ltr"}>
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)]/20">
            <Sparkles size={10} className="text-[var(--gold)]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
            Ask Energy
          </span>
        </div>
        {hasUntrustedSources && (
          <div className="mb-3 flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] leading-tight text-amber-700">
            <AlertTriangle size={12} className="shrink-0 text-amber-500" />
            <span>
              <strong>Untrusted Source.</strong> This answer draws from general web results that have not been verified against energy-authority sources.
            </span>
          </div>
        )}
        <div className="prose prose-sm max-w-none text-[var(--navy)]">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
        {livePrices && livePrices.length > 0 && (
          <PriceComparisonInline data={livePrices} />
        )}
        <SourceCards sources={sources ?? []} />
        {/* Bottom toolbar: copy + summarize */}
        <div className="mt-4 border-t border-[var(--line)] pt-3">
          <div className="flex flex-wrap items-center gap-3">
            <CopyButton content={content} />
          </div>
          <div className="mt-2">
            <SummaryBox text={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceComparisonInline({ data }: { data: ChatMessageProps["livePrices"] }) {
  if (!data || data.length === 0) return null;

  // Collect all unique price labels across sources
  const allLabels = new Map<string, { label: string; values: Map<string, { value: string; change?: string }> }>();
  for (const entry of data) {
    if (!entry.prices) continue;
    for (const p of entry.prices) {
      if (!allLabels.has(p.label)) {
        allLabels.set(p.label, { label: p.label, values: new Map() });
      }
      allLabels.get(p.label)!.values.set(entry.source, { value: p.value, change: p.change });
    }
  }

  if (allLabels.size === 0) return null;

  const sources = data.map(d => d.source);
  const priceEntries = Array.from(allLabels.values());

  return (
    <div className="mt-4 border-t border-[var(--line)] pt-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
        📊 Live Price Comparison
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="text-left py-1.5 pr-3 font-semibold text-[var(--muted)]">Commodity</th>
              {sources.map((src) => (
                <th key={src} className="text-right py-1.5 px-2 font-semibold text-[var(--muted)]">
                  {src}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {priceEntries.map((entry) => (
              <tr key={entry.label} className="border-b border-[var(--line)]/50">
                <td className="py-1.5 pr-3 font-medium text-[var(--navy)]">{entry.label}</td>
                {sources.map((src) => {
                  const v = entry.values.get(src);
                  if (!v) return <td key={src} className="text-right py-1.5 px-2 text-[var(--muted-soft)]">—</td>;
                  const isUp = v.change && !v.change.startsWith("-") && v.change !== "0%";
                  const isDown = v.change && v.change.startsWith("-");
                  return (
                    <td key={src} className="text-right py-1.5 px-2">
                      <span className="font-semibold text-[var(--navy)]">{v.value}</span>
                      {v.change && (
                        <span className={`ml-1 text-[9px] font-medium ${
                          isUp ? "text-[var(--green)]" : isDown ? "text-red-500" : "text-[var(--muted)]"
                        }`}>
                          {isUp ? "▲" : isDown ? "▼" : ""}{v.change}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[9px] text-[var(--muted-soft)]">
        Sources: {sources.map((s, i) => (
          <span key={s}>
            {i > 0 && " · "}
            <a href={data[i]?.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--green)]">
              {s === "EIA" ? "eia.gov" : s === "OilPrice" ? "oilprice.com" : s === "TradingEconomics" ? "tradingeconomics.com" : s}
            </a>
          </span>
        ))}
        {data[0]?.date && ` · ${data[0].date}`}
      </p>
    </div>
  );
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [content]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--navy)]"
      title="Copy response"
    >
      {copied ? (
        <>
          <Check size={14} className="text-[var(--green)]" />
          <span className="text-[var(--green)]">Copied</span>
        </>
      ) : (
        <>
          <Copy size={14} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}
