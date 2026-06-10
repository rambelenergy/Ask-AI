"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Loader2, Send, Sparkles, Search, RotateCcw, Maximize2, Minimize2, ChevronUp } from "lucide-react";
import { ChatMessage, hasArabic } from "./ChatMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { getAllSuggestedQuestions } from "@/lib/ai/suggested-questions";

const MAX_MESSAGE_LENGTH = 500;

interface Source {
  title: string;
  url: string;
  domain: string;
  priorityGroup: string;
  trusted: boolean;
  priority: number;
}

interface ErrorWithSuggestions {
  error: string;
  hint?: string;
  suggestions?: string[];
}

interface Message {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  sources?: Source[];
  suggestions?: string[];
}

export function AskEnergyChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [loadingText, setLoadingText] = useState("Searching trusted energy sources...");
  const [progressSteps, setProgressSteps] = useState<{ text: string; done: boolean; active: boolean }[]>([]);
  const [inputCollapsed, setInputCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const suggestedQuestions = getAllSuggestedQuestions();

  const inputEmpty = input.trim().length === 0;
  const inputOverLimit = input.trim().length > MAX_MESSAGE_LENGTH;
  const canSend = !inputEmpty && !inputOverLimit && !loading;
  const hasAnswers = messages.length > 0;

  // Scroll to bottom
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Auto-collapse input when answer appears (inline mode only — fullscreen keeps input open)
  useEffect(() => {
    if (hasAnswers && !loading && !streamingContent) {
      if (!isFullscreen) {
        setInputCollapsed(true);
      }
    }
  }, [hasAnswers, loading, streamingContent]);

  // Focus input when expanded (preventScroll so page doesn't jump on mount)
  useEffect(() => {
    if (!loading && !inputCollapsed && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [loading, inputCollapsed]);

  // Lock body scroll when fullscreen. Expand input on enter so user can type immediately.
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      setInputCollapsed(false);
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 100);
    } else {
      document.body.style.overflow = "";
      // Expand input on exit so search field is always visible in normal mode
      setInputCollapsed(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  const buildHistory = useCallback(
    (msgs: Message[]) =>
      msgs
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
    []
  );

  const handleSend = useCallback(
    async (text?: string) => {
      const message = (text ?? input).trim();
      if (!message || loading) return;

      setInput("");
      setInputCollapsed(false);
      setLoading(true);
      setStreamingContent("");
      setLoadingText("Searching trusted energy sources...");
      setProgressSteps([]);

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: message };
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);

      const history = buildHistory(messages);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/ask-energy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: message, history }),
          signal: controller.signal,
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type") ?? "";
          if (contentType.includes("text/event-stream") && response.body) {
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let fullContent = "";
            let streamedSources: Source[] | null = null;

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data: ")) continue;

                const payload = trimmed.slice(6);

                if (payload === "[DONE]") {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: crypto.randomUUID(),
                      role: "assistant",
                      content: fullContent,
                      sources: streamedSources ?? undefined,
                    },
                  ]);
                  setStreamingContent("");
                  setLoading(false);
                  return;
                }

                try {
                  const parsed = JSON.parse(payload);

                  if (parsed.p) {
                    if (parsed.p === "searching_trusted") {
                      setLoadingText("Searching trusted energy sources...");
                      setProgressSteps([{ text: "Searching trusted sources", done: false, active: true }]);
                    } else if (parsed.p === "trusted_not_found") {
                      setLoadingText("No data from trusted sources");
                      setProgressSteps((prev) => [
                        { text: "Searching trusted sources", done: true, active: false },
                        { text: "No data from trusted sources", done: true, active: false },
                      ]);
                    } else if (parsed.p === "searching_alternative") {
                      setLoadingText("Searching alternative sources...");
                      setProgressSteps((prev) => [
                        { text: "Searching trusted sources", done: true, active: false },
                        { text: "No data from trusted sources", done: true, active: false },
                        { text: "Searching alternative sources", done: false, active: true },
                      ]);
                    }
                  }

                  if (parsed.error) {
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: crypto.randomUUID(),
                        role: "error",
                        content: parsed.error,
                      },
                    ]);
                    setStreamingContent("");
                    setLoading(false);
                    setProgressSteps([]);
                    return;
                  }

                  if (parsed.c) {
                    fullContent += parsed.c;
                    setStreamingContent(fullContent);
                    setLoadingText("Generating answer...");
                    setProgressSteps((prev) => prev.map((s) => ({ ...s, active: false, done: true })));
                  }
                  if (parsed.sources) {
                    streamedSources = parsed.sources;
                  }
                } catch {
                  // skip
                }
              }
            }

            if (fullContent) {
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "assistant",
                  content: fullContent,
                  sources: streamedSources ?? undefined,
                },
              ]);
            }
            setStreamingContent("");
            setLoading(false);
            return;
          }

          try {
            const json: ErrorWithSuggestions = await response.json();
            if (json.error) {
              setMessages((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  role: "error",
                  content: json.error + (json.hint ? `\n\n${json.hint}` : ""),
                  suggestions: json.suggestions,
                },
              ]);
            }
          } catch {}
          setLoading(false);
          return;
        }

        if (!response.ok || !response.body) {
          let errorMsg = "AI service temporarily unavailable.";
          try {
            const err = await response.json();
            errorMsg = err.error ?? errorMsg;
          } catch {}
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "error", content: errorMsg },
          ]);
          setLoading(false);
          return;
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          if (streamingContent) {
            setMessages((prev) => [
              ...prev,
              { id: crypto.randomUUID(), role: "assistant", content: streamingContent },
            ]);
          }
          setStreamingContent("");
          setLoading(false);
          return;
        }
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "error",
            content: "Unable to reach AI service. Check your connection and try again.",
          },
        ]);
        setStreamingContent("");
        setLoading(false);
      }
    },
    [input, messages, loading, buildHistory, streamingContent]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggested = (q: string) => {
    handleSend(q);
  };

  const handleReset = () => {
    if (loading) abortRef.current?.abort();
    setMessages([]);
    setStreamingContent("");
    setLoading(false);
    setInput("");
    setInputCollapsed(false);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
  };

  const expandInput = () => {
    setInputCollapsed(false);
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 0);
  };

  // ── SHARED RENDER PARTS ──

  const headerBar = (
    <div className="flex items-center justify-between border-b border-white/10 bg-[var(--navy)] px-4 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--gold)]">
          <Search size={13} className="text-white" />
        </div>
        <div>
          <h3 className="text-xs font-bold leading-tight text-white">Ask Energy</h3>
          <p className="text-[10px] text-white/40">Trusted Source Search</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {hasAnswers && (
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            title="New search"
            aria-label="New search"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">New</span>
          </button>
        )}
        {/* Fullscreen toggle — prominent exit button when fullscreen */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className={
            isFullscreen
              ? "flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-white/20"
              : "flex h-7 w-7 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
          }
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <>
              <Minimize2 size={13} />
              <span>Exit</span>
            </>
          ) : (
            <Maximize2 size={14} />
          )}
        </button>
      </div>
    </div>
  );

  const messagesArea = (
    <div
      ref={messagesContainerRef}
      className={isFullscreen ? "flex-1 overflow-y-auto px-4 py-4" : "overflow-y-auto px-3 sm:px-4 py-3 sm:py-4"}
      style={{
        minHeight: messages.length === 0 ? "200px" : undefined,
        maxHeight: isFullscreen ? undefined : (messages.length > 0 ? "calc(100dvh - 380px)" : "none"),
        background: "url('/sahara-energy.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10">
        {messages.length === 0 && !loading && (
          <div className="flex min-h-[180px] sm:min-h-[240px] flex-col items-center justify-center text-center">
            <div className="rounded-2xl bg-[#0a1628]/80 px-6 py-8 backdrop-blur">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                <Search size={20} className="text-[var(--gold)]" />
              </div>
              <p className="text-sm font-semibold text-white">Ask Energy</p>
              <p className="mt-1 max-w-[280px] text-[11px] leading-5 text-white/70">
                Ask questions about Algeria–Europe energy relations, energy security, renewables, green hydrogen, and related topics.
              </p>
              <p className="mt-2 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--gold)]">
                Experimental · Trusted Source Search
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            sources={msg.sources}
            suggestions={msg.suggestions}
          />
        ))}

        {/* Streaming bubble */}
        {streamingContent && (() => {
          const isArabic = hasArabic(streamingContent);
          return (
            <div className="mb-4 flex justify-start">
              <div className={`max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/95 px-3.5 py-2.5 text-sm leading-relaxed text-[var(--navy)] shadow-sm backdrop-blur overflow-hidden break-words ${isArabic ? "text-right" : "text-left"}`} dir={isArabic ? "rtl" : "ltr"}>
                <div className="mb-1 flex items-center gap-1.5">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)]/20">
                    <Sparkles size={9} className="text-[var(--gold)]" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Ask Energy</span>
                </div>
                <p className="whitespace-pre-wrap">{streamingContent}</p>
                <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-[var(--green)] align-text-bottom" />
              </div>
            </div>
          );
        })()}

        {/* Loading indicator */}
        {loading && !streamingContent && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
              <div className="mb-2 flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)]/20">
                  <Search size={9} className="text-[var(--gold)]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">Ask Energy</span>
              </div>
              {progressSteps.length > 0 ? (
                <div className="space-y-1.5">
                  {progressSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {step.done ? (
                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[var(--green)] text-white">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                      ) : step.active ? (
                        <Loader2 size={12} className="animate-spin text-[var(--gold)]" />
                      ) : (
                        <span className="block h-3.5 w-3.5 rounded-full border border-[var(--line)]" />
                      )}
                      <span className={step.done ? "text-[var(--muted)]" : step.active ? "text-[var(--navy)] font-medium" : "text-[var(--muted-soft)]"}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                  <Loader2 size={12} className="animate-spin" />
                  {loadingText}
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );

  const inputArea = (
    <div className="ask-energy-input border-t border-[var(--line)] bg-white">
      {inputCollapsed && hasAnswers && !loading ? (
        /* Collapsed: compact "Ask another" bar */
        <button
          onClick={expandInput}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-medium text-[var(--muted)] transition hover:bg-[var(--paper)] hover:text-[var(--green)]"
        >
          <Search size={13} />
          <span>Ask another question</span>
          <ChevronUp size={13} className="text-[var(--line)]" />
        </button>
      ) : (
        /* Expanded input */
        <div className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Algeria, Europe, energy..."
              disabled={loading}
              maxLength={MAX_MESSAGE_LENGTH}
              className="flex-1 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2.5 text-sm text-[var(--navy)] placeholder:text-[var(--muted)] focus:border-[var(--green)] focus:outline-none focus:ring-1 focus:ring-[var(--green)] disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!canSend}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white transition hover:bg-[#0e4b40] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send"
            >
              {loading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Send size={14} className="ml-0.5" />
              )}
            </button>
          </div>
          {hasAnswers && !loading && (
            <button
              onClick={() => setInputCollapsed(true)}
              className="mt-2 flex w-full items-center justify-center gap-1 text-[10px] text-[var(--muted-soft)] transition hover:text-[var(--muted)]"
            >
              <Minimize2 size={10} />
              <span>Collapse to focus on answer</span>
            </button>
          )}
        </div>
      )}
    </div>
  );

  // ── Single render — toggles between inline and fullscreen via CSS ──
  // This preserves all React state (SummaryBox, scroll position, etc.)
  // across the fullscreen toggle because the component tree never unmounts.
  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-x-0 top-[72px] bottom-0 z-50 flex flex-col bg-white"
          : ""
      }
    >
      <div
        className={
          "flex flex-col bg-white" +
          (isFullscreen
            ? " h-full"
            : " overflow-hidden rounded-2xl border border-[var(--line)] shadow-sm"
          )
        }
      >
        {headerBar}
        {/* Wrapper for flex-1 in fullscreen; plain div in inline */}
        <div className={isFullscreen ? "min-h-0 flex-1" : undefined}>
          {messagesArea}
        </div>
        {messages.length === 0 && (
          <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSuggested} />
        )}
        {inputArea}
      </div>
    </div>
  );
}
