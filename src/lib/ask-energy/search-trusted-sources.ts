import { searchWithLangSearch, type LangSearchResult } from "./langsearch";
import { searchWithBrave } from "./brave-search";
import { isApprovedDomain, getPriorityGroupByUrl, getTrustedDomains } from "./trusted-sources";
import { expandEnergyQuery } from "./expand-query";
import { rerankByEmbedding } from "./embed";
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
    };
  });
}

/**
 * Search trusted energy sources with Brave (primary) → LangSearch (fallback).
 *
 * Flow:
 *  1. Brave Search with `site:` filter → only trusted domains
 *  2. If results found → return immediately
 *  3. If empty → fallback to LangSearch (broader search)
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
  const trustedDomains = getTrustedDomains(); // already ordered by priority

  // ─── Phase 1: Brave Search with site: filter ───
  let allRawResults: LangSearchResult[] = [];
  const domainsFound = new Set<string>();
  let fromTrustedSources = true;

  for (const q of searchQueries) {
    try {
      const braveResults = await searchWithBrave(q, trustedDomains, signal);
      if (braveResults.length > 0) {
        for (const r of braveResults) {
          allRawResults.push({
            title: r.title,
            url: r.url,
            snippet: r.snippet ?? r.description,
          });
          domainsFound.add(extractDomain(r.url));
        }
      }
    } catch {
      // Brave failed — will fall back to LangSearch
    }
    // Got good results, skip remaining queries to save API calls
    if (allRawResults.length >= 10) break;
  }

  // ─── Phase 2: Fallback to LangSearch if trusted sources returned nothing ───
  if (allRawResults.length === 0) {
    fromTrustedSources = false;

    for (const q of searchQueries) {
      try {
        const langResults = await searchWithLangSearch(q, signal);
        for (const r of langResults) {
          allRawResults.push(r);
          domainsFound.add(extractDomain(r.url));
        }
        if (langResults.length > 0) break;
      } catch {
        // Graceful
      }
    }
  }

  // ─── No results at all ───
  if (allRawResults.length === 0) {
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
      },
    };
  }

  // ─── Map + deduplicate + sort + rerank ───
  const mapped = mapToTrustedResults(allRawResults, fromTrustedSources);
  const deduped = deduplicateByUrl(mapped);

  deduped.sort((a, b) => {
    if (a.trusted !== b.trusted) return a.trusted ? -1 : 1;
    const relA = relevanceScore(a);
    const relB = relevanceScore(b);
    if (relA !== relB) return relB - relA;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  // ─── Re-rank with priority-weighted embedding ───
  const reranked = await rerankByEmbedding(question, deduped);

  // ─── Ensure priority diversity (not all from one source type) ───
  const final = ensurePriorityDiversity(reranked, MAX_FINAL_RESULTS);

  return {
    results: final,
    fromTrustedSources,
    debug: {
      originalQuestion: question,
      expandedQueries,
      rawResultsCount: allRawResults.length,
      trustedFilteredCount: final.length,
      domainsFound: Array.from(domainsFound),
      fromTrustedSources,
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
