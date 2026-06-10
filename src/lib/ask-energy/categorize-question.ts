/**
 * Question categorization for context-aware search prioritization.
 *
 * Classifies user questions into one of 5 categories, then uses the
 * category to adjust domain priority ordering (Brave site: filter)
 * and embedding rerank weights — so a question about Algerian policy
 * gets more Algerian government sources, and a question about EU
 * regulations gets more European institutional sources.
 */

export type QuestionCategory =
  | "algerian"
  | "european"
  | "international"
  | "technical"
  | "general";

export interface CategoryResult {
  category: QuestionCategory;
  confidence: number; // 0–1
  /** Which existing priority groups to boost (priority number → multiplier) */
  priorityBoost: Partial<Record<number, number>>;
  /** Which priority group should be listed first in Brave site: filter */
  preferredGroups: number[];
}

// ─── Keyword definitions per category ───

const CATEGORY_KEYWORDS: Record<QuestionCategory, string[]> = {
  algerian: [
    // Country & geography
    "Algeria", "algeria", "Algérie", "algérie", "Algerian", "algerian",
    "Algiers", "algiers", "Alger", "alger",
    "Sahara", "sahara", "Saharan", "saharan",
    "Hassi", "hassi", "R'mel", "Hassi R'mel",
    "Skikda", "Arzew", "Béthioua",
    // Institutions & leaders
    "Sonatrach", "sonatrach", "SONATRACH",
    "Sonelgaz", "sonelgaz", "SONELGAZ",
    "APS", "aps", "Algérie Presse Service",
    "el-mouradia", "El Mouradia",
    "ALNAFT", "alnaft", "AAPI",
    "CREG", "creg",
    "APN", "apn", "Conseil de la Nation",
    // Infrastructure & projects
    "MEDGAZ", "Medgaz", "medgaz",
    "NIGAL", "nigal",
    "TRANSMED", "transmed", "Transmed",
    "GALSI", "galsi",
    "TFT", "tft", "Touat",
    "In Salah", "in salah",
    // Algerian-specific topics
    "Algeria-Europe", "Algérie-Europe",
    "Algeria-Italy", "Algérie-Italie",
    "Algeria-Spain", "Algérie-Espagne",
    "Algerian gas", "gaz algérien",
    "Algerian energy", "énergie algérienne",
    "Algerian renewable", "renouvelable algérien",
    "Algerian solar", "solaire algérien",
    "Algerian hydrogen", "hydrogène algérien",
    "hydrocarbures", "Hydrocarbures",
    "loi sur les hydrocarbures",
    "Sonelgaz renouvelable",
    "Tassili", "tassili",
    "Timimoun", "timimoun",
    "Adrar", "adrar",
    "Djanet", "djanet",
    "Tamanrasset", "tamanrasset",
    "Sétif", "setif",
    "Constantine", "constantine",
    "Oran", "oran",
    "Annaba", "annaba",
  ],

  european: [
    // EU & institutions
    "EU", "eu", "European Union", "European union", "european union",
    "European", "european", "Europe", "europe",
    "Brussels", "brussels",
    "European Commission", "European Council",
    "EU Commission", "EU Parliament",
    "ACER", "acer", "ENTSO-E", "ENTSOG", "entsog",
    "EEA", "eea", "EEAS", "eeas",
    "EIB", "eib",
    "Green Deal", "green deal", "European Green Deal",
    "Fit for 55", "REPowerEU", "repowereu",
    "CBAM", "cbam",
    "EU ETS", "EU emissions trading",
    // Countries
    "Italy", "italy", "Italia", "italia", "Italian", "italian",
    "Spain", "spain", "España", "españa", "Spanish", "spanish",
    "France", "france", "French", "french",
    "Germany", "germany", "German", "german", "Deutschland",
    "Portugal", "portugal", "Portuguese", "portuguese",
    "Greece", "greece", "Greek", "greek",
    "Netherlands", "netherlands", "Dutch", "dutch",
    "Belgium", "belgium",
    "Austria", "austria",
    // Mediterranean/regional
    "Mediterranean", "mediterranean", "Méditerranée", "méditerranée",
    "Mediterranean Union", "UpM", "UfM",
    "Southern Corridor", "southern corridor",
    "Corridor Sud", "corridor sud",
    // European energy topics
    "EU energy", "European energy",
    "EU gas", "European gas",
    "EU hydrogen", "European hydrogen",
    "EU solar", "European solar",
    "EU regulation", "European regulation",
    "EU directive", "European directive",
    "EU policy", "European policy",
    // Energy companies (European)
    "ENI", "Eni", "eni",
    "Naturgy", "naturgy",
    "Enel", "enel",
    "EDF", "edf",
    "RWE", "rwe",
    "Terna", "terna", "Snam", "snam",
    "Enagás", "enagás",
    "TotalEnergies", "totalenergies",
    "Repsol", "repsol",
    "Galp", "galp",
    "OMV", "omv",
    "Equinor", "equinor",
    "Engie", "engie",
  ],

  international: [
    // Global organizations
    "OPEC", "opec", "OPEC+", "opec+",
    "IEA", "iea", "International Energy Agency",
    "IRENA", "irena", "International Renewable Energy Agency",
    "World Bank", "world bank",
    "IMF", "imf", "International Monetary Fund",
    "UN", "un", "United Nations", "UNDP", "undp",
    "WTO", "wto",
    "G7", "g7", "G20", "g20",
    // Development banks
    "AfDB", "afdb", "African Development Bank",
    "EBRD", "ebrd",
    "Islamic Development Bank", "IsDB", "isdb",
    // Africa
    "Africa", "africa", "African", "african", "Afrique", "afrique",
    "Maghreb", "maghreb",
    "Sahel", "sahel",
    "Nigeria", "nigeria", "Libya", "libya", "Morocco", "morocco",
    "Tunisia", "tunisia", "Egypt", "egypt",
    "Mozambique", "mozambique", "Angola", "angola",
    // Global energy topics
    "global energy", "Global energy",
    "world energy", "World energy",
    "global gas", "global oil",
    "international energy",
    "global cooperation", "international cooperation",
    "global market", "international market",
    // Research/Think tanks
    "Chatham House", "chatham house",
    "IFRI", "ifri",
    "Carnegie", "carnegie",
    "Oxford Energy", "oxford energy",
    "Bruegel", "bruegel",
  ],

  technical: [
    // Energy types
    "solar", "Solar", "solaire", "Solaire",
    "hydrogen", "Hydrogen", "hydrogène", "Hydrogène",
    "green hydrogen", "Green hydrogen", "hydrogène vert",
    "blue hydrogen", "grey hydrogen",
    "wind", "Wind", "éolien", "Éolien",
    "renewable", "Renewable", "renouvelable", "Renouvelable",
    "natural gas", "Natural gas", "gaz naturel",
    "LNG", "lng", "GNL", "gnl",
    "biomass", "geothermal", "nuclear", "hydroelectric",
    "fossil fuel", "decarbonization", "decarbonisation",
    // Infrastructure
    "pipeline", "Pipeline", "gazoduc", "Gazoduc",
    "gas pipeline", "oil pipeline",
    "interconnection", "interconnector",
    "transmission", "Transmission",
    "storage", "Storage", "stockage",
    "terminal", "Terminal",
    "regasification", "liquefaction",
    "upstream", "downstream", "midstream",
    // Technical concepts
    "capacity", "Capacity", "capacité",
    "production", "Production",
    "consumption", "Consumption",
    "export", "Export", "import", "Import",
    "reserve", "Reserve",
    "efficiency", "Efficiency",
    "grid", "Grid", "réseau",
    "smart grid", "microgrid",
    "energy transition", "Energy transition",
    "net zero", "Net zero", "carbon neutral",
    "energy security", "Energy security",
    "energy mix", "Energy mix",
    "power plant", "Power plant",
    "refinery", "Refinery",
    "offshore", "Offshore", "onshore",
    // Technologies
    "electrolyser", "electrolyzer",
    "photovoltaic", "PV", "CSP",
    "photovoltaïque",
    "carbon capture", "CCS", "CCUS",
    "battery", "Battery", "batterie",
    // Data/metrics
    "GW", "MW", "TWh", "bcm", "bcm/y",
    "barrel", "mb/d", "capacity factor",
  ],

  general: [
    // Catch-all: matched when no other category has strong signal
    "energy", "Energy", "énergie", "Énergie",
    "analysis", "Analysis",
    "report", "Report",
    "news", "News",
    "overview", "Overview",
    "summary", "Summary",
  ],
};

