import { searchWithLangSearch, type LangSearchResult } from "./langsearch";
import { searchWithBrave, detectFreshness } from "./brave-search";
import { isApprovedDomain, getPriorityGroupByUrl, getTrustedDomains, getTrustedDomainsForCategory } from "./trusted-sources";
import { expandEnergyQuery } from "./expand-query";
import { rerankByEmbedding, type CategoryBoost } from "./embed";
import { categorizeQuestion, getCategoryLabel, type QuestionCategory } from "./categorize-question";
import type { SupportedLanguage } from "./detect-language";

export interface TrustedSearchResult {
  title: string;
  url: string;
  domain: string;
  priority: number;
  priorityGroup: string;
  snippet?: string;
  summary?: string;
  trusted: boolean;
  /** Age of the result (e.g. "2 days ago", "1 hour ago") from Brave */
  age?: string;
}

/** Max results to return after all filtering, deduplication, and reranking */
const MAX_FINAL_RESULTS = 12;

/** Max expanded queries to search (original + N expanded) */
const MAX_EXPANDED_QUERIES = 4;

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Keywords that indicate high relevance for Algeria-Europe energy topics.
 * Used to boost ranking — more matched keywords = higher relevance score.
 */
const RELEVANCE_KEYWORDS = [
  "Algeria", "algeria", "Algérie", "algérie",
  "Europe", "europe", "European", "european",
  "Italy", "italy", "Italia", "italia",
  "Spain", "spain", "España", "españa",
  "France", "france",
  "MEDGAZ", "medgaz", "Medgaz",
  "NIGAL", "nigal",
  "TRANSMED", "transmed",
  "Sonatrach", "sonatrach", "SONATRACH",
  "ENI", "eni",
  "Naturgy", "naturgy",
  "gas", "Gas", "gaz", "Gaz",
  "natural gas", "Natural gas", "Natural Gas",
  "pipeline", "Pipeline", "gazoduc",
  "solar", "Solar", "solaire", "Solaire",
  "hydrogen", "Hydrogen", "hydrogène",
  "renewable", "Renewable",
  "energy security", "Energy security",
  "Sahara", "sahara",
  "cooperation", "Cooperation", "coopération",
  "partnership", "Partnership", "partenariat",
  "export", "Export",
];

/** Score a result by keyword relevance — more matched keywords = higher score */
function relevanceScore(result: TrustedSearchResult): number {
  const text = `${result.title} ${result.snippet ?? ""} ${result.summary ?? ""}`;
  let score = 0;
  for (const kw of RELEVANCE_KEYWORDS) {
    if (text.includes(kw)) score += 1;
  }
  return score;
}

/**
 * Parse a Brave age string into hours for recency scoring.
 * Examples: "1 hour ago" → 1, "2 days ago" → 48, "3 weeks ago" → 504
 * Returns null if unparseable.
 */
function parseAgeHours(age?: string): number | null {
  if (!age) return null;
  const match = age.match(/^(\d+(?:\.\d+)?)\s*(hour|minute|day|week|month|year)s?\s+ago/i);
  if (!match) return null;
  const num = parseFloat(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    minute: 1 / 60,
    hour: 1,
    day: 24,
    week: 24 * 7,
    month: 24 * 30,
    year: 24 * 365,
  };
  return num * (multipliers[unit] ?? 0);
}

/**
 * Recency score: 1.0 for <1 day old, tapering to near-zero for stale content.
 * Uses the Brave age field AND content-embedded dates to catch stale snippets.
 * KEY FIX: Extracts full dates (April 27, 2026) not just years, so same-year
 * but months-old data gets properly penalized.
 */
function recencyScore(result: TrustedSearchResult): number {
  const now = new Date();
  const todayTs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  let score = 1.0;

  // Primary: Brave age field (hours-old indexing)
  const hours = parseAgeHours(result.age);
  if (hours !== null) {
    if (hours <= 24) score = 1.0;
    else if (hours <= 24 * 30) score = 1.0 - 0.15 * ((hours - 24) / (24 * 29));
    else score = 0.85;
  }

  // Secondary: content-embedded full date check
  const contentText = `${result.title} ${result.snippet ?? ""} ${result.summary ?? ""}`;
  const contentDate = extractContentDate(contentText);
  const isPdf = result.url.toLowerCase().endsWith(".pdf");

  if (contentDate !== null) {
    // How many days between content date and today?
    const contentTs = Date.UTC(contentDate.year, contentDate.month - 1, contentDate.day);
    const daysOld = Math.floor((todayTs - contentTs) / (1000 * 60 * 60 * 24));

    if (daysOld > 0) {
      // Content date is in the past → apply age-based penalty
      if (daysOld <= 1) {
        // yesterday or today → no penalty
      } else if (daysOld <= 3) {
        score *= 0.7;   // 2-3 days old → mild penalty
      } else if (daysOld <= 7) {
        score *= 0.4;   // 4-7 days old → significant penalty
      } else if (daysOld <= 30) {
        score *= 0.15;  // 1-4 weeks old → near-zero
      } else {
        score *= 0.05;  // >1 month old → effectively zero
      }
    } else if (daysOld < 0) {
      // Content date is in the FUTURE (misconfigured source) → mild penalty
      score *= 0.5;
    }
  }

  // Tertiary: PDFs → extra penalty (rarely real-time data)
  if (isPdf) {
    if (hours === null || hours > 24 * 7) {
      score *= 0.3;
    }
  }

  return score;
}

