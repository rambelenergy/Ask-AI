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
 * Recency score: 1.0 for <1 day old, tapering to 0 for >30 days.
 * Newer content gets a multiplicative boost in sorting.
 * Also checks content for embedded dates and PENALIZES stale data — especially PDFs.
 */
function recencyScore(result: TrustedSearchResult): number {
  // Primary: Brave age field
  const hours = parseAgeHours(result.age);
  let score = 1.0;

  if (hours !== null) {
    if (hours <= 24) score = 1.0;
    else if (hours <= 24 * 30) score = 1.0 - 0.15 * ((hours - 24) / (24 * 29));
    else score = 0.85;
  }

  // Secondary: check content for embedded old dates
  const contentText = `${result.title} ${result.snippet ?? ""} ${result.summary ?? ""}`;
  const contentYear = extractContentYear(contentText);
  const isPdf = result.url.toLowerCase().endsWith(".pdf");

  if (contentYear !== null) {
    const currentYear = new Date().getFullYear();
    if (contentYear < currentYear) {
      const yearDiff = currentYear - contentYear;
      if (yearDiff >= 2) {
        score *= 0.15;  // 2+ years old → near-zero
      } else if (yearDiff >= 1) {
        score *= 0.25;  // 1 year old → massive penalty
      } else if (yearDiff > 0) {
        score *= 0.5;   // fractional (old month in current year)
      }
    }
  }

  // Tertiary: PDFs → extra penalty (rarely real-time data)
  if (isPdf) {
    if (hours === null || hours > 24 * 7) {
      score *= 0.4;
    }
  }

  return score;
}

/**
 * Extract a year from content text (e.g., "2025 annual report", "June 2024").
 * Also detects "data through [Month] [Year]", "as of [date]", "published [date]".
 * Returns the year or null if no year found or year is in the future.
 */
function extractContentYear(text: string): number | null {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  // Match year patterns: 20xx
  const yearMatches = text.match(/\b(20[0-9]{2})\b/g);
  if (!yearMatches) return null;

  let latestYear: number | null = null;
  for (const m of yearMatches) {
    const y = parseInt(m, 10);
    if (y <= currentYear + 1 && (latestYear === null || y > latestYear)) {
      latestYear = y;
    }
  }

  // Check for explicit date context: "data through [Month] [Year]", "as of [date]"
  const monthNames = ["january","february","march","april","may","june",
    "july","august","september","october","november","december"];
  const dateCtx = text.match(/data through|as of|updated:|published:|report date|for the week ending/i);
  if (dateCtx && latestYear !== null) {
    const monthMatch = text.match(new RegExp(monthNames.join("|"), "i"));
    if (monthMatch) {
      const monthNum = monthNames.indexOf(monthMatch[0].toLowerCase()) + 1;
      if (latestYear < currentYear || (latestYear === currentYear && monthNum < currentMonth - 3)) {
        // Data is stale — set fractional year for stronger penalty
        if (latestYear === currentYear) {
          latestYear = currentYear - 0.5;
        }
      }
    }
  }

  return latestYear;
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
  const seen = new Set<string>();

  // Round-robin through priority groups until we fill maxResults
  const priorities = Array.from(byPriority.keys()).sort((a, b) => a - b);
  let idx = 0;

  while (final.length < maxResults && byPriority.size > 0) {
    const priority = priorities[idx % priorities.length];
    const group = byPriority.get(priority);

    if (group && group.length > 0) {
      const candidate = group.shift()!;
      const key = candidate.url.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
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

    // Safety: if we've done max rounds, just fill from whatever's left
    if (idx > maxResults * 3) {
      for (const remaining of results) {
        const key = remaining.url.toLowerCase();
        if (!seen.has(key) && final.length < maxResults) {
          seen.add(key);
          final.push(remaining);
        }
      }
      break;
    }
  }

  // If we didn't fill up, add remaining unique results
  if (final.length < maxResults) {
    for (const r of results) {
      const key = r.url.toLowerCase();
      if (!seen.has(key) && final.length < maxResults) {
        seen.add(key);
        final.push(r);
      }
    }
  }

  return final.slice(0, maxResults);
}
