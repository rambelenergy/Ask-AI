import type { TrustedSearchResult } from "./search-trusted-sources";
import type { SupportedLanguage } from "./detect-language";

const SYSTEM_PROMPT_TRUSTED = `You are Ask Energy, the energy intelligence research assistant for RamBelEnergy.com — a platform focused on Algeria-Europe energy relations, natural gas, renewable energy, green hydrogen, energy security, and related geopolitics.

CRITICAL LANGUAGE RULE — You must answer in the same language as the user's question.
- English question → English answer
- French question → French answer
- Arabic question → Arabic answer
- Spanish question → Spanish answer
- Italian question → Italian answer
- German question → German answer
- Do NOT switch languages mid-response.
- Do NOT just translate the question — provide a real, substantive answer.

ANSWERING STYLE:
- Provide COMPREHENSIVE, DETAILED answers — not brief summaries.
- Use multiple paragraphs. Structure your answer with clear sections where appropriate.
- Draw from ALL provided sources. Do not rely on only one or two sources.
- Favor official institutional sources (Priority 1-3: government, agencies, international organizations) over news media reports. When a news agency and an official source both cover the same information, cite the official source.
- Analyze, explain, and contextualize — go beyond just reporting facts.
- Mention relevant source names where appropriate (e.g., "according to IEA data...", "Sonatrach reported that...", "the European Commission's energy strategy states...").
- If different sources provide complementary or contrasting information, present all perspectives.
- Stay strictly aligned with the user's question — do NOT change the subject.

SOURCES SECTION:
At the end of your response, always include a "Sources" section listing the numbered sources you actually used, with source name and URL.

If the results are limited or insufficient, say that clearly in the answer language.
Do not invent facts or use external knowledge beyond the provided context.`;

const SYSTEM_PROMPT_FALLBACK = `You are Ask Energy, the energy intelligence research assistant for RamBelEnergy.com.

CRITICAL LANGUAGE RULE — You must answer in the same language as the user's question.
- English question → English answer, French → French, Arabic → Arabic, etc.
- Do NOT switch languages mid-response.

IMPORTANT: The sources below come from a GENERAL WEB SEARCH and are NOT from verified/approved energy sources. Use them carefully.

Focus on Algeria-Europe energy relations, energy security, natural gas, solar energy, green hydrogen, renewable energy, investment, geopolitics, and related topics.

Include a short disclaimer in your answer that these sources have not been verified by RamBelEnergy.
Do not invent facts.
Provide a DETAILED, THOROUGH answer — not a brief summary.
Draw from multiple sources where possible.

At the end of your response, always include a "Sources" section listing the numbered sources you actually used.`;

/** Language-aware fallback messages */
const NO_RESULTS_MESSAGES: Record<SupportedLanguage, string> = {
  English:
    "I could not find enough relevant information from the approved trusted sources for this question.\n\nPlease try a more specific energy-related question, for example:\n• \"Algeria Italy gas cooperation\"\n• \"Sonatrach ENI energy partnership\"\n• \"MEDGAZ Algeria Spain pipeline\"\n• \"Algerian Sahara solar energy potential\"",
  French:
    "Je n'ai pas trouvé suffisamment d'informations pertinentes dans les sources approuvées pour cette question.\n\nEssayez de poser une question plus précise liée à l'énergie, par exemple :\n• \"Coopération gazière Algérie Italie\"\n• \"Partenariat énergétique Sonatrach ENI\"\n• \"Gazoduc MEDGAZ Algérie Espagne\"\n• \"Potentiel solaire du Sahara algérien\"",
  Arabic:
    "لم أجد معلومات كافية من المصادر الموثوقة المعتمدة للإجابة على هذا السؤال.\n\nيرجى طرح سؤال أكثر تحديدًا في مجال الطاقة، على سبيل المثال:\n• \"تعاون الغاز بين الجزائر وإيطاليا\"\n• \"شراكة الطاقة بين سوناطراك وإيني\"\n• \"خط أنابيب ميدغاز بين الجزائر وإسبانيا\"\n• \"إمكانات الطاقة الشمسية في الصحراء الجزائرية\"",
  Spanish:
    "No encontré suficiente información relevante en las fuentes aprobadas para esta pregunta.\n\nIntente hacer una pregunta más específica relacionada con la energía, por ejemplo:\n• \"Cooperación gasística Argelia Italia\"\n• \"Asociación energética Sonatrach ENI\"\n• \"Gasoducto MEDGAZ Argelia España\"\n• \"Potencial solar del Sáhara argelino\"",
  Italian:
    "Non ho trovato informazioni sufficienti nelle fonti approvate per rispondere a questa domanda.\n\nProva a fare una domanda più specifica legata all'energia, ad esempio:\n• \"Cooperazione gas Algeria Italia\"\n• \"Partnership energetica Sonatrach ENI\"\n• \"Gasdotto MEDGAZ Algeria Spagna\"\n• \"Potenziale solare del Sahara algerino\"",
  German:
    "Ich konnte nicht genügend relevante Informationen aus den genehmigten vertrauenswürdigen Quellen für diese Frage finden.\n\nBitte stellen Sie eine spezifischere energiebezogene Frage, zum Beispiel:\n• \"Erdgas-Kooperation Algerien Italien\"\n• \"Energiepartnerschaft Sonatrach ENI\"\n• \"MEDGAZ-Pipeline Algerien Spanien\"\n• \"Solarenergiepotenzial der algerischen Sahara\"",
  Unknown:
    "I could not find enough relevant information from the approved trusted sources for this question.\n\nPlease try a more specific energy-related question, for example:\n• \"Algeria Italy gas cooperation\"\n• \"Sonatrach ENI energy partnership\"\n• \"MEDGAZ Algeria Spain pipeline\"",
};

