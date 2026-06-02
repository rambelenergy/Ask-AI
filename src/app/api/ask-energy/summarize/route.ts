import { detectQuestionLanguage } from "@/lib/ask-energy/detect-language";
import type { SupportedLanguage } from "@/lib/ask-energy/detect-language";

const MAX_TEXT_LENGTH = 8000;
const MAX_SUMMARY_TOKENS = 600;

interface SummarizeRequest {
  text: string;
  language?: string;
}

function detectLanguageFromText(text: string): string {
  // Quick check: Arabic Unicode
  if (/[\u0600-\u06FF]/.test(text)) return "Arabic";
  // French accents
  if (/[éèêëàâçùûîïœ]/i.test(text)) return "French";
  // Spanish markers
  if (text.includes("¿") || text.includes("ñ")) return "Spanish";
  // Italian patterns
  if (/\b(perché|qualsiasi|dell[a'])\b/i.test(text)) return "Italian";
  return "English";
}

const SYSTEM_PROMPT = `You are an editorial assistant for RamBelEnergy.com. Summarize the provided Ask Energy response into a shorter, clear, and professional version.

CRITICAL RULES:
- Keep the SAME language as the original text.
- Do NOT add new facts or information.
- Do NOT change the meaning.
- Do NOT add source claims or invent statistics.
- Preserve important warnings, caveats, or uncertainty if present.
- Keep the summary concise and useful.

FORMAT:
- For long analytical answers: use 3-5 bullet points.
- For moderately long answers: use 1 short paragraph.
- Do not use markdown headers — just bullets or paragraphs.`;

export async function POST(request: Request): Promise<Response> {
  const aiApiKey = process.env.OPENROUTER_API_KEY;

  if (!aiApiKey) {
    return Response.json(
      { error: "AI provider is not configured yet." },
      { status: 500 }
    );
  }

  let body: SummarizeRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid JSON in request body." },
      { status: 400 }
    );
  }

  let text = typeof body.text === "string" ? body.text.trim() : "";

  if (!text || text.length < 200) {
    return Response.json(
      { error: "Text is too short to summarize. Minimum 200 characters required." },
      { status: 400 }
    );
  }

  // Truncate to avoid excessive cost
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.slice(0, MAX_TEXT_LENGTH) + "...";
  }

  // Detect language from the text
  const language = detectLanguageFromText(text);

  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${aiApiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "RamBelEnergy - Summarize",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Summarize the following response in ${language}. Keep the same language. Do not add information not present in the original.\n\nText:\n${text}`,
          },
        ],
        max_tokens: MAX_SUMMARY_TOKENS,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return Response.json(
        { error: "Unable to summarize this response right now. Please try again." },
        { status: 502 }
      );
    }

    const data = await upstream.json();
    const summary = data.choices?.[0]?.message?.content?.trim() ?? "";

    if (!summary) {
      return Response.json(
        { error: "Unable to generate a summary. Please try again." },
        { status: 500 }
      );
    }

    return Response.json({ summary });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return Response.json(
        { error: "Summarization timed out. Please try again." },
        { status: 504 }
      );
    }
    return Response.json(
      { error: "Unable to summarize this response right now. Please try again." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
