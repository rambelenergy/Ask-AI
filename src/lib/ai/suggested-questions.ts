/**
 * Suggested questions for the Ask Energy AI chatbox.
 *
 * One example question per language — shown as a suggestion chip
 * when the chat is empty.
 *
 * When the active language has no entry, English is used as the default.
 */

export type SuggestedQuestionsLanguage = "en" | "fr" | "ar" | "es" | "it";

const questions: Partial<Record<SuggestedQuestionsLanguage, string[]>> = {
  en: ["Ask about the Algeria–Spain energy partnership"],

  fr: [
    "Demandez des informations sur le partenariat énergétique algéro-espagnol",
  ],

  ar: ["اسأل عن الشراكة الجزائرية الإسبانية في الطاقة"],

  es: [
    "Pregunta sobre la asociación energética entre Argelia y España",
  ],

  it: [
    "Chiedi informazioni sul partenariato energetico tra Algeria e Spagna",
  ],
};

/**
 * Return suggested questions for the given language.
 * Falls back to English when the language has no entries.
 */
export function getSuggestedQuestions(lang: string): string[] {
  const q = questions[lang as SuggestedQuestionsLanguage];
  if (q && q.length > 0) return q;
  return questions.en ?? [];
}

/**
 * Return ALL suggested questions from every language.
 */
export function getAllSuggestedQuestions(): string[] {
  const all: string[] = [];
  const seen = new Set<string>();
  for (const list of Object.values(questions)) {
    for (const q of list ?? []) {
      const trimmed = q.trim();
      if (!seen.has(trimmed)) {
        seen.add(trimmed);
        all.push(q);
      }
    }
  }
  return all;
}

export default questions;
