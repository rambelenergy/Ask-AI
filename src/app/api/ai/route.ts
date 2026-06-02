import { NextResponse } from "next/server";
import type { AiResponse } from "@/types/ai";
import { validateRequest } from "@/lib/ai/validate";
import { callAiProvider } from "@/lib/ai/provider";

export async function POST(request: Request): Promise<NextResponse<AiResponse>> {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, operation: "summarize", error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const validation = validateRequest(body);

    if (!validation.valid || !validation.sanitized) {
      return NextResponse.json(
        {
          success: false,
          operation: (body as Record<string, unknown>)?.operation === "assistant"
            ? "assistant"
            : "summarize",
          error: validation.error ?? "Invalid request.",
        },
        { status: 400 }
      );
    }

    const { operation, content, question, language } = validation.sanitized;

    const result = await callAiProvider(operation, content, question, language);

    if (!result.success) {
      return NextResponse.json(
        { success: false, operation, error: result.error ?? "AI service error." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      operation,
      result: result.text,
    });
  } catch {
    return NextResponse.json(
      { success: false, operation: "summarize", error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse<{ error: string }>> {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
