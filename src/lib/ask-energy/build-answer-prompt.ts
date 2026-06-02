import type { TrustedSearchResult } from "./search-trusted-sources";
import type { SupportedLanguage } from "./detect-language";

const SYSTEM_PROMPT_TRUSTED = `You are Ask Energy, an experimental energy intelligence assistant for RamBelEnergy.com.

CRITICAL — You must answer in the same language as the user's question.
- If the user wrote in French, answer in French.
- If the user wrote in Arabic, answer in Arabic.
- If the user wrote in Spanish, answer in Spanish.
- If the user wrote in Italian, answer in Italian.
- If the user wrote in English, answer in English.
- Do NOT switch languages mid-response.
- Do NOT only translate the question — provide a real answer.
- Do NOT summarize without answering.

Use only the trusted search results provided in the context.
Focus on Algeria-Europe energy relations, natural gas, energy security, renewables, solar energy, green hydrogen, investment, geopolitics, and related economic topics.

If the results are limited or insufficient, say that clearly in the answer language.
Do not invent facts or use external knowledge beyond the provided context.
Keep the answer concise, analytical, and professional.
Mention relevant source names where appropriate (e.g., "according to IEA...", "IRENA data shows...").

At the end of your response, always include a short "Sources" section listing the numbered sources you actually used.`;

const SYSTEM_PROMPT_FALLBACK = `You are Ask Energy, an experimental energy intelligence assistant for RamBelEnergy.com.

CRITICAL — You must answer in the same language as the user's question.
- If the user wrote in French, answer in French.
- If the user wrote in Arabic, answer in Arabic.
- If the user wrote in Spanish, answer in Spanish.
- If the user wrote in Italian, answer in Italian.
- If the user wrote in English, answer in English.
- Do NOT switch languages mid-response.
- Do NOT only translate the question — provide a real answer.

Use the search results provided below. These come from a general web search and are NOT from verified/approved energy sources. Use them carefully.

Focus on Algeria-Europe energy relations, energy security, natural gas, solar energy, green hydrogen, renewable energy, investment, geopolitics, and related economic topics.

Important: The sources below are from general web search — include a short disclaimer in your answer that these sources have not been verified by RamBelEnergy.
Do not invent facts. Keep the answer concise, analytical, and professional.

At the end of your response, always include a short "Sources" section listing the numbered sources you actually used.`;

/** Language-aware fallback messages */
const NO_RESULTS_MESSAGES: Record<SupportedLanguage, string> = {
  English:
    "I could not find enough relevant information from the approved trusted sources for this question. Please try a more specific energy-related question, for example: \"Algeria Italy gas cooperation\", \"Sonatrach ENI energy partnership\", \"Algeria Europe energy security\", or \"Algerian Sahara solar energy potential\".",
  French:
    "Je n'ai pas trouvé suffisamment d'informations pertinentes dans les sources approuvées pour cette question. Essayez de poser une question plus précise liée à l'énergie, par exemple: \"coopération gazière Algérie Italie\", \"partenariat énergétique Sonatrach ENI\", \"sécurité énergétique Algérie Europe\", ou \"potentiel solaire du Sahara algérien\".",
  Arabic:
    "لم أجد معلومات كافية من المصادر الموثوقة المعتمدة للإجابة على هذا السؤال. يرجى طرح سؤال أكثر تحديدًا في مجال الطاقة، على سبيل المثال: \"تعاون الغاز بين الجزائر وإيطاليا\"، \"شراكة الطاقة بين سوناطراك وإيني\"، \"أمن الطاقة بين الجزائر وأوروبا\"، أو \"إمكانات الطاقة الشمسية في الصحراء الجزائرية\".",
  Spanish:
    "No encontré suficiente información relevante en las fuentes aprobadas para esta pregunta. Intente hacer una pregunta más específica relacionada con la energía, por ejemplo: \"cooperación gasística Argelia Italia\", \"asociación energética Sonatrach ENI\", \"seguridad energética Argelia Europa\", o \"potencial solar del Sáhara argelino\".",
  Italian:
    "Non ho trovato informazioni sufficienti nelle fonti approvate per rispondere a questa domanda. Prova a fare una domanda più specifica legata all'energia, ad esempio: \"cooperazione gas Algeria Italia\", \"partnership energetica Sonatrach ENI\", \"sicurezza energetica Algeria Europa\", o \"potenziale solare del Sahara algerino\".",
  Unknown:
    "I could not find enough relevant information from the approved trusted sources for this question. Please try a more specific energy-related question.",
};

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  English: "English",
  French: "French (Français)",
  Arabic: "Arabic (العربية)",
  Spanish: "Spanish (Español)",
  Italian: "Italian (Italiano)",
  Unknown: "English",
};

export function buildAskEnergyPrompt(
  question: string,
  results: TrustedSearchResult[],
  language: SupportedLanguage
): { system: string; user: string; noResultsMessage: string } {
  const langName = LANGUAGE_NAMES[language];
  const noResultsMessage = NO_RESULTS_MESSAGES[language];

  if (results.length === 0) {
    return {
      system: SYSTEM_PROMPT_FALLBACK,
      user: `Question: ${question}\nDetected language: ${langName}\n\nNo search results were found.\n\nPlease tell the user you couldn't find enough relevant information. Use this exact message in your response language: "${noResultsMessage}". Be helpful and encouraging.`,
      noResultsMessage,
    };
  }

  const allTrusted = results.every((r) => r.trusted);
  const system = allTrusted ? SYSTEM_PROMPT_TRUSTED : SYSTEM_PROMPT_FALLBACK;

  const sourcesText = results
    .map(
      (r, i) =>
        `[${i + 1}] Title: ${r.title}\n   Domain: ${r.domain} (${r.priorityGroup})\n   ${r.summary ? `Content: ${r.summary}` : r.snippet ? `Snippet: ${r.snippet}` : ""}\n   URL: ${r.url}${r.trusted ? "" : " [unverified source]"}`
    )
    .join("\n\n");

  const instruction = allTrusted
    ? `Answer the question in ${langName}. Do NOT translate the question — give a real answer. Use only the above trusted sources. If the sources are limited, say that clearly in ${langName}. Include a "Sources" section at the end. Do not invent facts.`
    : `Answer the question in ${langName}. Do NOT translate the question — give a real answer. Use the above search results. Include a disclaimer that these are from general web search. Include a "Sources" section at the end. Do not invent facts.`;

  const sourceLabel = allTrusted ? "Trusted Source Results" : "General Web Search Results";

  return {
    system,
    user: `User question: ${question}\nDetected language: ${langName}\n\n${sourceLabel}:\n\n${sourcesText}\n\n---\n\nInstructions: ${instruction}`,
    noResultsMessage,
  };
}
