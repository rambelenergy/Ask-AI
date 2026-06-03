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
  en: ["Why is Algeria important for Europe's energy security?"],

  fr: [
    "Pourquoi l'Algérie est-elle importante pour la sécurité énergétique européenne ?",
  ],

  ar: ["لماذا تعتبر الجزائر مهمة لأمن الطاقة في أوروبا؟"],

  es: [
    "¿Por qué es importante Argelia para la seguridad energética de Europa?",
  ],

  it: [
    "Perché l'Algeria è importante per la sicurezza energetica dell'Europa?",
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

export default questions;
