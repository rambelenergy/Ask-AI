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
  // Crude oil
  "eia.gov/todayinenergy/prices.php",
  "oilprice.com",
  "tradingeconomics.com/commodity",
  "oilmarketcap.com",
  "markets.businessinsider.com/commodities",
  // Natural gas
  "eia.gov/naturalgas",
  "eia.gov/dnav/ng",
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
    const timeout = setTimeout(() => controller.abort(), 8000);

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
  // Always include EIA prices page if any EIA URL is present
  const targets = urls.filter(isDynamicPriceUrl);
  
  // Ensure EIA prices.php is always fetched first (highest priority)
  const eiaPriceUrl = urls.find(u => u.includes("eia.gov/todayinenergy/prices.php"));
  if (eiaPriceUrl && !targets.includes(eiaPriceUrl)) {
    targets.unshift(eiaPriceUrl);
  }
  
  // Debug: log what we're about to fetch
  if (process.env.NODE_ENV === 'development') {
    console.log('[fetchLivePrices] input URLs:', urls.length, 'matched:', targets.length);
    console.log('[fetchLivePrices] targets:', targets.slice(0, 5).join('\n  '));
  }
  
  const finalTargets = targets.slice(0, 5);
  if (finalTargets.length === 0) return [];

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

/** Extract price data like "WTI 93.68 +1.9" or "Henry Hub 3.27" from text */
function extractPrices(text: string): { label: string; value: string; change?: string }[] | undefined {
  const prices: { label: string; value: string; change?: string }[] = [];

  // Crude oil
  const crudeSection = text.match(/Crude Oil[\s\S]{0,200}?(WTI|Brent|Louisiana Light)[\s\S]{0,300}?Gasoline/i);
  const targetText = crudeSection ? crudeSection[0] : text.slice(0, 6000);
  const crudeRe = /(WTI|Brent|Louisiana Light|LLS|Dubai|Oman|Urals)[\s\r\n]*(\d{2,3}\.\d{2})[\s\r\n]*([+-]\d+\.\d+)?/gi;
  let cm = crudeRe.exec(targetText);
  while (cm !== null) {
    prices.push({ label: cm[1].trim(), value: `$${cm[2]}`, change: cm[3] ? `${cm[3]}%` : undefined });
    if (prices.length >= 10) break;
    cm = crudeRe.exec(targetText);
  }

  // Natural gas
  const gasRe = /(Henry Hub|Natural Gas|Nat Gas|TTF|NBP|JKM)[\s\r\n]*(\d{1,2}\.\d{2})[\s\r\n]*([+-]\d+\.\d+)?/gi;
  let gm = gasRe.exec(text.slice(0, 6000));
  while (gm !== null) {
    if (!prices.some(p => p.label === gm![1].trim())) {
      prices.push({ label: gm![1].trim(), value: `$${gm![2]}`, change: gm![3] ? `${gm![3]}%` : undefined });
    }
    if (prices.length >= 15) break;
    gm = gasRe.exec(text.slice(0, 6000));
  }

  return prices.length > 0 ? prices : undefined;
}
