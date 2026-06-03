/**
 * Energy Glossary / Keyword Dictionary for RamBelEnergy Ask Energy.
 *
 * Maps energy-specific terms, abbreviations, pipeline names, company names,
 * and project keywords to expanded search queries.
 *
 * Used by expand-query.ts to recognize special energy terms and
 * generate better search queries, especially for short/ambiguous questions.
 */

export interface GlossaryEntry {
  /** The canonical term or abbreviation */
  term: string;
  /** Search query expansions for this term */
  expansions: string[];
  /** Optional: the term's category for grouping */
  category?: "pipeline" | "company" | "project" | "concept" | "region";
}

export const ENERGY_GLOSSARY: GlossaryEntry[] = [
  // ── Pipelines ────────────────────────────────────────────────────
  {
    term: "MEDGAZ",
    category: "pipeline",
    expansions: [
      "MEDGAZ pipeline Algeria Spain",
      "Algeria Spain gas pipeline MEDGAZ",
      "Sonatrach Spain MEDGAZ natural gas",
      "Algeria Europe gas infrastructure MEDGAZ",
      "MEDGAZ pipeline capacity expansion",
    ],
  },
  {
    term: "NIGAL",
    category: "pipeline",
    expansions: [
      "NIGAL Nigeria Algeria Gas Pipeline",
      "Trans-Saharan Gas Pipeline NIGAL",
      "Nigeria Algeria Europe gas pipeline",
      "Algeria Nigeria gas corridor NIGAL",
      "NIGAL pipeline project status",
    ],
  },
  {
    term: "TRANSMED",
    category: "pipeline",
    expansions: [
      "TransMed pipeline Algeria Italy gas",
      "Trans-Mediterranean gas pipeline Algeria Italy",
      "Algeria Tunisia Italy gas pipeline TransMed",
      "TransMed pipeline capacity natural gas",
    ],
  },
  {
    term: "GALSI",
    category: "pipeline",
    expansions: [
      "GALSI pipeline Algeria Italy Sardinia",
      "Algeria Italy Galsi gas pipeline project",
      "GALSI gas pipeline status",
    ],
  },
  {
    term: "SOUTH2CORRIDOR",
    category: "pipeline",
    expansions: [
      "Southern Gas Corridor Algeria Europe",
      "South2Corridor gas pipeline",
      "Algeria Europe southern energy corridor",
    ],
  },

  // ── Companies ────────────────────────────────────────────────────
  {
    term: "SONATRACH",
    category: "company",
    expansions: [
      "Sonatrach Algeria national energy company",
      "Sonatrach gas exports Europe cooperation",
      "Sonatrach ENI Spain Naturgy partnership",
      "Sonatrach energy strategy renewable hydrogen",
    ],
  },
  {
    term: "ENI",
    category: "company",
    expansions: [
      "ENI Algeria energy cooperation gas",
      "Sonatrach ENI partnership natural gas",
      "ENI Algeria exploration production",
      "ENI Algeria renewable energy hydrogen",
    ],
  },
  {
    term: "NATURGY",
    category: "company",
    expansions: [
      "Naturgy Sonatrach Algeria Spain gas contract",
      "Naturgy Algeria natural gas supply",
      "Naturgy Spain Algeria energy partnership",
    ],
  },
  {
    term: "SNAM",
    category: "company",
    expansions: [
      "Snam Italy Algeria gas infrastructure",
      "Snam Sonatrach pipeline cooperation",
      "Snam hydrogen partnership Algeria",
    ],
  },

  // ── Projects & Concepts ──────────────────────────────────────────
  {
    term: "GREEN HYDROGEN",
    category: "concept",
    expansions: [
      "green hydrogen Algeria Europe cooperation",
      "Algeria renewable hydrogen production export",
      "Algeria Sahara green hydrogen projects",
      "European green hydrogen partnership Algeria",
      "Algeria hydrogen strategy EU",
    ],
  },
  {
    term: "HYDROGEN",
    category: "concept",
    expansions: [
      "hydrogen energy Algeria Europe cooperation",
      "Algeria hydrogen production renewable",
      "green hydrogen Algeria EU partnership",
    ],
  },
  {
    term: "ALGERIAN SAHARA",
    category: "region",
    expansions: [
      "Algerian Sahara solar energy potential",
      "Sahara renewable energy Algeria solar",
      "Algeria Sahara green hydrogen production",
      "Algerian desert solar power Europe export",
    ],
  },
  {
    term: "SAHARA SOLAR",
    category: "concept",
    expansions: [
      "Algerian Sahara solar energy potential",
      "Sahara desert solar power Algeria",
      "Algeria solar energy Europe electricity export",
      "Sahara solar photovoltaic potential",
    ],
  },
  {
    term: "SOLAR ENERGY",
    category: "concept",
    expansions: [
      "solar energy Algeria Sahara potential",
      "Algeria solar power renewable energy",
      "Algeria solar energy Europe cooperation",
      "Algeria photovoltaic solar projects",
    ],
  },
  {
    term: "RENEWABLE ENERGY",
    category: "concept",
    expansions: [
      "renewable energy Algeria solar wind hydrogen",
      "Algeria renewable energy strategy Europe",
      "Algeria energy transition renewable projects",
    ],
  },
  {
    term: "ENERGY SECURITY",
    category: "concept",
    expansions: [
      "energy security Algeria Europe natural gas",
      "Algeria European energy security gas supply",
      "Europe energy security diversification Algeria",
      "Algeria role European energy security",
    ],
  },
  {
    term: "NATURAL GAS",
    category: "concept",
    expansions: [
      "Algeria natural gas exports Europe",
      "Algeria gas pipeline infrastructure Europe",
      "Algeria natural gas production reserves",
      "Algeria LNG natural gas market",
    ],
  },
  {
    term: "LNG",
    category: "concept",
    expansions: [
      "Algeria LNG exports Europe",
      "Algeria liquefied natural gas terminals",
      "Algeria LNG capacity production",
    ],
  },
  {
    term: "DESERT SOLAR",
    category: "concept",
    expansions: [
      "desert solar energy Algeria Sahara",
      "Algeria desert photovoltaic potential",
      "Sahara solar power generation Africa Europe",
    ],
  },
  {
    term: "ELMED",
    category: "project",
    expansions: [
      "ELMED Algeria Italy electricity interconnection",
      "Algeria Italy ELMED power cable",
      "ELMED submarine cable energy project",
    ],
  },
];

/**
 * Look up glossary entries matching a user question.
 * Case-insensitive matching for full terms.
 */
export function matchGlossaryEntries(query: string): GlossaryEntry[] {
  const upper = query.toUpperCase();
  return ENERGY_GLOSSARY.filter((entry) => upper.includes(entry.term.toUpperCase()));
}

/**
 * Get all expansion strings for glossary entries that match the query.
 */
export function getGlossaryExpansions(query: string): string[] {
  const matched = matchGlossaryEntries(query);
  return matched.flatMap((entry) => entry.expansions.slice(0, 3));
}

/**
 * Get the canonical term names found in the query.
 */
export function getGlossaryTerms(query: string): string[] {
  return matchGlossaryEntries(query).map((entry) => entry.term);
}
