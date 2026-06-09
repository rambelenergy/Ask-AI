import { searchWithLangSearch, type LangSearchResult } from "@/lib/ask-energy/langsearch";
import { searchWithBrave } from "@/lib/ask-energy/brave-search";
import { expandEnergyQuery } from "@/lib/ask-energy/expand-query";
import { rerankByEmbedding } from "@/lib/ask-energy/embed";
import {
  isApprovedDomain,
  getPriorityGroupByUrl,
  getTrustedDomains,
} from "@/lib/ask-energy/trusted-sources";
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

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_LENGTH = 10;

interface AskEnergyRequest {
  question: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

interface TrustedSearchResult {
  title: string;
  url: string;
  domain: string;
  priority: number;
  priorityGroup: string;
  snippet?: string;
  summary?: string;
  trusted: boolean;
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
    console.log(`[AskEnergy] ${label}:`, preview);
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

// ── Relevance scoring & dedup (shared with search-trusted-sources) ──

const RELEVANCE_KEYWORDS = [
  "Algeria", "algeria", "Algérie", "algérie",
  "Europe", "europe", "European", "european",
  "Italy", "italy", "Italia", "italia",
  "Spain", "spain", "España", "españa",
  "France", "france",
  "MEDGAZ", "medgaz", "Medgaz",
  "NIGAL", "nigal",
  "TRANSMED", "transmed",
  "Sonatrach", "sonatrach", "SONATRACH",
  "ENI", "eni",
  "Naturgy", "naturgy",
  "gas", "Gas", "gaz", "Gaz",
  "natural gas", "Natural gas", "Natural Gas",
  "pipeline", "Pipeline", "gazoduc",
  "solar", "Solar", "solaire", "Solaire",
  "hydrogen", "Hydrogen", "hydrogène",
  "renewable", "Renewable",
  "energy security", "Energy security",
  "Sahara", "sahara",
  "cooperation", "Cooperation", "coopération",
  "partnership", "Partnership", "partenariat",
  "export", "Export",
];

function relevanceScore(result: TrustedSearchResult): number {
  const text = `${result.title} ${result.snippet ?? ""} ${result.summary ?? ""}`;
  let score = 0;
  for (const kw of RELEVANCE_KEYWORDS) {
    if (text.includes(kw)) score += 1;
  }
  return score;
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function deduplicateByUrl(results: TrustedSearchResult[]): TrustedSearchResult[] {
  const seen = new Map<string, TrustedSearchResult>();
  for (const r of results) {
    const key = r.url.toLowerCase();
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, r);
    } else {
      const currentHasSummary = !!(r.summary && r.summary.length > 50);
      const existingHasSummary = !!(existing.summary && existing.summary.length > 50);
      if (currentHasSummary && !existingHasSummary) {
        seen.set(key, r);
      } else if (!currentHasSummary && !existingHasSummary) {
        const curLen = r.snippet?.length ?? 0;
        const existLen = existing.snippet?.length ?? 0;
        if (curLen > existLen) seen.set(key, r);
      }
    }
  }
  return Array.from(seen.values());
}

function mapResults(
  rawResults: LangSearchResult[],
  isTrustedSearch: boolean
): TrustedSearchResult[] {
  return rawResults.map((r) => {
    const domain = extractDomain(r.url);
    const isApproved = isTrustedSearch || isApprovedDomain(r.url);
    const group = isApproved ? getPriorityGroupByUrl(r.url) : null;
    return {
      title: r.title,
      url: r.url,
      domain,
      priority: group?.priority ?? 99,
      priorityGroup: group?.name ?? "General Web Search",
      snippet: r.snippet,
      summary: r.summary,
      trusted: isApproved,
    };
  });
}

async function processAndRank(
  question: string,
  rawResults: LangSearchResult[],
  isTrustedSearch: boolean
): Promise<TrustedSearchResult[]> {
  const mapped = mapResults(rawResults, isTrustedSearch);
  const deduped = deduplicateByUrl(mapped);

  deduped.sort((a, b) => {
    if (a.trusted !== b.trusted) return a.trusted ? -1 : 1;
    const relA = relevanceScore(a);
    const relB = relevanceScore(b);
    if (relA !== relB) return relB - relA;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  const reranked = await rerankByEmbedding(question, deduped);
  return reranked.slice(0, 8);
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

  // --- Reject query that exceeds 400 characters (Brave API limit) ---
  const MAX_QUERY_LENGTH = 400;
  if (question.length > MAX_QUERY_LENGTH) {
    return Response.json(
      {
        error: getQueryTooLongMessage(language),
        language,
      },
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
  const expandedQueries = expandEnergyQuery(question, language);
  const searchQueries = expandedQueries.slice(0, 2);
  const trustedDomains = getTrustedDomains();

  const encoder = new TextEncoder();

  // ─── SSE Stream ───
  const stream = new ReadableStream({
    async start(controller) {
      const enqueue = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(sseEvent(data)));
      };

      // ─── Phase 1: Search trusted sources (Brave with site: filter) ───
      enqueue({ p: "searching_trusted" });

      let allRawResults: LangSearchResult[] = [];
      let fromTrustedSources = true;
      let searchError = false;

      // Phase 1: Brave with site filter
      for (const q of searchQueries) {
        try {
          const braveResults = await searchWithBrave(q, trustedDomains);
          if (braveResults.length > 0) {
            for (const r of braveResults) {
              allRawResults.push({
                title: r.title,
                url: r.url,
                snippet: r.snippet ?? r.description,
              });
            }
          }
        } catch (e) {
          debugLog("Brave search error", e);
          searchError = true;
        }
        // Got results, skip remaining queries
        if (allRawResults.length > 0) break;
      }

      // ─── Phase 2: Fallback to LangSearch (alternative sources) ───
      if (allRawResults.length === 0 && braveKey) {
        enqueue({ p: "trusted_not_found" });

        if (langsearchKey) {
          enqueue({ p: "searching_alternative" });

          for (const q of searchQueries) {
            try {
              const langResults = await searchWithLangSearch(q);
              for (const r of langResults) {
                allRawResults.push(r);
              }
              if (langResults.length > 0) break;
            } catch (e) {
              debugLog("LangSearch error", e);
              searchError = true;
            }
          }

          fromTrustedSources = false;
        }
      }

      // ─── No results from any source ───
      if (allRawResults.length === 0) {
        if (searchError) {
          enqueue({ error: getSearchUnavailableMessage(language) });
        } else {
          enqueue({ error: "No relevant information found for your question. Please try rephrasing or asking about a different energy topic." });
        }
        controller.close();
        return;
      }

      // ─── Process & rank results ───
      const searchResults = await processAndRank(question, allRawResults, fromTrustedSources);
      debugLog("final results", searchResults.length);

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
      const { system, user } = buildAskEnergyPrompt(question, searchResults, language);

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
            max_tokens: 1500,
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
