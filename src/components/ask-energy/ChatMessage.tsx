import { Sparkles, ExternalLink, Copy, Check } from "lucide-react";
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
}

interface ChatMessageProps {
  role: "user" | "assistant" | "error";
  content: string;
  sources?: Source[];
  suggestions?: string[];
}

function SourceCards({ sources }: { sources: Source[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-[var(--line)] pt-3">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
        Trusted Sources
      </p>
      <div className="space-y-2">
        {sources.map((s, i) => (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2.5 rounded-lg border border-[var(--line)] px-3 py-2 text-xs transition hover:border-[var(--green)] hover:bg-[var(--surface)]"
          >
            <ExternalLink size={12} className="mt-0.5 shrink-0 text-[var(--muted)]" />
            <div className="min-w-0">
              <p className="truncate font-medium text-[var(--navy)]">{s.title}</p>
              <p className="mt-0.5 text-[var(--muted-soft)]">
                {s.domain} · {s.priorityGroup}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export function ChatMessage({ role, content, sources, suggestions }: ChatMessageProps) {
  if (role === "user") {
    return (
      <div className="mb-4 flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-br-md bg-[var(--navy)] px-4 py-3 text-sm leading-relaxed text-white">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  if (role === "error") {
    return (
      <div className="mb-4 flex justify-start">
        <div className="max-w-[82%] rounded-2xl rounded-bl-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
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

  return (
    <div className="mb-4 flex justify-start">
      <div className={`ask-energy-assistant max-w-[82%] rounded-2xl rounded-bl-md border border-[var(--line)] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--navy)] shadow-sm break-words ${isArabic ? "text-right" : "text-left"}`} dir={isArabic ? "rtl" : "ltr"}>
        <div className="mb-1.5 flex items-center gap-1.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--gold)]/20">
            <Sparkles size={10} className="text-[var(--gold)]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
            Ask Energy
          </span>
        </div>
        <p className="whitespace-pre-wrap">{content}</p>
        <SourceCards sources={sources ?? []} />
        {/* Bottom toolbar: copy + summarize */}
        <div className="mt-3 border-t border-[var(--line)] pt-3">
          <div className="min-w-0">
            <CopyButton content={content} />
            <div className="mt-2">
              <SummaryBox text={content} />
            </div>
          </div>
        </div>
      </div>
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