/** Search unavailable messages */
const SEARCH_UNAVAILABLE_MESSAGES: Record<SupportedLanguage, string> = {
  English:
    "Trusted source search is temporarily unavailable. Please try again later.",
  French:
    "La recherche de sources fiables est temporairement indisponible. Veuillez réessayer plus tard.",
  Arabic:
    "البحث في المصادر الموثوقة غير متاح مؤقتًا. يرجى المحاولة مرة أخرى لاحقًا.",
  Spanish:
    "La búsqueda en fuentes confiables no está disponible temporalmente. Inténtelo de nuevo más tarde.",
  Italian:
    "La ricerca nelle fonti affidabili è temporaneamente non disponibile. Riprova più tardi.",
  German:
    "Die Suche in vertrauenswürdigen Quellen ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.",
  Unknown:
    "Trusted source search is temporarily unavailable. Please try again later.",
};

/** AI unavailable messages */
const AI_UNAVAILABLE_MESSAGES: Record<SupportedLanguage, string> = {
  English:
    "AI response generation is temporarily unavailable. Please try again later.",
  French:
    "La génération de réponse IA est temporairement indisponible. Veuillez réessayer plus tard.",
  Arabic:
    "توليد الرد بالذكاء الاصطناعي غير متاح مؤقتًا. يرجى المحاولة مرة أخرى لاحقًا.",
  Spanish:
    "La generación de respuestas de IA no está disponible temporalmente. Inténtelo de nuevo más tarde.",
  Italian:
    "La generazione della risposta AI è temporaneamente non disponibile. Riprova più tardi.",
  German:
    "Die KI-Antwortgenerierung ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.",
  Unknown:
    "AI response generation is temporarily unavailable. Please try again later.",
};

/** Query too long — Brave API has 400-character limit on q parameter */
const QUERY_TOO_LONG_MESSAGES: Record<SupportedLanguage, string> = {
  English:
    "Your question is too long. Please keep it under 400 characters.",
  French:
    "Votre question est trop longue. Veuillez la limiter à 400 caractères.",
  Arabic:
    "سؤالك طويل جدًا. يرجى اختصاره إلى أقل من 400 حرف.",
  Spanish:
    "Tu pregunta es demasiado larga. Por favor, limítala a 400 caracteres.",
  Italian:
    "La tua domanda è troppo lunga. Per favore, limitati a 400 caratteri.",
  German:
    "Ihre Frage ist zu lang. Bitte beschränken Sie sich auf 400 Zeichen.",
  Unknown:
    "Your question is too long. Please keep it under 400 characters.",
};

