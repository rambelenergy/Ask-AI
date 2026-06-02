import { searchTrustedSources } from "@/lib/ask-energy/search-trusted-sources";
import { buildAskEnergyPrompt } from "@/lib/ask-energy/build-answer-prompt";
import { detectQuestionLanguage, type SupportedLanguage } from "@/lib/ask-energy/detect-language";

const MAX_QUESTION_LENGTH = 500;
const MAX_HISTORY_LENGTH = 10;

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
    console.log(`[AskEnergy] ${label}:`, data);
  }
}

export async function POST(request: Request): Promise<Response> {
  // --- Config checks ---
  const langsearchKey = process.env.LANGSEARCH_API_KEY;
  const aiApiKey = process.env.OPENROUTER_API_KEY;

  if (!langsearchKey) {
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
    return Response.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  const rawQuestion = typeof body.question === "string" ? body.question : "";
  const question = sanitizeQuestion(rawQuestion);

  if (!question) {
    return Response.json(
      { error: "Please provide a question." },
      { status: 400 }
    );
  }

  // --- Detect language (async — uses liquid/lfm-2.5-1.2b-instruct:free via OpenRouter) ---
  const language: SupportedLanguage = await detectQuestionLanguage(question);

  // Dev logging
  debugLog("question", question);
  debugLog("language", language);

  const history = sanitizeHistory(body.history);

  // --- Step 1: Search trusted sources (with language for English search expansion) ---
  let searchResult: Awaited<ReturnType<typeof searchTrustedSources>>;
  try {
    searchResult = await searchTrustedSources(question, language);
  } catch (error) {
    debugLog("search error", error);
    return Response.json(
      { error: "Trusted source search is temporarily unavailable. Please try again later." },
      { status: 502 }
    );
  }

  const { results: searchResults, debug } = searchResult;
  debugLog("expanded queries", debug.expandedQueries);
  debugLog("trusted results count", debug.trustedFilteredCount);

  // --- No results ---
  if (searchResults.length === 0) {
    const { noResultsMessage } = buildAskEnergyPrompt(question, [], language);
    return Response.json(
      { error: noResultsMessage, language },
      { status: 200 }
    );
  }

  // --- Step 2: Build prompt ---
  const { system, user } = buildAskEnergyPrompt(question, searchResults, language);

  // --- Step 3: Map sources for response ---
  const sources = searchResults.map((r) => ({
    title: r.title,
    url: r.url,
    domain: r.domain,
    priorityGroup: r.priorityGroup,
  }));

  // --- Step 4: Call AI ---
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  const messages = [
    { role: "system" as const, content: system },
    ...history.map((h) => ({
      role: h.role as "user" | "assistant",
      content: h.content,
    })),
    { role: "user" as const, content: user },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60_000);

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "RamBelEnergy - Ask Energy",
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1500,
        temperature: 0.4,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      return Response.json(
        {
          error:
            "AI response generation is temporarily unavailable, but the search system is working.",
          sources,
        },
        { status: 502 }
      );
    }

    // --- Stream SSE ---
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(streamController) {
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
                streamController.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ c: "", sources })}\n\n`
                  )
                );
                streamController.enqueue(encoder.encode("data: [DONE]\n\n"));
                continue;
              }

              try {
                const parsed = JSON.parse(payload);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  streamController.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ c: content })}\n\n`)
                  );
                }
              } catch {
                // skip malformed SSE lines
              }
            }
          }
          streamController.close();
        } catch (e) {
          streamController.error(e);
        } finally {
          clearTimeout(timeoutId);
          reader.releaseLock();
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
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof DOMException && error.name === "AbortError") {
      return Response.json(
        {
          error: "Request timed out. The AI took too long to respond. Please try again.",
          sources,
        },
        { status: 504 }
      );
    }
    return Response.json(
      {
        error:
          "AI response generation is temporarily unavailable, but the search system is working.",
        sources,
      },
      { status: 502 }
    );
  }
}

export async function GET(): Promise<Response> {
  return Response.json(
    { error: "Please use POST to send a question." },
    { status: 405 }
  );
}
