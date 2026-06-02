import type { SupportedLanguage } from "./detect-language";

/**
 * Expand short/broad user questions into energy-focused search queries.
 * Designed for RamBelEnergy's Algeria-Europe energy intelligence focus.
 *
 * For non-English queries, appends English-translated energy keywords
 * to improve search result quality from LangSearch.
 */

// Keywords that suggest the question is already specific enough
const SPECIFIC_INDICATORS = [
  "how", "why", "what is", "what are", "explain", "describe",
  "compare", "difference", "impact", "effect", "role", "importance",
  "benefit", "challenge", "risk", "strategy", "policy", "regulation",
  "investment", "price", "cost", "capacity", "export", "import",
  "cooperation", "partnership", "agreement", "deal", "project",
  "pipeline", "production", "consumption", "forecast", "trend",
  "market", "trade", "infrastructure", "technology",
];

// Energy context keywords that already provide good search context
const ENERGY_CONTEXT_KEYWORDS = [
  "energy", "gas", "solar", "hydrogen", "oil", "renewable",
  "pipeline", "electricity", "power", "fuel", "carbon",
  "emission", "climate", "photovoltaic", "wind", "biomass",
  "geothermal", "lng", "natural gas", "green hydrogen",
];

// Country/region aliases for expanding queries
const REGION_MAP: Record<string, { name: string; related: string[] }> = {
  algeria: { name: "Algeria", related: ["Sonatrach", "North Africa", "Maghreb", "Sahara", "Mediterranean"] },
  italy: { name: "Italy", related: ["ENI", "Southern Europe", "Mediterranean", "European Union"] },
  spain: { name: "Spain", related: ["Iberian", "Southern Europe", "Mediterranean", "European Union"] },
  france: { name: "France", related: ["TotalEnergies", "Western Europe", "European Union"] },
  germany: { name: "Germany", related: ["Central Europe", "European Union"] },
  portugal: { name: "Portugal", related: ["Iberian", "Southern Europe", "European Union"] },
  tunisia: { name: "Tunisia", related: ["North Africa", "Maghreb"] },
  morocco: { name: "Morocco", related: ["North Africa", "Maghreb"] },
  libya: { name: "Libya", related: ["North Africa"] },
  egypt: { name: "Egypt", related: ["North Africa", "Eastern Mediterranean"] },
  europe: { name: "Europe", related: ["European Union", "EU", "Mediterranean"] },
  sahara: { name: "Sahara", related: ["Algerian Sahara", "desert solar", "North Africa"] },
  mediterranean: { name: "Mediterranean", related: ["Southern Europe", "North Africa"] },
};

export function expandEnergyQuery(userQuestion: string, language?: SupportedLanguage): string[] {
  const trimmed = userQuestion.trim();

  // Always include the original question as the first query
  const queries: string[] = [trimmed];
  const seen = new Set<string>([trimmed.toLowerCase()]);

  const addUnique = (q: string) => {
    const lower = q.toLowerCase();
    if (!seen.has(lower) && q.length > 3) {
      seen.add(lower);
      queries.push(q);
    }
  };

  // Check if the question already has specific intent words
  const lower = trimmed.toLowerCase();
  const wordCount = trimmed.split(/\s+/).length;
  const hasSpecificIntent = SPECIFIC_INDICATORS.some((ind) =>
    lower.startsWith(ind)
  );
  const hasEnergyContext = ENERGY_CONTEXT_KEYWORDS.some((kw) =>
    lower.includes(kw)
  );

  // If question is already specific AND has energy terms, don't over-expand
  if (hasSpecificIntent && hasEnergyContext && wordCount >= 5) {
    // Just add minimal variants
    addUnique(`${trimmed} Algeria Europe`);
    return queries;
  }

  // If short or missing energy context, expand
  if (wordCount <= 4 || !hasEnergyContext) {
    // Detect entities in the query (countries, regions)
    const words = trimmed.split(/\s+/).map((w) => w.replace(/[?,.;:!]+$/, "").toLowerCase());
    const entities: string[] = [];

    for (const word of words) {
      if (REGION_MAP[word]) {
        entities.push(REGION_MAP[word].name);
        // Add related entities for expansion
        for (const rel of REGION_MAP[word].related.slice(0, 2)) {
          if (!entities.includes(rel)) entities.push(rel);
        }
      }
    }

    // Build energy-focused expansions based on detected entities
    if (entities.length >= 1) {
      const primary = entities[0];
      const secondary = entities.length >= 2 ? entities[1] : "Europe";

      // Energy cooperation queries
      if (primary !== secondary) {
        addUnique(`${primary} ${secondary} energy cooperation`);
        addUnique(`${primary} ${secondary} gas exports`);
        addUnique(`${primary} ${secondary} natural gas`);
        addUnique(`${primary} ${secondary} energy security`);
        addUnique(`${primary} ${secondary} renewable energy`);
      }

      // Algeria-specific energy queries
      if (primary === "Algeria" || entities.some((e) => e === "Algeria" || e === "Sonatrach")) {
        addUnique(`${trimmed} energy Algeria Europe`);
        addUnique(`Algeria energy cooperation ${secondary}`);
        addUnique(`Algeria ${secondary} gas pipeline`);
      }

      // Sahara / solar queries
      if (primary === "Sahara" || entities.includes("Sahara") || lower.includes("sahara")) {
        addUnique(`Algerian Sahara solar energy potential`);
        addUnique(`Algeria desert solar renewable energy`);
        addUnique(`Algeria solar energy Europe electricity export`);
      }

      // Hydrogen queries
      if (lower.includes("hydrogen") || entities.includes("hydrogen")) {
        addUnique(`Algeria green hydrogen ${secondary} cooperation`);
        addUnique(`Algeria hydrogen Europe export pipeline`);
      }

      // Generic energy expansion with entities
      addUnique(`${primary} ${secondary} energy collaboration`);
      addUnique(`${trimmed} energy cooperation`);
    } else {
      // No known entities — append energy/Algeria context
      addUnique(`${trimmed} energy Algeria Europe`);
      addUnique(`${trimmed} Algeria energy security`);
      addUnique(`${trimmed} natural gas energy cooperation`);
      addUnique(`Algeria ${trimmed} energy`);
    }
  }

  // Always add Algeria-Europe context if not present
  const allQueries = queries.join(" ");
  const hasAlgeria = /\balgeria\b/i.test(allQueries);
  const hasEurope = /\beurope\b|\beu\b/i.test(allQueries);
  if (!hasAlgeria) {
    addUnique(`${trimmed} Algeria`);
    addUnique(`Algeria energy ${trimmed}`);
  }
  if (!hasEurope && !hasAlgeria) {
    addUnique(`${trimmed} energy cooperation Europe`);
  }

  // For non-English queries, always inject English energy search terms
  // to improve LangSearch result quality
  if (language && language !== "English" && language !== "Unknown") {
    // Add pure English keyword search for better web results
    const englishKeywords = getEnglishEnergySearch(trimmed, language);
    for (const ek of englishKeywords) {
      addUnique(ek);
    }
  }

  return queries.slice(0, 6); // max 6 queries (original + 5 expanded)
}

