/**
 * AI-powered language detection using OpenRouter (liquid/lfm-2.5-1.2b-instruct:free).
 * Falls back to heuristic detection if the API is unavailable.
 *
 * Model: liquid/lfm-2.5-1.2b-instruct:free
 * Fast, small model optimized for instruction-following — perfect for language detection.
 */

export type SupportedLanguage =
  | "English"
  | "French"
  | "Arabic"
  | "Spanish"
  | "Italian"
  | "German"
  | "Unknown";

const DETECTION_MODEL = "liquid/lfm-2.5-1.2b-instruct:free";

// ---------------------------------------------------------------------------
// Heuristic fallback (used if OpenRouter is unreachable)
// ---------------------------------------------------------------------------

const FRENCH_INDICATORS = [
  "le ", "la ", "les ", "des ", "du ", "une ", "un ", "ce ", "cette ",
  "est-ce", "pourquoi", "comment", "quel ", "quelle", "quels", "quelles",
  "qu'est", "n'est", "c'est", "sont", "avec", "dans", "sur ", "par ",
  "pour ", "plus", "moins", "très", "aussi", "peut",
  "énergie", "énergétique", "sécurité", "rôle", "l'algérie",
  "coopération", "gaz", "solaire", "européen",
];

const SPANISH_INDICATORS = [
  "qué ", "por qué", "cómo", "cuál ", "cuáles", "cuándo",
  "energía", "españa", "argelia", "seguridad", "cooperación",
  "papel ", "el ", "los ", "las ", "una ", "un ", "del ", "para ",
];

const ITALIAN_INDICATORS = [
  "perché", "come ", "qual è", "quale ", "quali ",
  "energia", "italia", "algeria", "sicurezza", "cooperazione",
  "ruolo ", "il ", "la ", "i ", "gli ", "le ", "un ", "una ",
  "del ", "della", "dei ", "delle", "per ", "con ", "tra ",
  "è ", "sono", "europeo", "europea",
];

const GERMAN_INDICATORS = [
  "warum", "was ist", "welche", "welcher", "welches",
  "energie", "sicherheit", "zusammenarbeit", "rolle",
  "die ", "der ", "das ", "und ", "mit ", "von ", "für ",
  "algerien", "europa", "deutschland", "gas", "pipeline",
];

function hasArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function countMatches(text: string, indicators: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const word of indicators) {
    if (lower.includes(word)) score++;
  }
  return score;
}

function detectHeuristic(text: string): SupportedLanguage {
  const trimmed = text.trim();
  if (!trimmed) return "Unknown";

  if (hasArabic(trimmed)) return "Arabic";

  const spanishScore = countMatches(trimmed, SPANISH_INDICATORS);
  if (trimmed.includes("¿") || trimmed.includes("ñ")) {
    if (spanishScore >= 1) return "Spanish";
  }
  if (spanishScore >= 3) return "Spanish";

  const italianScore = countMatches(trimmed, ITALIAN_INDICATORS);
  if (italianScore >= 3) return "Italian";

  const germanScore = countMatches(trimmed, GERMAN_INDICATORS);
  if (germanScore >= 3) return "German";

  const frenchScore = countMatches(trimmed, FRENCH_INDICATORS);
  const hasFrenchAccents = /[éèêëàâçùûîïœ]/i.test(trimmed);
  if (hasFrenchAccents && frenchScore >= 1) return "French";
  if (frenchScore >= 3) return "French";

  return "English";
}

// ---------------------------------------------------------------------------
// AI-powered detection via OpenRouter
// Used as a SECONDARY check for ambiguous cases only.
// Heuristic detection (fast, reliable for accents/Arabic) runs first.
// ---------------------------------------------------------------------------

export async function detectQuestionLanguage(text: string): Promise<SupportedLanguage> {
  // Fast heuristic first — reliable for accented languages and Arabic
  const heuristic = detectHeuristic(text);

  // If heuristic is confident (not English, not Unknown), use it directly
  if (heuristic !== "English" && heuristic !== "Unknown") {
    return heuristic;
  }

  // For English/Unknown: confirm via AI model to catch false negatives
  // (e.g. unaccented Italian like "Algeria Italia energia")
  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  if (!apiKey) return heuristic;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
      },
      body: JSON.stringify({
        model: DETECTION_MODEL,
        messages: [
          { role: "system", content: "Detect the language. Reply with EXACTLY ONE WORD: English, French, Arabic, Spanish, or Italian. Do NOT reply in any other language. Just the word." },
          { role: "user", content: `"${text.slice(0, 300)}"` },
        ],
        max_tokens: 5,
        temperature: 0,
      }),
      signal: controller.signal,
    });

    if (!response.ok) return heuristic;

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content?.trim() ?? "";
    const lang = raw.split(/\s+/)[0].replace(/[^a-zA-Z]/g, "").toLowerCase();

    const valid: Record<string, SupportedLanguage> = {
      english: "English", french: "French", français: "French", francais: "French",
      arabic: "Arabic", العربية: "Arabic", arab: "Arabic",
      spanish: "Spanish", español: "Spanish", espanol: "Spanish",
      italian: "Italian", italiano: "Italian",
      german: "German", deutsch: "German",
    };

    return valid[lang] ?? heuristic;
  } catch {
    return heuristic;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Synchronous wrapper for quick non-blocking pre-check (used in expand-query.ts) */
export function detectQuestionLanguageSync(text: string): SupportedLanguage {
  // Fast path: Arabic via Unicode range
  if (/[\u0600-\u06FF]/.test(text)) return "Arabic";
  // Quick accent check
  if (/[éèêëàâçùûîïœ]/i.test(text)) return "French";
  if (text.includes("¿") || text.includes("ñ")) return "Spanish";
  // Default optimistic: English
  return "English";
}
