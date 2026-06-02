export type AiOperation = "summarize" | "assistant";

export interface AiRequest {
  operation: AiOperation;
  content: string;
  question?: string;
}

export interface AiResponse {
  success: boolean;
  operation: AiOperation;
  result?: string;
  error?: string;
}
