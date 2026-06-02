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

export async function searchWithLangSearch(query: string): Promise<LangSearchResult[]> {
  const apiKey = process.env.LANGSEARCH_API_KEY;

  if (!apiKey) {
    throw new Error("LangSearch API key is not configured.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15_000);

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
        count: 15,
      }),
      signal: controller.signal,
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
