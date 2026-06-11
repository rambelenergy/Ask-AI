import { searchTrustedSources } from "@/lib/ask-energy/search-trusted-sources";
import { expandEnergyQuery } from "@/lib/ask-energy/expand-query";
import {
  buildAskEnergyPrompt,
  getSearchUnavailableMessage,
  getAiUnavailableMessage,
  getBroadQueryMessage,
  getQueryTooLongMessage,
} from "@/lib/ask-energy/build-answer-prompt";
import {
  detectQuestionLanguage,
  type SupportedLanguage,
} from "@/lib/ask-energy/detect-language";
import { getTrustedDomains } from "@/lib/ask-energy/trusted-sources";
import { fetchLivePrices } from "@/lib/ask-energy/fetch-live-prices";

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_LENGTH = 10;
const BRAVE_QUERY_CHAR_LIMIT = 400;

interface AskEnergyRequest {
  question: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

function sanitizeQuestion(input: string): string {
  return input.trim().slice(0, MAX_QUESTION_LENGTH);
}

function sanitizeHistory(
  history: { role: string; content: string }[] | undefined
): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (h) =>
        h &&
        (h.role === "user" || h.role === "assistant") &&
        typeof h.content === "string" &&
        h.content.trim().length > 0
    )
    .slice(-MAX_HISTORY_LENGTH)
    .map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content.trim().slice(0, 2000),
    }));
}

/** Development-only debug logging */
function debugLog(label: string, data: unknown) {
  if (process.env.NODE_ENV === "development") {
    const preview =
      typeof data === "string"
        ? data.slice(0, 200)
        : Array.isArray(data)
          ? `[Array(${data.length})]`
          : typeof data === "number"
            ? String(data)
            : typeof data === "object" && data !== null
              ? JSON.stringify(data).slice(0, 200)
              : String(data);
    console.log(`[AskEnergy] label:`, preview);
  }
}

/** Check if a question is too broad (short, no specific entity) */
function isTooBroad(question: string): boolean {
  const trimmed = question.trim();
  const words = trimmed.split(/\s+/);
  if (words.length <= 1) return true;
  if (words.length === 1 && !/[A-Z]{3,}/.test(trimmed)) return true;
  return false;
}

// ── SSE helpers ──

function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// ── Main route handler ──

export async function POST(request: Request): Promise<Response> {
  // --- Config checks ---
  const braveKey = process.env.BRAVESEARCH_API_KEY;
  const langsearchKey = process.env.LANGSEARCH_API_KEY;
  const aiApiKey = process.env.OPENAI_API_KEY;

  if (!braveKey && !langsearchKey) {
    return Response.json(
      { error: "Trusted source search is not configured yet." },
      { status: 500 }
    );
  }

  if (!aiApiKey) {
    return Response.json(
      { error: "AI provider is not configured yet." },
      { status: 500 }
    );
  }

  // --- Parse input ---
  let body: AskEnergyRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON in request body." }, { status: 400 });
  }

  const rawQuestion = typeof body.question === "string" ? body.question : "";
  const question = sanitizeQuestion(rawQuestion);

  if (!question) {
    return Response.json({ error: "Please provide a question." }, { status: 400 });
  }

  // --- Detect language ---
  const language: SupportedLanguage = await detectQuestionLanguage(question);
  debugLog("question", question);
  debugLog("language", language);

  // --- Reject query that exceeds Brave's 400-character limit ---
  if (question.length > BRAVE_QUERY_CHAR_LIMIT) {
    return Response.json(
      { error: getQueryTooLongMessage(language), language },
      { status: 200 }
    );
  }

  // --- Check for broad query ---
  if (isTooBroad(question)) {
    return Response.json(
      { error: getBroadQueryMessage(language), language },
      { status: 200 }
    );
  }

  const history = sanitizeHistory(body.history);
  const trustedDomains = getTrustedDomains();

  const encoder = new TextEncoder();

  // ─── SSE Stream ───
  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(data)));
      };

      // ─── Phase 1: Search trusted sources ───
      enqueue({ p: "searching_trusted" });

      let searchResult: Awaited<ReturnType<typeof searchTrustedSources>>;
      try {
        searchResult = await searchTrustedSources(question, language);
      } catch (e) {
        debugLog("search error", e);
        enqueue({ error: getSearchUnavailableMessage(language) });
        controller.close();
        return;
      }

      const { results: searchResults, fromTrustedSources, debug } = searchResult;
      debugLog("final results", searchResults.length);
      debugLog("from trusted sources", fromTrustedSources);
      debugLog("debug", debug);
      
      // Send debug info to frontend for diagnostics
      enqueue({ p: "debug", ...debug });

      // ─── Live-fetch dynamic price pages (eia.gov/prices, oilprice.com) ───
      // Search snippets are indexed snapshots — dynamic pages need live data
      const livePriceData = await fetchLivePrices(searchResults.map((r) => r.url));
      if (livePriceData.length > 0) {
        debugLog("live price pages fetched", livePriceData.length);
      }

      // ─── No results from any source ───
      if (searchResults.length === 0) {
        enqueue({ error: "No relevant information found for your question. Please try rephrasing or asking about a different energy topic." });
        controller.close();
        return;
      }

      // ─── Build sources for response ───
      const sources = searchResults.map((r) => ({
        title: r.title,
        url: r.url,
        domain: r.domain,
        priorityGroup: r.priorityGroup,
        trusted: r.trusted,
        priority: r.priority,
      }));

      // ─── Build prompt & call AI ───
      const { system, user } = buildAskEnergyPrompt(question, searchResults, language, livePriceData);

      const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
      const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

      const messages = [
        { role: "system" as const, content: system },
        ...history.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })),
        { role: "user" as const, content: user },
      ];

      const aiController = new AbortController();
      const timeoutId = setTimeout(() => aiController.abort(), 60_000);

      try {
        const upstream = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${aiApiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: 3500,
            temperature: 0.4,
            stream: true,
          }),
          signal: aiController.signal,
        });

        if (!upstream.ok || !upstream.body) {
          enqueue({ error: getAiUnavailableMessage(language), sources });
          controller.close();
          return;
        }

        const reader = upstream.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
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
                enqueue({ c: "", sources, fromTrustedSources });
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                reader.releaseLock();
                controller.close();
                return;
              }

              try {
                const parsed = JSON.parse(payload);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  enqueue({ c: content });
                }
              } catch {
                // skip malformed
              }
            }
          }

          // Stream ended without [DONE]
          enqueue({ c: "", sources, fromTrustedSources });
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          debugLog("stream error", e);
          controller.error(e);
        } finally {
          clearTimeout(timeoutId);
          reader.releaseLock();
        }
      } catch (error: unknown) {
        clearTimeout(timeoutId);
        if (error instanceof DOMException && error.name === "AbortError") {
          enqueue({ error: "Request timed out. The AI took too long to respond.", sources });
        } else {
          enqueue({ error: getAiUnavailableMessage(language), sources });
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(): Promise<Response> {
  return Response.json(
    { error: "Please use POST to send a question." },
    { status: 405 }
  );
}