// ─── Priority boost per category ───
// Maps: category → { priorityGroup: boostMultiplier }
// E.g., algerian: { 2: 1.15 } → P2 (Algerian Official) gets 15% extra boost
// The boost is multiplied ON TOP of the base PRIORITY_WEIGHT in embed.ts

const CATEGORY_PRIORITY_BOOST: Record<QuestionCategory, Partial<Record<number, number>>> = {
  algerian: { 2: 1.20 },       // Boost Algerian Official (P2) by 20%
  european: { 3: 1.20 },       // Boost European Institutions (P3) by 20%
  international: { 4: 1.20 },  // Boost International Orgs (P4) by 20%
  technical: { 6: 1.10 },      // Slight boost for specialized sources (P6)
  general: {},                 // No boost — default weights
};

// ─── Preferred group ordering for Brave site: filter ───
// When building the Brave query, these groups' domains are listed FIRST
// so they survive the 400-char truncation

const CATEGORY_PREFERRED_GROUPS: Record<QuestionCategory, number[]> = {
  algerian: [1, 2],            // Gov TLDs + Algerian Official first
  european: [1, 3],            // Gov TLDs + European Institutions first
  international: [1, 4],       // Gov TLDs + International Orgs first
  technical: [1, 6, 5],        // Gov TLDs + Specialized + News first
  general: [1, 2, 3, 4, 5, 6], // Default priority order
};