/**
 * Generate English energy search keywords from non-English questions.
 * Extracts named entities (countries, companies, energy terms) and
 * builds focused English queries for better LangSearch results.
 */
function getEnglishEnergySearch(question: string, language: SupportedLanguage): string[] {
  const lower = question.toLowerCase();
  const queries: string[] = [];

  // Detect known entities regardless of language
  const detectedEntities: string[] = [];
  for (const [key, info] of Object.entries(REGION_MAP)) {
    if (lower.includes(key)) {
      detectedEntities.push(info.name);
      for (const rel of info.related.slice(0, 2)) {
        if (!detectedEntities.includes(rel)) detectedEntities.push(rel);
      }
    }
  }

  // Also check common multilingual terms
  const multilingualChecks: [RegExp, string][] = [
    [/\balg[eé]rie\b/i, "Algeria"],
    [/\bitali[ae]\b/i, "Italy"],
    [/\beurop[aeé]\b/i, "Europe"],
    [/\bespa[gñ][a-z]*\b/i, "Spain"],
    [/\bfran[çc][a-z]*\b/i, "France"],
    [/\bgaz\b/i, "natural gas"],
    [/\bgas\b/i, "natural gas"],
    [/\b[sś]olaire\b/i, "solar energy"],
    [/\b[ée]nerg[ií]a\b/i, "energy"],
    [/\b[ée]nerg[ée]tique\b/i, "energy"],
    [/\b[ée]nergie\b/i, "energy"],
    [/\bs[ée]curit[ée]\b/i, "security"],
    [/\bseguridad\b/i, "security"],
    [/\bsicurezza\b/i, "security"],
    [/\bhidr[oó]geno\b/i, "hydrogen"],
    [/\bhidrog[eè]ne\b/i, "hydrogen"],
    [/\bidrogeno\b/i, "hydrogen"],
    [/\bcoop[ée]ration\b/i, "cooperation"],
    [/\bcooperaci[oó]n\b/i, "cooperation"],
    [/\bcooperazione\b/i, "cooperation"],
    [/\br[uô]le\b/i, "role"],
    [/\br[oó]l\b/i, "role"],
    [/\bruolo\b/i, "role"],
    [/\bpapel\b/i, "role"],
  ];

  for (const [regex, term] of multilingualChecks) {
    if (regex.test(lower) && !detectedEntities.includes(term)) {
      detectedEntities.push(term);
    }
  }

  if (detectedEntities.length >= 2) {
    const a = detectedEntities[0];
    const b = detectedEntities[1];
    queries.push(`${a} ${b} energy cooperation`);
    queries.push(`${a} ${b} natural gas exports`);
    queries.push(`${a} ${b} energy security`);
  } else if (detectedEntities.length === 1) {
    queries.push(`${detectedEntities[0]} energy cooperation Europe`);
    queries.push(`${detectedEntities[0]} natural gas exports`);
    queries.push(`${detectedEntities[0]} renewable energy`);
  } else {
    queries.push(`Algeria energy cooperation Europe`);
    queries.push(`Algeria natural gas exports energy security`);
  }

  return queries.slice(0, 3);
}
