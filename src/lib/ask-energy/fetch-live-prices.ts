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
  // Primary crude oil comparison sources (always fetched for price queries)
  "eia.gov/todayinenergy/prices.php",
  "tradingeconomics.com/commodity/crude-oil",
  "tradingeconomics.com/commodity/brent-crude-oil",
  // oilprice.com main page is JS-rendered; use RSS feed for price extraction
  "oilprice.com/rss/main",
  // Other dynamic sources
  "tradingeconomics.com/commodity",
  "oilprice.com",
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
  
  // Ensure all three primary comparison sources are included for price queries
  const PRIMARY_COMPARISON_SOURCES = [
    "eia.gov/todayinenergy/prices.php",
    "tradingeconomics.com/commodity/crude-oil",
    "oilprice.com/rss/main",
  ];
  
  for (const source of PRIMARY_COMPARISON_SOURCES) {
    if (!targets.some(t => t.includes(source))) {
      // Wait until we find a matching URL from search results, or use default
      const match = urls.find(u => u.includes(source));
      if (match) {
        targets.unshift(match);
      }
    }
  }
  
  // Debug: log what we're about to fetch
  if (process.env.NODE_ENV === 'development') {
    console.log('[fetchLivePrices] input URLs:', urls.length, 'matched:', targets.length);
    console.log('[fetchLivePrices] targets:', targets.slice(0, 5).join('\n  '));
  }
  
  const finalTargets = targets.slice(0, 5);
  if (finalTargets.length === 0) return [];

  const results = await Promise.allSettled(
    finalTargets.map((url) => fetchLivePricePage(url))
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

/** Extract price data like "WTI 93.68 +1.9" or "fell to 84.88 USD/Bbl" from text */
function extractPrices(text: string): { label: string; value: string; change?: string }[] | undefined {
  const prices: { label: string; value: string; change?: string }[] = [];

  // Pattern 1: Standard label + price format (EIA: "WTI 93.68 +1.2")
  const crudeRe = /(WTI|Brent|Louisiana Light|LLS|Dubai|Oman|Urals)[\s\r\n]*(\d{2,3}\.\d{2})[\s\r\n]*([+-]\d+\.\d+)?/gi;
  let cm = crudeRe.exec(text.slice(0, 8000));
  while (cm !== null) {
    const label = cm[1].trim();
    if (!prices.some(p => p.label === label)) {
      prices.push({ label, value: `$${cm[2]}`, change: cm[3] ? `${cm[3]}%` : undefined });
    }
    if (prices.length >= 10) break;
    cm = crudeRe.exec(text.slice(0, 8000));
  }

  // Pattern 2: "fell to 84.88 USD/Bbl" or "to $84.88 per barrel" (TradingEconomics style)
  const priceContextRe = /(?:fell|dropped|rose|trading|at|to|around)\s+(?:to\s+)?\$?(\d{2,3}\.\d{2})\s*(?:USD\/Bbl|per barrel|\$)/gi;
  const contextCrudeRe = /(WTI|Brent|Crude Oil|Crude|West Texas)[\s\S]{0,100}?(?:fell|dropped|rose|trading|at|to|around)\s+(?:to\s+)?\$?(\d{2,3}\.\d{2})\s*(?:USD\/Bbl|per barrel)/gi;
  let cm2 = contextCrudeRe.exec(text.slice(0, 8000));
  while (cm2 !== null) {
    let label = cm2[1].trim();
    if (label === 'Crude Oil' || label === 'Crude') label = 'WTI';
    if (label === 'West Texas') label = 'WTI';
    if (!prices.some(p => p.label === label)) {
      prices.push({ label, value: `$${cm2[2]}`, change: undefined });
    }
    if (prices.length >= 10) break;
    cm2 = contextCrudeRe.exec(text.slice(0, 8000));
  }

  // Pattern 3: "Brent crude slipped below $90 per barrel... WTI fell to roughly $85–$87" (RSS/News style)
  const rssRe = /(Brent|WTI)\s+(?:crude\s+)?(?:slipped|fell|rose|trading|priced)\s+(?:below\s+)?\$?(\d{2,3})(?:[–-]\$?\d{2,3})?/gi;
  let cm3 = rssRe.exec(text.slice(0, 8000));
  while (cm3 !== null) {
    const label = cm3[1].trim();
    if (!prices.some(p => p.label === label)) {
      // RSS prices are approximate (single number like 90), add .00 for consistency
      prices.push({ label, value: `~$${cm3[2]}.00`, change: undefined });
    }
    if (prices.length >= 10) break;
    cm3 = rssRe.exec(text.slice(0, 8000));
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