/**
 * Extract a date from content text (e.g., "April 27, 2026", "2025-03-15").
 * Returns { year, month (1-12), day (1-31) } or null.
 */
function extractContentDate(text: string): { year: number; month: number; day: number } | null {
  const monthNames: Record<string, number> = {
    january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
    july: 7, august: 8, september: 9, october: 10, november: 11, december: 12
  };

  // Pattern 1: "April 27, 2026" or "April 27 2026" or "27 April 2026"
  const namedMonth = text.match(
    /(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(20\d{2})/i
  );
  if (namedMonth) {
    const month = monthNames[namedMonth[1].toLowerCase()];
    const day = parseInt(namedMonth[2], 10);
    const year = parseInt(namedMonth[3], 10);
    if (month && day >= 1 && day <= 31 && year >= 2020) return { year, month, day };
  }

  // Pattern 2: "27 April 2026" (day-first)
  const dayFirst = text.match(/(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(20\d{2})/i);
  if (dayFirst) {
    const month = monthNames[dayFirst[2].toLowerCase()];
    const day = parseInt(dayFirst[1], 10);
    const year = parseInt(dayFirst[3], 10);
    if (month && day >= 1 && day <= 31 && year >= 2020) return { year, month, day };
  }

  // Pattern 3: "2026-04-27" or "2026/04/27" (ISO-style)
  const iso = text.match(/(20\d{2})[\-\/](\d{1,2})[\-\/](\d{1,2})/);
  if (iso) {
    const year = parseInt(iso[1], 10);
    const month = parseInt(iso[2], 10);
    const day = parseInt(iso[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2020) return { year, month, day };
  }

  // Pattern 4: Just a year — less useful but fallback
  const yearOnly = text.match(/\b(20[0-9]{2})\b/);
  if (yearOnly) {
    const year = parseInt(yearOnly[1], 10);
    if (year >= 2020) return { year, month: 1, day: 1 }; // year-only, assume Jan 1 for penalty
  }

  return null;
}

/** Deduplicate results by URL, keeping the one with more content (summary > snippet) */
function deduplicateByUrl(results: TrustedSearchResult[]): TrustedSearchResult[] {
  const seen = new Map<string, TrustedSearchResult>();
  for (const r of results) {
    const key = r.url.toLowerCase();
    const existing = seen.get(key);
    if (!existing) {
      seen.set(key, r);
    } else {
      const currentHasSummary = !!(r.summary && r.summary.length > 50);
      const existingHasSummary = !!(existing.summary && existing.summary.length > 50);
      if (currentHasSummary && !existingHasSummary) {
        seen.set(key, r);
      } else if (!currentHasSummary && !existingHasSummary) {
        const curLen = r.snippet?.length ?? 0;
        const existLen = existing.snippet?.length ?? 0;
        if (curLen > existLen) seen.set(key, r);
      }
    }
  }
  return Array.from(seen.values());
}

export interface SearchDebugInfo {
  originalQuestion: string;
  expandedQueries: string[];
  rawResultsCount: number;
  trustedFilteredCount: number;
  domainsFound: string[];
  /** Whether results came from trusted sources (true) or alternative fallback (false) */
  fromTrustedSources: boolean;
  /** Question category used for domain ordering and rerank boost */
  questionCategory?: string;
  categoryConfidence?: number;
}

/**
 * Map raw search results (Brave or LangSearch) to TrustedSearchResult.
 * Results from Brave with site: filter are always trusted.
 * Results from LangSearch (fallback) are checked against the trusted domain list.
 */
function mapToTrustedResults(
  rawResults: LangSearchResult[],
  isTrustedSearch: boolean
): TrustedSearchResult[] {
  return rawResults.map((r) => {
    const domain = extractDomain(r.url);
    const isApproved = isTrustedSearch || isApprovedDomain(r.url);
    const group = isApproved ? getPriorityGroupByUrl(r.url) : null;
    return {
      title: r.title,
      url: r.url,
      domain,
      priority: group?.priority ?? 99,
      priorityGroup: group?.name ?? "General Web Search",
      snippet: r.snippet,
      summary: r.summary,
      trusted: isApproved,
      age: r.age,
    };
  });
}

/**
 * Search trusted energy sources with Brave + LangSearch in parallel.
 *
 * Flow:
 *  1. Brave Search with `site:` filter → trusted domains only
 *  2. LangSearch in parallel → broader search to capture government TLD domains
 *     and other trusted sources not in the explicit domain list
 *  3. Merge + deduplicate + filter + rerank results from both
 *
 * Running both in parallel ensures government TLD domains (.gov, .gov.dz,
 * .gov.it, .gov.pt, .gov.de, .gov.es, .eu) are always captured alongside
 * the explicitly listed trusted sources.
 */
export async function searchTrustedSources(
  question: string,
  language?: SupportedLanguage,
  signal?: AbortSignal
): Promise<{
  results: TrustedSearchResult[];
  debug: SearchDebugInfo;
  fromTrustedSources: boolean;
}> {
  const expandedQueries = expandEnergyQuery(question, language);
  const searchQueries = expandedQueries.slice(0, MAX_EXPANDED_QUERIES);

  // ─── Map language to search engine language codes ───
  const langCodes: Record<string, string> = {
    English: "en", Arabic: "ar", French: "fr",
    Spanish: "es", Italian: "it", German: "de",
  };
  const searchLang = language ? (langCodes[language] ?? "en") : "en";

  // ─── Categorize question for context-aware prioritization ───
  const categoryResult = categorizeQuestion(question, language);
  const { category, confidence, priorityBoost, preferredGroups } = categoryResult;

  // Reorder trusted domains: category-preferred groups first
  const trustedDomains = getTrustedDomainsForCategory(preferredGroups);

  // ─── Detect freshness for time-sensitive queries ───
  const braveFreshness = detectFreshness(question);
  // Map Brave freshness to LangSearch freshness
  const freshnessMap: Record<string, string> = {
    pd: "Day",
    pw: "Week",
    pm: "Month",
  };
  const langFreshness = braveFreshness ? (freshnessMap[braveFreshness] ?? "noLimit") : "noLimit";

  // ─── Phase 1: Run Brave (site: filter) + LangSearch in parallel ───
  let braveRaw: LangSearchResult[] = [];
  let langRaw: LangSearchResult[] = [];
  const domainsFound = new Set<string>();

  // Brave search (trusted domains only, with freshness)
  const bravePromise = (async () => {
    for (const q of searchQueries) {
      try {
        const braveResults = await searchWithBrave(q, trustedDomains, signal, braveFreshness, searchLang);
        if (braveResults.length > 0) {
          for (const r of braveResults) {
            braveRaw.push({
              title: r.title,
              url: r.url,
              snippet: r.snippet ?? r.description,
              age: r.age,
            });
            domainsFound.add(extractDomain(r.url));
          }
        }
        if (braveRaw.length >= 10) break;
      } catch {
        // Graceful — LangSearch will cover
      }
    }
  })();

  // LangSearch in parallel (broader search to capture government TLDs, with freshness)
  const langPromise = (async () => {
    for (const q of searchQueries) {
      try {
        const langResults = await searchWithLangSearch(q, signal, langFreshness, searchLang);
        if (langResults.length > 0) {
          for (const r of langResults) {
            langRaw.push(r);
            domainsFound.add(extractDomain(r.url));
          }
        }
        if (langRaw.length >= 10) break;
      } catch {
        // Graceful
      }
    }
  })();

  await Promise.allSettled([bravePromise, langPromise]);

  // ─── Merge: Brave results (trusted) + LangSearch results filtered by approved domains ───
  // Brave results with site: filter are always trusted
  const braveMapped = mapToTrustedResults(braveRaw, true);

  // LangSearch results: only keep those matching trusted domains or government TLDs
  const langMapped = mapToTrustedResults(langRaw, false);
  const langFiltered = langMapped.filter((r) => r.trusted);

  // Merge all, prefer Brave results in deduplication (they used site: filter)
  const allRaw = [...braveMapped, ...langFiltered];

  // If too few trusted results (<5), supplement with top untrusted LangSearch results
  // Apply domain diversity: max 2 per domain to prevent single-source dominance
  const MIN_TRUSTED = 5;
  if (allRaw.length < MIN_TRUSTED && langMapped.length > langFiltered.length) {
    const untrusted = langMapped
      .filter((r) => !r.trusted)
      .sort((a, b) => (b.snippet?.length ?? 0) - (a.snippet?.length ?? 0));
    const domainCount = new Map<string, number>();
    for (const r of untrusted) {
      const dom = r.domain;
      const count = domainCount.get(dom) ?? 0;
      if (count < 2) {
        domainCount.set(dom, count + 1);
        allRaw.push(r);
      }
      if (allRaw.length >= 8) break;
    }
  }

  // ─── No results at all ───
  if (allRaw.length === 0) {
    return {
      results: [],
      fromTrustedSources: false,
      debug: {
        originalQuestion: question,
        expandedQueries,
        rawResultsCount: 0,
        trustedFilteredCount: 0,
        domainsFound: [],
        fromTrustedSources: false,
        questionCategory: getCategoryLabel(category),
        categoryConfidence: confidence,
      },
    };
  }

  const hasBraveResults = braveMapped.length > 0;
  const fromTrustedSources = hasBraveResults || langFiltered.length > 0;

  // ─── Deduplicate + sort + rerank ───
  const deduped = deduplicateByUrl(allRaw);

  deduped.sort((a, b) => {
    // 1. Trusted sources first
    if (a.trusted !== b.trusted) return a.trusted ? -1 : 1;
    // 2. Recency boost — newer results first (checks both age field AND content dates)
    const recA = recencyScore(a);
    const recB = recencyScore(b);
    if (recA !== recB) return recB - recA;
    // 3. Keyword relevance
    const relA = relevanceScore(a);
    const relB = relevanceScore(b);
    if (relA !== relB) return relB - relA;
    // 4. Priority group
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  // ─── Re-rank with priority-weighted embedding + category boost ───
  const reranked = await rerankByEmbedding(question, deduped, priorityBoost);

  // ─── Ensure priority diversity (not all from one source type) ───
  const final = ensurePriorityDiversity(reranked, MAX_FINAL_RESULTS);

  return {
    results: final,
    fromTrustedSources,
    debug: {
      originalQuestion: question,
      expandedQueries,
      rawResultsCount: allRaw.length,
      trustedFilteredCount: final.length,
      domainsFound: Array.from(domainsFound),
      fromTrustedSources,
      questionCategory: getCategoryLabel(category),
      categoryConfidence: confidence,
    },
  };
}

/**
 * Ensure results include diversity across priority groups.
 * Prevents the reranker from pulling too heavily from one source type
 * (e.g., news agencies dominating over institutional sources).
 *
 * Strategy: interleave — take top results but guarantee representation
 * from each priority level that has available results.
 */
function ensurePriorityDiversity(
  results: TrustedSearchResult[],
  maxResults: number
): TrustedSearchResult[] {
  if (results.length <= maxResults) return results;

  // Group results by priority
  const byPriority = new Map<number, TrustedSearchResult[]>();
  for (const r of results) {
    const p = r.priority;
    if (!byPriority.has(p)) byPriority.set(p, []);
    byPriority.get(p)!.push(r);
  }

  const final: TrustedSearchResult[] = [];
  const seenUrls = new Set<string>();
  const domainCount = new Map<string, number>(); // per-domain limit
  const MAX_PER_DOMAIN = 3;

  // Round-robin through priority groups until we fill maxResults
  const priorities = Array.from(byPriority.keys()).sort((a, b) => a - b);
  let idx = 0;

  while (final.length < maxResults && byPriority.size > 0) {
    const priority = priorities[idx % priorities.length];
    const group = byPriority.get(priority);

    if (group && group.length > 0) {
      const candidate = group.shift()!;
      const urlKey = candidate.url.toLowerCase();
      const dom = candidate.domain;
      const domCount = domainCount.get(dom) ?? 0;

      if (!seenUrls.has(urlKey) && domCount < MAX_PER_DOMAIN) {
        seenUrls.add(urlKey);
        domainCount.set(dom, domCount + 1);
        final.push(candidate);
      }
    } else {
      // This priority group exhausted — remove it
      byPriority.delete(priority);
      priorities.splice(priorities.indexOf(priority), 1);
      if (priorities.length === 0) break;
      idx = 0;
      continue;
    }

    idx++;

    // Safety: if we've done max rounds, fill from whatever's left
    if (idx > maxResults * 3) {
      for (const remaining of results) {
        const urlKey = remaining.url.toLowerCase();
        if (!seenUrls.has(urlKey) && final.length < maxResults) {
          seenUrls.add(urlKey);
          final.push(remaining);
        }
      }
      break;
    }
  }

  // If we didn't fill up, add remaining unique results (respecting domain limit)
  if (final.length < maxResults) {
    for (const r of results) {
      const urlKey = r.url.toLowerCase();
      const domCount = domainCount.get(r.domain) ?? 0;
      if (!seenUrls.has(urlKey) && final.length < maxResults && domCount < MAX_PER_DOMAIN) {
        seenUrls.add(urlKey);
        domainCount.set(r.domain, domCount + 1);
        final.push(r);
      }
    }
  }

  return final.slice(0, maxResults);
}
