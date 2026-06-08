export interface TrustedSourceGroup {
  priority: number;
  name: string;
  domains: string[];
}

/**
 * Trusted source priority groups for Ask Energy.
 *
 * Ordered by priority — Priority 1 sources rank highest.
 * Primary sources from official organizations, governments, operators, and news agencies.
 * Competing energy media platforms (Argus, ICIS, MEES, Montel, Energy Intelligence, etc.)
 * are intentionally excluded.
 *
 * ═══════════════════════════════════════════════════════════════
 * Last updated: 2026-06-08
 * ═══════════════════════════════════════════════════════════════
 */
export const TRUSTED_SOURCE_GROUPS: TrustedSourceGroup[] = [
  // ═══ PRIORITY 1 — International News Agencies (Verification Sources) ═══
  {
    priority: 1,
    name: "International News Agencies",
    domains: [
      "reuters.com",
      "apnews.com",
      "aps.dz",
    ],
  },

  // ═══ PRIORITY 2 — Algerian Government & National Operators ═══
  {
    priority: 2,
    name: "Algerian Government & Operators",
    domains: [
      "energy.gov.dz",
      "sonatrach.com",
      "sonelgaz.dz",
      "creg.gov.dz",
    ],
  },

  // ═══ PRIORITY 3 — European Energy Institutions ═══
  {
    priority: 3,
    name: "European Energy Institutions",
    domains: [
      "energy.ec.europa.eu",
      "ec.europa.eu",
      "entsog.eu",
      "entsoe.eu",
      "acer.europa.eu",
      "eib.org",
      "eea.europa.eu",
    ],
  },

  // ═══ PRIORITY 4 — Major International Energy Companies ═══
  {
    priority: 4,
    name: "International Energy Companies",
    domains: [
      "eni.com",
      "totalenergies.com",
      "bp.com",
      "shell.com",
      "equinor.com",
    ],
  },

  // ═══ PRIORITY 5 — International Energy Institutions ═══
  {
    priority: 5,
    name: "International Energy Institutions",
    domains: [
      "iea.org",
      "irena.org",
      "opec.org",
      "worldenergy.org",
      "iaea.org",
    ],
  },

  // ═══ PRIORITY 6 — European National Energy Authorities ═══
  {
    priority: 6,
    name: "European National Authorities",
    domains: [
      "bundeswirtschaftsministerium.de",
      "umweltbundesamt.de",
      "bundesnetzagentur.de",
      "ecologie.gouv.fr",
      "rte-france.com",
      "ademe.fr",
      "miteco.gob.es",
      "ree.es",
      "idae.es",
      "mase.gov.it",
      "gse.it",
      "arera.it",
    ],
  },

  // ═══ PRIORITY 7 — Pipeline & Strategic Infrastructure ═══
  {
    priority: 7,
    name: "Pipeline & Strategic Infrastructure",
    domains: [
      "medgaz.com",
      "south2corridor.net",
      "snam.it",
      "naturgy.com",
    ],
  },

  // ═══ PRIORITY 8 — Hydrogen, Renewables & Future Energy ═══
  {
    priority: 8,
    name: "Hydrogen, Renewables & Future Energy",
    domains: [
      "hydrogeneurope.eu",
      "mission-innovation.net",
      "globalsolarcouncil.org",
      "gwec.net",
      "hydrogencouncil.com",
    ],
  },

  // ═══ PRIORITY 9 — Energy Data & Statistics ═══
  {
    priority: 9,
    name: "Energy Data & Statistics",
    domains: [
      "data.worldbank.org",
      "imf.org",
      "data.un.org",
      "ourworldindata.org",
      "ember-energy.org",
    ],
  },

  // ═══ PRIORITY 10 — Mediterranean & Regional Cooperation ═══
  {
    priority: 10,
    name: "Mediterranean & Regional Cooperation",
    domains: [
      "ufmsecretariat.org",
      "med-tso.org",
    ],
  },

  // ═══ PRIORITY 11 — Quality International & Regional News Media ═══
  {
    priority: 11,
    name: "International & Regional News Media",
    domains: [
      "france24.com",
      "bbc.com",
      "aljazeera.com",
      "dw.com",
      "euronews.com",
      "lemonde.fr",
      "elpais.com",
      "lavanguardia.com",
      "tsa-algerie.com",
      "elwatan-dz.com",
      "horizons.dz",
      "lavoiedalgerie.dz",
      "theafricareport.com",
      "newarab.com",
      "africanews.com",
      "africaradio.com",
    ],
  },

  // ═══ PRIORITY 12 — Supplementary: General News & Policy (not energy-specific) ═══
  {
    priority: 12,
    name: "General News & Policy",
    domains: [
      "bloomberg.com",
      "ft.com",
      "euractiv.com",
      "bruegel.org",
    ],
  },

  // ═══ PRIORITY 13 — Supplementary: Energy Market & Data Platforms ═══
  // Lower priority — official sources (1-10) preferred for same news
  {
    priority: 13,
    name: "Energy Market & Data Platforms",
    domains: [
      "argusmedia.com",
      "energyintel.com",
      "spglobal.com",
    ],
  },

  // ═══ PRIORITY 14 — Supplementary: Algerian Research & Institutions ═══
  {
    priority: 14,
    name: "Algerian Research & Institutions",
    domains: [
      "cder.dz",
      "aapi.dz",
      "alnaft.dz",
      "mfa.gov.dz",
    ],
  },
];

export function getTrustedDomains(): string[] {
  return TRUSTED_SOURCE_GROUPS.flatMap((g) => g.domains);
}

/**
 * Check if a URL's hostname matches or is a subdomain of an approved domain.
 * Example: "www.iea.org" matches "iea.org", "data.un.org" matches "data.un.org"
 */
export function isApprovedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
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
