export interface TrustedSourceGroup {
  priority: number;
  name: string;
  domains: string[];
}

/**
 * Government TLDs that receive the highest priority (P1).
 * Any domain matching these TLD patterns gets top priority regardless
 * of whether it's explicitly listed in the trusted source groups.
 */
export const GOVERNMENT_TLDS = [
  ".gov",       // US & general government
  ".gov.dz",    // Algerian government
  ".gov.it",    // Italian government
  ".gov.pt",    // Portuguese government
  ".gov.de",    // German government
  ".gov.es",    // Spanish government
  ".eu",        // European Union
];

/**
 * Trusted source priority groups for RamBelEnergy Ask Energy.
 *
 * Priority order (updated 2026-06-11):
 *   1. Government & official domains (.gov, .gov.dz, .gov.it, .gov.pt, .gov.de, .gov.es, .eu)
 *   2. Official Algerian institutions and government sources
 *   3. Official European institutions and agencies
 *   4. International organizations and development institutions
 *   5. Reputable news agencies (Reuters, Bloomberg, APS, AP, AFP, etc.)
 *   6. Other media, analytical sources, and sector-specific infrastructure
 *
 * The platform always favors original institutional sources over media reports
 * that quote or summarize them.
 *
 * ═══════════════════════════════════════════════════════════════
 * Last updated: 2026-06-11
 * ═══════════════════════════════════════════════════════════════
 */
export const TRUSTED_SOURCE_GROUPS: TrustedSourceGroup[] = [
  // ═══ PRIORITY 2 — Official Algerian Institutions & Government ═══
  {
    priority: 2,
    name: "Algerian Official & Government Sources",
    domains: [
      // Energy companies & agencies
      "sonatrach.com",
      "sonatrach.dz",
      "sonelgaz.dz",
      "energy.gov.dz",
      "alnaft.dz",
      "aapi.dz",
      "creg.gov.dz",
      "creg.dz",
      // Government & parliament
      "el-mouradia.dz",
      "premier-ministre.gov.dz",
      "apn.dz",
      "majliselouma.dz",
      "mfa.gov.dz",
      "interieur.gov.dz",
      "commerce.gov.dz",
      "industrie.gov.dz",
      "finances.gov.dz",
      // Official press agency
      "aps.dz",
      // Research & regulatory
      "cder.dz",
      "arh.gov.dz",
      // Official journal & constitutional
      "joradp.dz",
      "cour-constitutionnelle.dz",
      // Additional Algerian institutions
      "ons.dz",
      "banque-of.dz",
      "caci.dz",
      "andi.dz",
      // Algerian state media
      "elmoudjahid.dz",
    ],
  },

  // ═══ PRIORITY 3 — Official European Institutions & Agencies ═══
  {
    priority: 3,
    name: "European Union Institutions & Agencies",
    domains: [
      "energy.ec.europa.eu",
      "ec.europa.eu",
      "commission.europa.eu",
      "europa.eu",
      "consilium.europa.eu",
      "eeas.europa.eu",
      "eea.europa.eu",
      "acer.europa.eu",
      "entsoe.eu",
      "entsog.eu",
      "transparency.entsog.eu",
      "clean-hydrogen.europa.eu",
      "gie.eu",
      "eib.org",
      "bruegel.org",
    ],
  },
  {
    priority: 3,
    name: "European National Energy & Regulatory Authorities",
    domains: [
      // Germany
      "bmwk.de",
      "bundeswirtschaftsministerium.de",
      "bundesnetzagentur.de",
      "umweltbundesamt.de",
      "bafa.de",
      // France
      "ecologie.gouv.fr",
      "rte-france.com",
      "ademe.fr",
      "cre.fr",
      // Spain
      "miteco.gob.es",
      "ree.es",
      "idae.es",
      "cnmc.es",
      "exteriores.gob.es",
      // Italy
      "mase.gov.it",
      "gse.it",
      "arera.it",
      "tema.it",
      // Portugal
      "dgeg.gov.pt",
      "erse.pt",
      // Greece
      "ypen.gov.gr",
      "rae.gr",
      // Additional EU member states
      "rvo.nl",
      "elia.be",
    ],
  },

  // ═══ PRIORITY 4 — International Organizations & Development Institutions ═══
  {
    priority: 4,
    name: "International Energy & Research Organizations",
    domains: [
      "iea.org",
        "iea.org/countries",
      "irena.org",
      "worldenergy.org",
      "opec.org",
      "iaea.org",
      "oxfordenergy.org",
      "energypolicy.columbia.edu",
      "ifri.org",
      "chathamhouse.org",
      "energyinst.org",
      "carnegieendowment.org",
      // US EIA — key source for energy prices & data
      "eia.gov",
      // Trading Economics — real-time commodity prices
      "tradingeconomics.com",
    ],
  },
  {
    priority: 4,
    name: "Development Banks & Global Financial Institutions",
    domains: [
      "worldbank.org",
      "data.worldbank.org",
      "imf.org",
      "afdb.org",
      "ebrd.com",
      "isdb.org",
      "undp.org",
      "data.un.org",
    ],
  },
  {
    priority: 4,
    name: "Energy Data, Statistics & Research",
    domains: [
      "ourworldindata.org",
      "ember-energy.org",
      "enerdata.net",
      "irena.org/publications",
      "carbonbrief.org",
    ],
  },

  // ═══ PRIORITY 5 — Reputable News Agencies ═══
  {
    priority: 5,
    name: "International News Agencies & Wires",
    domains: [
      "reuters.com",
      "apnews.com",
      "afp.com",
      "ansa.it",
      "efe.com",
      "dpa.com",
      "bloomberg.com",
    ],
  },
  {
    priority: 5,
    name: "Energy-Focused News & Market Intelligence",
    domains: [
      "energyintel.com",
      "argusmedia.com",
      "spglobal.com",
      "bnef.com",
      "upstreamonline.com",
      "worldoil.com",
      "oilprice.com",
      // Additional financial & commodity data platforms
      "oilmarketcap.com",
      "oilgasstoragenews.com",
    ],
  },
  {
    priority: 5,
    name: "Major Financial & Business Press",
    domains: [
      "ft.com",
      "wsj.com",
      "economist.com",
      "euractiv.com",
      "businessinsider.com",
      "markets.businessinsider.com",
    ],
  },

  // ═══ PRIORITY 6 — Infrastructure, Companies, Research & Other Media ═══
  {
    priority: 6,
    name: "International Energy Companies",
    domains: [
      "eni.com",
      "totalenergies.com",
      "bp.com",
      "shell.com",
      "equinor.com",
      "repsol.com",
      "galp.com",
      "omv.com",
      "snam.it",
      "naturgy.com",
    ],
  },
  {
    priority: 6,
    name: "Pipeline & Strategic Infrastructure",
    domains: [
      "medgaz.com",
      "south2corridor.net",
      "sea-corridor.com",
      "transmed-spa.it",
      "galsi.it",
      "elmedproject.com",
      "offshore-technology.com",
      "offshore-mag.com",
      "gasprocessingnews.com",
    ],
  },
  {
    priority: 6,
    name: "Hydrogen, Renewables & Future Energy",
    domains: [
      "hydrogeneurope.eu",
      "mission-innovation.net",
      "globalsolarcouncil.org",
      "gwec.net",
      "hydrogencouncil.com",
      "windeurope.org",
      "solarpowereurope.org",
    ],
  },
  {
    priority: 6,
    name: "Mediterranean & Regional Cooperation",
    domains: [
      "ufmsecretariat.org",
      "med-tso.org",
      "res4africa.org",
    ],
  },
  {
    priority: 6,
    name: "International & Regional News Media",
    domains: [
      "bbc.com",
      "aljazeera.com",
      "dw.com",
      "euronews.com",
      "lemonde.fr",
      "elpais.com",
      "lavanguardia.com",
      "corriere.it",
      "ilsole24ore.com",
      "spiegel.de",
      "faz.net",
      "sueddeutsche.de",
      "tsa-algerie.com",
      "elwatan-dz.com",
      "horizons.dz",
      "algerie360.com",
      "lechodalgerie.dz",
      "economictimes.indiatimes.com",
      "indiatimes.com",
      "economictimes.com",
    ],
  },
  {
    priority: 6,
    name: "Specialized Energy Media & Research",
    domains: [
      "rechargenews.com",
      "pv-magazine.com",
      "energymonitor.ai",
      "ieee.org",
      "ieeexplore.ieee.org",
      "researchgate.net",
      "sciencedirect.com",
      "nature.com",
      "mdpi.com",
      "springer.com",
      "tandfonline.com",
    ],
  },
];

