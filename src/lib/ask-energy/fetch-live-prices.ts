/**
 * Live-fetch content from dynamic price-reporting pages.
 *
 * Search engine snippets are INDEX SNAPSHOTS — for pages that update daily
 * (EIA prices, oilprice.com, etc.), the snippet is always stale.
 * This module fetches the actual live page and extracts the numbers.
 */

export interface LivePriceData {
  url: string;
  fetchedAt: string;
  /** The extracted text content (first 3000 chars of readable content) */
  content: string;
  /** Any prices/dates extracted from the content */
  extracted: {
    date?: string;
    prices?: { label: string; value: string; change?: string }[];
  };
}

/** URLs that should always be live-fetched for price queries */
const DYNAMIC_PRICE_URLS = [
  "eia.gov/todayinenergy/prices.php",
  "oilprice.com",
  "tradingeconomics.com/commodity",
  "oilmarketcap.com",
  "markets.businessinsider.com/commodities",
];

/**
 * Check if a URL is a known dynamic price page that needs live fetching.
 */
export function isDynamicPriceUrl(url: string): boolean {
  return DYNAMIC_PRICE_URLS.some((pattern) => url.includes(pattern));
}

/**
 * Live-fetch and extract content from a dynamic price page.
 * Timeout: 3 seconds per page.
 */
export async function fetchLivePricePage(url: string): Promise<LivePriceData | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "RamBelEnergy/1.0 (energy intelligence; info@rambelenergy.com)",
        Accept: "text/html, application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const html = await response.text();
    const text = extractReadableText(html);
    if (!text || text.length < 20) return null;

    // Extract key data
    const date = extractDate(text);
    const prices = extractPrices(text);

    return {
      url,
      fetchedAt: new Date().toISOString(),
      content: text.slice(0, 3000),
      extracted: { date, prices },
    };
  } catch {
    return null;
  }
}

/**
 * Fetch multiple live price pages in parallel.
 * Only fetches URLs matching known dynamic price patterns.
 */
export async function fetchLivePrices(
  urls: string[]
): Promise<LivePriceData[]> {
  const targets = urls.filter(isDynamicPriceUrl).slice(0, 4);
  if (targets.length === 0) return [];

  const results = await Promise.allSettled(
    targets.map((url) => fetchLivePricePage(url))
  );

  return results
    .filter((r) => r.status === "fulfilled" && r.value !== null)
    .map((r) => (r as PromiseFulfilledResult<LivePriceData>).value);
}

// ─── Extractors ───

function extractReadableText(html: string): string {
  // Strip scripts, styles, and excessive whitespace
  let text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

/** Extract a date like "June 11, 2026" or "6/10/26" from text */
function extractDate(text: string): string | undefined {
  // "June 11, 2026"
  const longDate = text.match(
    /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+20\d{2}/i
  );
  if (longDate) return longDate[0];

  // "6/10/26" or "06/10/2026"
  const shortDate = text.match(/\b\d{1,2}\/\d{1,2}\/(?:\d{2}|\d{4})\b/);
  if (shortDate) return shortDate[0];

  return undefined;
}

/** Extract price data like "WTI 93.68 +1.9" from text */
function extractPrices(text: string): { label: string; value: string; change?: string }[] | undefined {
  const prices: { label: string; value: string; change?: string }[] = [];

  // Pattern: "WTI 93.68 +1.9" or "WTI\r\n93.68\r\n+1.9"
  const crudeSection = text.match(/Crude Oil[\s\S]{0,200}?(WTI|Brent|Louisiana Light)[\s\S]{0,300}?Gasoline/i);
  const targetText = crudeSection ? crudeSection[0] : text.slice(0, 4000);

  // Match crude oil names followed by price
  const crudePattern = /(WTI|Brent|Louisiana Light|LLS|Dubai|Oman|Urals)[\s\r\n]*(\d{2,3}\.\d{2})[\s\r\n]*([+-]\d+\.\d+)?/gi;
  let match;
  while ((match = crudePattern.exec(targetText)) !== null) {
    prices.push({
      label: match[1].trim(),
      value: `$${match[2]}`,
      change: match[3] ? `${match[3]}%` : undefined,
    });
    if (prices.length >= 10) break;
  }

  return prices.length > 0 ? prices : undefined;
}
