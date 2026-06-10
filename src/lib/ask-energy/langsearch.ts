export interface LangSearchResult {
  title: string;
  url: string;
  snippet?: string;
  summary?: string;
}

interface LangSearchRawItem {
  name?: string;
  url?: string;
  snippet?: string;
  summary?: string;
}

interface LangSearchResponse {
  webPages?: {
    value?: LangSearchRawItem[];
  };
}

export async function searchWithLangSearch(
  query: string,
  signal?: AbortSignal
): Promise<LangSearchResult[]> {
  const apiKey = process.env.LANGSEARCH_API_KEY;

  if (!apiKey) {
    throw new Error("LangSearch API key is not configured.");
  }

  // Combine external signal with internal 12s timeout (whichever fires first)
  const internalController = new AbortController();
  const timeoutId = setTimeout(() => internalController.abort(), 12_000);

  // Forward external signal to abort internal controller
  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      internalController.abort(signal.reason);
    } else {
      signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        internalController.abort(signal.reason);
      }, { once: true });
    }
  }

  try {
    const response = await fetch("https://api.langsearch.com/v1/web-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        freshness: "noLimit",
        summary: true,
        count: 25,
      }),
      signal: internalController.signal,
    });

    if (!response.ok) {
      throw new Error(`LangSearch API error: ${response.status}`);
    }

    const raw: { code?: number; data?: LangSearchResponse } = await response.json();

    const data = raw.data ?? (raw as unknown as LangSearchResponse);
    const rawResults = data.webPages?.value ?? [];

    return rawResults
      .filter((item) => item.name && item.url)
      .map((item) => ({
        title: item.name!,
        url: item.url!,
        snippet: item.snippet,
        summary: item.summary,
      }));
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("LangSearch request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
