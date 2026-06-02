import type { AiOperation } from "@/types/ai";

const MAX_CONTENT_LENGTH = 50_000;
const MAX_QUESTION_LENGTH = 500;
const VALID_OPERATIONS: AiOperation[] = ["summarize", "assistant"];
const VALID_LANGUAGES = ["en", "fr", "ar"];

interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: {
    operation: AiOperation;
    content: string;
    question?: string;
    language?: string;
  };
}

export function validateRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Invalid request body." };
  }

  const { operation, content, question, language } = body as Record<string, unknown>;

  // Validate language if provided
  let safeLanguage: string | undefined;
  if (typeof language === "string" && VALID_LANGUAGES.includes(language)) {
    safeLanguage = language;
  }

  if (!VALID_OPERATIONS.includes(operation as AiOperation)) {
    return {
      valid: false,
      error: `Invalid operation. Must be one of: ${VALID_OPERATIONS.join(", ")}.`,
    };
  }

  if (typeof content !== "string" || !content.trim()) {
    return { valid: false, error: "Content is required." };
  }

  const trimmedContent = content.trim();

  if (trimmedContent.length > MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      error: `Content exceeds maximum length of ${MAX_CONTENT_LENGTH.toLocaleString()} characters.`,
    };
  }

  if (operation === "assistant" && question !== undefined) {
    if (typeof question !== "string" || !question.trim()) {
      return { valid: false, error: "Question must be a non-empty string." };
    }

    const trimmedQuestion = question.trim();

    if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
      return {
        valid: false,
        error: `Question exceeds maximum length of ${MAX_QUESTION_LENGTH} characters.`,
      };
    }

    return {
      valid: true,
      sanitized: {
        operation: operation as AiOperation,
        content: trimmedContent,
        question: trimmedQuestion,
        language: safeLanguage,
      },
    };
  }

  return {
    valid: true,
    sanitized: {
      operation: operation as AiOperation,
      content: trimmedContent,
      language: safeLanguage,
    },
  };
}
