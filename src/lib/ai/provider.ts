import type { AiOperation } from "@/types/ai";
import { getSystemPrompt } from "@/lib/ai/prompts";

interface ProviderResult {
  success: boolean;
  text?: string;
  error?: string;
}

export async function callAiProvider(
  operation: AiOperation,
  content: string,
  question?: string,
  language?: string
): Promise<ProviderResult> {
  const provider = process.env.AI_PROVIDER ?? "openrouter";

  if (provider === "openai") {
    // TODO: OpenAI provider stubbed for future implementation.
    // When ready, follow the same pattern as OpenRouter below.
    // Requires: OPENAI_API_KEY, OPENAI_MODEL env vars.
    return { success: false, error: "OpenAI provider is not yet configured." };
  }

  if (provider !== "openrouter") {
    return {
      success: false,
      error: `Unsupported AI provider: ${provider}.`,
    };
  }

  return callOpenRouter(operation, content, question, language);
}

async function callOpenRouter(
  operation: AiOperation,
  content: string,
  question?: string,
  language?: string
): Promise<ProviderResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL ?? "openai/gpt-4o-mini";
  const baseUrl = process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1";

  if (!apiKey) {
    return { success: false, error: "OpenRouter API key is not configured." };
  }

  // Build language-aware system prompt
  const basePrompt = getSystemPrompt(operation);
  const langInstruction = language && language !== "en"
    ? `\n\nIMPORTANT: Respond in ${language === "fr" ? "French" : "Arabic"}.`
    : "";
  const systemPrompt = basePrompt + langInstruction;

  const userMessage = operation === "assistant" && question
    ? `SUPPLIED CONTENT:\n\n${content}\n\nQUESTION: ${question}`
    : `Please summarize the following content:\n\n${content}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "RamBelEnergy Prototype",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) {
        return { success: false, error: "AI service configuration error." };
      }
      return { success: false, error: "AI service temporarily unavailable." };
    }

    const data = await response.json() as {
      choices?: { message?: { content?: string } }[];
    };

    const text = data.choices?.[0]?.message?.content?.trim();

    if (!text) {
      return { success: false, error: "AI service returned an empty response." };
    }

    return { success: true, text };
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { success: false, error: "AI service request timed out." };
    }
    return { success: false, error: "AI service temporarily unavailable." };
  } finally {
    clearTimeout(timeoutId);
  }
}