/** Broad query suggestions — shown when query is too broad */
const BROAD_QUERY_MESSAGES: Record<SupportedLanguage, string> = {
  English:
    "This question is broad. Try asking more specifically, for example:\n• \"Algeria Italy gas cooperation\"\n• \"Sonatrach ENI partnership\"\n• \"MEDGAZ Algeria Spain pipeline\"",
  French:
    "Cette question est large. Essayez de demander plus précisément, par exemple :\n• \"Coopération gazière Algérie Italie\"\n• \"Partenariat Sonatrach ENI\"\n• \"Gazoduc MEDGAZ Algérie Espagne\"",
  Arabic:
    "هذا السؤال واسع. حاول أن تسأل بشكل أكثر تحديدًا، على سبيل المثال:\n• \"تعاون الغاز بين الجزائر وإيطاليا\"\n• \"شراكة سوناطراك وإيني\"\n• \"خط أنابيب ميدغاز بين الجزائر وإسبانيا\"",
  Spanish:
    "Esta pregunta es amplia. Intente preguntar más específicamente, por ejemplo:\n• \"Cooperación gasística Argelia Italia\"\n• \"Asociación Sonatrach ENI\"\n• \"Gasoducto MEDGAZ Argelia España\"",
  Italian:
    "Questa domanda è ampia. Prova a chiedere in modo più specifico, ad esempio:\n• \"Cooperazione gas Algeria Italia\"\n• \"Partnership Sonatrach ENI\"\n• \"Gasdotto MEDGAZ Algeria Spagna\"",
  German:
    "Diese Frage ist sehr allgemein. Bitte stellen Sie eine spezifischere Frage, zum Beispiel:\n• \"Erdgas-Kooperation Algerien Italien\"\n• \"Sonatrach ENI Partnerschaft\"\n• \"MEDGAZ-Pipeline Algerien Spanien\"",
  Unknown:
    "This question is broad. Try asking more specifically, for example:\n• \"Algeria Italy gas cooperation\"\n• \"Sonatrach ENI partnership\"\n• \"MEDGAZ Algeria Spain pipeline\"",
};

const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  English: "English",
  French: "French (Français)",
  Arabic: "Arabic (العربية)",
  Spanish: "Spanish (Español)",
  Italian: "Italian (Italiano)",
  German: "German (Deutsch)",
  Unknown: "English",
};

export function getSearchUnavailableMessage(language: SupportedLanguage): string {
  return SEARCH_UNAVAILABLE_MESSAGES[language] ?? SEARCH_UNAVAILABLE_MESSAGES.Unknown;
}

export function getAiUnavailableMessage(language: SupportedLanguage): string {
  return AI_UNAVAILABLE_MESSAGES[language] ?? AI_UNAVAILABLE_MESSAGES.Unknown;
}

export function getBroadQueryMessage(language: SupportedLanguage): string {
  return BROAD_QUERY_MESSAGES[language] ?? BROAD_QUERY_MESSAGES.Unknown;
}

export function getQueryTooLongMessage(language: SupportedLanguage): string {
  return QUERY_TOO_LONG_MESSAGES[language] ?? QUERY_TOO_LONG_MESSAGES.Unknown;
}

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
      user: `Question: ${question}\n\nNo search results were found.\n\nPlease tell the user you couldn't find enough relevant information. Use the exact wording from the noResultsMessage in the user's language. Be helpful and encouraging.`,
      noResultsMessage,
    };
  }

  const allTrusted = results.every((r) => r.trusted);
  const system = allTrusted ? SYSTEM_PROMPT_TRUSTED : SYSTEM_PROMPT_FALLBACK;

  const sourcesText = results
    .map(
      (r, i) =>
        `[${i + 1}] Title: ${r.title}\n   Domain: ${r.domain} (${r.priorityGroup}, Priority ${r.priority})\n   ${r.summary ? `Content: ${r.summary}` : r.snippet ? `Snippet: ${r.snippet}` : ""}\n   URL: ${r.url}${r.trusted ? "" : " [unverified source]"}`
    )
    .join("\n\n");

  const instruction = allTrusted
    ? `INSTRUCTIONS: Answer the question in ${langName}. Provide a COMPREHENSIVE, DETAILED answer — not a brief summary. Use multiple paragraphs. Draw from ALL provided sources, favoring official institutional sources (Priority 1-3) as primary references. When news agencies (Priority 4) and official sources both cover the same topic, cite the official source. Include a "Sources" section at the end listing only the sources you actually referenced. Stay on topic — do not change the subject. Do not invent facts.`
    : `INSTRUCTIONS: Answer the question in ${langName}. Provide a COMPREHENSIVE, DETAILED answer — not a brief summary. Use the search results below. Include a disclaimer that these are from general web search. Include a "Sources" section at the end. Stay on topic — do not change the subject. Do not invent facts.`;

  const sourceLabel = allTrusted ? "Trusted Source Results" : "General Web Search Results";

  // Add priority context to help the AI understand source hierarchy
  const priorityContext = allTrusted
    ? `\nSOURCE PRIORITY GUIDE:\n- Priority 1: Algerian official/government sources (highest authority)\n- Priority 2: European Union and national institutions\n- Priority 3: International organizations and development institutions\n- Priority 4: News agencies and market intelligence\n- Priority 5: Sector-specific, regional, and analytical sources\nAlways prioritize citing higher-priority institutional sources over lower-priority media sources when covering the same information.`
    : "";

  return {
    system,
    user: `User question: ${question}${priorityContext}\n\n${sourceLabel}:\n\n${sourcesText}\n\n---\n\n${instruction}`,
    noResultsMessage,
  };
}