// ─── Main categorization function ───

/**
 * Categorize a user question into one of 5 categories.
 * Returns the category, confidence, boost config, and preferred groups.
 */
export function categorizeQuestion(
  question: string,
  _language?: string
): CategoryResult {
  // Count keyword matches per category
  const scores: Record<QuestionCategory, number> = {
    algerian: 0,
    european: 0,
    international: 0,
    technical: 0,
    general: 0,
  };

  const categoryKeys: QuestionCategory[] = [
    "algerian",
    "european",
    "international",
    "technical",
    "general",
  ];

  for (const cat of categoryKeys) {
    for (const kw of CATEGORY_KEYWORDS[cat]) {
      if (question.includes(kw)) {
        // Case-sensitive matches (proper nouns) count more
        const isCapitalized = kw[0] === kw[0].toUpperCase() && kw[0] !== kw[0].toLowerCase();
        scores[cat] += isCapitalized ? 2 : 1;
      }
    }
  }

  // Find the highest-scoring non-general category
  let bestCat: QuestionCategory = "general";
  let bestScore = scores.general;

  for (const cat of categoryKeys) {
    if (cat === "general") continue;
    if (scores[cat] > bestScore) {
      bestScore = scores[cat];
      bestCat = cat;
    }
  }

  // Confidence: ratio of best score to total
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const confidence = totalScore > 0
    ? Math.min(bestScore / Math.max(totalScore / 3, 1), 1)
    : 0.3; // low confidence fallback

  return {
    category: bestCat,
    confidence,
    priorityBoost: CATEGORY_PRIORITY_BOOST[bestCat],
    preferredGroups: CATEGORY_PREFERRED_GROUPS[bestCat],
  };
}

/**
 * Get a human-readable label for a category.
 */
export function getCategoryLabel(cat: QuestionCategory): string {
  const labels: Record<QuestionCategory, string> = {
    algerian: "Algeria Focus",
    european: "Europe Focus",
    international: "International Focus",
    technical: "Technical / Industry",
    general: "General Energy",
  };
  return labels[cat];
}