/** Domains ordered by priority — higher priority domains appear first.
 *  This ordering is used by Brave Search's `site:` filter so that when
 *  the 400-character query limit truncates the domain list, the most
 *  important domains are always included. */
export function getTrustedDomainsByPriority(): string[] {
  return TRUSTED_SOURCE_GROUPS.flatMap((g) => g.domains);
}

/**
 * Get trusted domains reordered for a specific question category.
 * Domains from the preferred priority groups (matching the category)
 * are listed first so they survive Brave's 400-char query limit truncation.
 *
 * @param preferredGroups — priority numbers to list first (e.g., [1, 2] for Algerian)
 */
export function getTrustedDomainsForCategory(preferredGroups: number[]): string[] {
  const allDomains = TRUSTED_SOURCE_GROUPS;
  const preferred = new Set(preferredGroups);

  // Separate into preferred and remaining
  const preferredDomains: string[] = [];
  const remainingDomains: string[] = [];

  for (const group of allDomains) {
    if (preferred.has(group.priority)) {
      preferredDomains.push(...group.domains);
    } else {
      remainingDomains.push(...group.domains);
    }
  }

  return [...preferredDomains, ...remainingDomains];
}

/** Backward-compatible alias — returns default priority-ordered domains */
export function getTrustedDomains(): string[] {
  return getTrustedDomainsByPriority();
}

/**
 * Check if a hostname matches one of the government TLD patterns.
 * @returns the TLD that matched, or null.
 */
function matchGovernmentTld(hostname: string): string | null {
  for (const tld of GOVERNMENT_TLDS) {
    if (hostname.endsWith(tld) || hostname === tld.slice(1)) {
      return tld;
    }
  }
  return null;
}

/**
 * Check if a URL's hostname matches or is a subdomain of an approved domain.
 * Also matches government TLDs (.gov, .gov.dz, .gov.it, .gov.pt, .gov.de, .gov.es, .eu).
 */
export function isApprovedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    // Check government TLDs first
    if (matchGovernmentTld(hostname)) return true;
    // Then check the explicit trusted domain list
    return TRUSTED_SOURCE_GROUPS.some((group) =>
      group.domains.some(
        (domain) =>
          hostname === domain ||
          hostname.endsWith("." + domain)
      )
    );
  } catch {
    return false;
  }
}

export function getPriorityGroupByUrl(url: string): { priority: number; name: string } | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    // Government TLDs get top priority (P1)
    if (matchGovernmentTld(hostname)) {
      return { priority: 1, name: "Government & Official Domains" };
    }
    for (const group of TRUSTED_SOURCE_GROUPS) {
      for (const domain of group.domains) {
        if (hostname === domain || hostname.endsWith("." + domain)) {
          return { priority: group.priority, name: group.name };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}
