import { searchWithLangSearch, type LangSearchResult } from "./langsearch";
import { isApprovedDomain, getPriorityGroupByUrl } from "./trusted-sources";
import { expandEnergyQuery } from "./expand-query";
import { rerankByEmbedding } from "./embed";
import { getGlossaryTerms } from "./energy-glossary";
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
      // Keep the one with summary, or longer content
      const currentHasSummary = !!(r.summary && r.summary.length > 50);
      const existingHasSummary = !!(existing.summary && existing.summary.length > 50);
      if (currentHasSummary && !existingHasSummary) {
        seen.set(key, r);
      } else if (!currentHasSummary && !existingHasSummary) {
        // Keep longer snippet
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
}

export async function searchTrustedSources(
  question: string,
  language?: SupportedLanguage
): Promise<{ results: TrustedSearchResult[]; debug: SearchDebugInfo }> {
  // Step 1: Expand query (pass language for non-English English keyword injection)
  const expandedQueries = expandEnergyQuery(question, language);

  // Step 2: Search all expanded queries (max 5 beyond original)
  const searchQueries = expandedQueries.slice(0, 6);
  const allRawResults: LangSearchResult[] = [];
  const domainsFound = new Set<string>();

  for (const query of searchQueries) {
    try {
      const results = await searchWithLangSearch(query);
      for (const r of results) {
        allRawResults.push(r);
        domainsFound.add(extractDomain(r.url));
      }
    } catch {
      // Continue with other queries if one fails
      continue;
    }
  }

  // If ALL queries failed, return empty
  if (allRawResults.length === 0) {
    return {
      results: [],
      debug: {
        originalQuestion: question,
        expandedQueries,
        rawResultsCount: 0,
        trustedFilteredCount: 0,
        domainsFound: [],
      },
    };
  }

  // Step 3: Filter to approved trusted domains; fallback to all if none approved
  const approved = allRawResults.filter((r) => isApprovedDomain(r.url));
  const useFallback = approved.length === 0;
  const results = useFallback ? allRawResults : approved;

  // Step 4: Map + deduplicate
  const mapped: TrustedSearchResult[] = results.map((r) => {
    const domain = extractDomain(r.url);
    const isTrusted = isApprovedDomain(r.url);
    const group = isTrusted ? getPriorityGroupByUrl(r.url) : null;
    return {
      title: r.title,
      url: r.url,
      domain,
      priority: group?.priority ?? (useFallback ? 99 : 99),
      priorityGroup: group?.name ?? (useFallback ? "General Web Search" : "Other"),
      snippet: r.snippet,
      summary: r.summary,
      trusted: isTrusted,
    };
  });

  // Step 5: Deduplicate by URL
  const deduped = deduplicateByUrl(mapped);

  // Step 6: Sort by: trusted first → relevance score → priority group
  deduped.sort((a, b) => {
    // Trusted sources first
    if (a.trusted !== b.trusted) return a.trusted ? -1 : 1;
    // Then by relevance keyword match count (descending)
    const relA = relevanceScore(a);
    const relB = relevanceScore(b);
    if (relA !== relB) return relB - relA;
    // Then by priority group (lower = better)
    if (a.priority !== b.priority) return a.priority - b.priority;
    return 0;
  });

  // Step 7: Re-rank by semantic similarity using embedding model
  // Falls back gracefully to priority order if embedding is unavailable
  const reranked = await rerankByEmbedding(question, deduped);

  const final = reranked.slice(0, 8);

  return {
    results: final,
    debug: {
      originalQuestion: question,
      expandedQueries,
      rawResultsCount: allRawResults.length,
      trustedFilteredCount: final.length,
      domainsFound: Array.from(domainsFound),
    },
  };
}
