"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Loader2, Send, Sparkles, Search } from "lucide-react";
import { ChatMessage, hasArabic } from "./ChatMessage";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { getAllSuggestedQuestions } from "@/lib/ai/suggested-questions";

const MAX_MESSAGE_LENGTH = 500;

interface Source {
  title: string;
  url: string;
  domain: string;
  priorityGroup: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const suggestedQuestions = getAllSuggestedQuestions();

  const inputEmpty = input.trim().length === 0;
  const inputOverLimit = input.trim().length > MAX_MESSAGE_LENGTH;
  const canSend = !inputEmpty && !inputOverLimit && !loading;

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, streamingContent]);

  useEffect(() => {
    if (!loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

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
      setLoading(true);
      setStreamingContent("");
      setLoadingText("Searching trusted energy sources...");

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

        // Handle no-results (200 with error field)
        if (response.ok) {
          const contentType = response.headers.get("content-type") ?? "";
          if (contentType.includes("text/event-stream") && response.body) {
            // Streaming path
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
                  if (parsed.c) {
                    fullContent += parsed.c;
                    setStreamingContent(fullContent);
                    setLoadingText("Generating answer...");
                  }
                  if (parsed.sources) {
                    streamedSources = parsed.sources;
                  }
                } catch {
                  // skip malformed
                }
              }
            }

            // Stream ended without [DONE]
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

          // Non-streaming responses (no-trusted-results or errors)
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
          } catch {
            // fallback
          }
          setLoading(false);
          return;
        }

        // Non-OK response
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

  return (
    <div className="ask-energy-chat overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      {/* Chat header — compact */}
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
      </div>

      {/* Messages area with Sahara background */}
      <div
        ref={messagesContainerRef}
        className="h-[340px] overflow-y-auto px-4 py-4"
        style={{
          background: "url('/sahara-energy.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Content */}
        <div className="relative z-10">
        {messages.length === 0 && !loading && (
          <div className="flex h-[300px] flex-col items-center justify-center text-center">
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

        {/* Streaming message bubble */}
        {streamingContent && (() => {
          const isArabic = hasArabic(streamingContent);
          return (
          <div className="mb-4 flex justify-start">
            <div className={`max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/95 px-3.5 py-2.5 text-sm leading-relaxed text-[var(--navy)] shadow-sm backdrop-blur ${isArabic ? "text-right" : "text-left"}`} dir={isArabic ? "rtl" : "ltr"}>
              <div className="mb-1 flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)]/20">
                  <Sparkles size={9} className="text-[var(--gold)]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                  Ask Energy
                </span>
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
              <div className="mb-1.5 flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--gold)]/20">
                  <Search size={9} className="text-[var(--gold)]" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--muted)]">
                  Ask Energy
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <Loader2 size={12} className="animate-spin" />
                {loadingText}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested questions */}
      {messages.length === 0 && (
        <SuggestedQuestions questions={suggestedQuestions} onSelect={handleSuggested} />
      )}

      {/* Input area — compact */}
      <div className="ask-energy-input border-t border-[var(--line)] bg-white px-3 py-2">
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
            className="flex-1 rounded-full border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-xs text-[var(--navy)] placeholder:text-[var(--muted)] focus:border-[var(--green)] focus:outline-none focus:ring-1 focus:ring-[var(--green)] disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!canSend}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--green)] text-white transition hover:bg-[#0e4b40] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Send size={13} className="ml-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
