import { callAiProvider } from "@/lib/ai/provider";

export async function generateSummary(content: string): Promise<string> {
  if (!content || content.trim().length === 0) {
    return "";
  }

  const result = await callAiProvider("summarize", content.trim());

  if (!result.success || !result.text) {
    throw new Error(result.error ?? "Failed to generate summary");
  }

  return result.text;
}