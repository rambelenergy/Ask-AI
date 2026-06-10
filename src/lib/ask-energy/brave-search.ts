export interface BraveSearchResult {
  title: string;
  url: string;
  snippet?: string;
  description?: string;
}

interface BraveRawResult {
  title?: string;
  url?: string;
  description?: string;
}

interface BraveWebResponse {
  results?: BraveRawResult[];
}

interface BraveApiResponse {
  web?: BraveWebResponse;
}

/**
 * Detect if a question asks for current/recent/today's data.
 * Returns a Brave freshness value: "pd" (past day), "pw" (past week),
 * "pm" (past month), or undefined (no limit).
 */
export function detectFreshness(question: string): string | undefined {
  const q = question.toLowerCase();

  // Strong signals for "right now" data → past day
  const todaySignals = [
    "today", "now", "right now", "current price", "live price",
    "latest price", "today's", "todays", "real-time", "real time",
    "at the moment", "as of today",
  ];
  for (const s of todaySignals) {
    if (q.includes(s)) return "pd";
  }

  // Medium signals for recent data → past week
  const recentSignals = [
    "price", "prices", "cost", "costs",
    "this week", "recent", "latest", "update",
    "current", "currently",
  ];
  for (const s of recentSignals) {
    if (q.includes(s)) return "pw";
  }

  // Month-sensitive queries
  const monthSignals = [
    "this month", "monthly", "last month",
  ];
  for (const s of monthSignals) {
    if (q.includes(s)) return "pm";
  }

  // Default: no freshness limit
  return undefined;
}

/**
 * Build a Brave Search query with optional site filter.
 * Brave natively supports the `site:` operator in the `q` parameter.
 * Example: "renewable energy Algeria site:iea.org OR site:irena.org"
 *
 * ⚠️ Brave API has a 400-character limit on the `q` parameter.
 * This function truncates the site list to fit within that limit,
 * prioritizing earlier (higher-priority) domains.
 */
function buildQuery(query: string, sites?: string[]): string {
  if (!sites || sites.length === 0) return query;

  const MAX_QUERY_LENGTH = 400;
  // Reserve space for the base query + leading space
  const baseLength = query.length + 1; // +1 for space between query and first site:

  let result = query;
  let included = 0;

  for (const domain of sites) {
    // " OR site:domain" = 10 + domain.length (no leading OR for first domain)
    const separator = included === 0 ? " site:" : " OR site:";
    const clause = separator + domain;

    if (result.length + clause.length > MAX_QUERY_LENGTH) break;
    result += clause;
    included++;
  }

  return result;
}

/**
 * Search using Brave Search API (primary search provider).
 * Uses the BRAVESEARCH_API_KEY environment variable.
 *
 * @param query     - Search query
 * @param sites     - Optional trusted domains to restrict search to (uses Brave `site:` operator)
 * @param signal    - AbortSignal for cancellation
 * @param freshness - Optional freshness filter: "pd" (past day), "pw" (past week), "pm" (past month)
 */
export async function searchWithBrave(
  query: string,
  sites?: string[],
  signal?: AbortSignal,
  freshness?: string
): Promise<BraveSearchResult[]> {
  const apiKey = process.env.BRAVESEARCH_API_KEY;

  if (!apiKey) {
    throw new Error("Brave Search API key is not configured.");
  }

  const fullQuery = buildQuery(query, sites);

  const params = new URLSearchParams({
    q: fullQuery,
    count: "20",
    search_lang: "en",
  });

  if (freshness) {
    params.set("freshness", freshness);
  }

  const url = `https://api.search.brave.com/res/v1/web/search?${params.toString()}`;

  // Combine external signal with internal 12s timeout
  const internalController = new AbortController();
  const timeoutId = setTimeout(() => internalController.abort(), 12_000);

  if (signal) {
    if (signal.aborted) {
      clearTimeout(timeoutId);
      internalController.abort(signal.reason);
    } else {
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(timeoutId);
          internalController.abort(signal.reason);
        },
        { once: true }
      );
    }
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": apiKey,
      },
      signal: internalController.signal,
    });

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`);
    }

    const raw: BraveApiResponse = await response.json();
    const rawResults = raw.web?.results ?? [];

    return rawResults
      .filter((item) => item.title && item.url)
      .map((item) => ({
        title: item.title!,
        url: item.url!,
        snippet: item.description,
        description: item.description,
      }));
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Brave Search request timed out.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
