export interface TrustedSourceGroup {
  priority: number;
  name: string;
  domains: string[];
}

/**
 * Trusted source priority groups for RamBelEnergy Ask Energy.
 *
 * Priority order (as specified):
 *   1. Official Algerian institutions and government sources
 *   2. Official European institutions and agencies
 *   3. International organizations and development institutions
 *   4. Reputable news agencies (Reuters, Bloomberg, APS, AP, AFP, etc.)
 *   5. Other media, analytical sources, and sector-specific infrastructure
 *
 * The platform always favors original institutional sources over media reports
 * that quote or summarize them.
 *
 * ═══════════════════════════════════════════════════════════════
 * Last updated: 2026-06-10
 * ═══════════════════════════════════════════════════════════════
 */
export const TRUSTED_SOURCE_GROUPS: TrustedSourceGroup[] = [
  // ═══ PRIORITY 1 — Official Algerian Institutions & Government ═══
  {
    priority: 1,
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

  // ═══ PRIORITY 2 — Official European Institutions & Agencies ═══
  {
    priority: 2,
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
    priority: 2,
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

  // ═══ PRIORITY 3 — International Organizations & Development Institutions ═══
  {
    priority: 3,
    name: "International Energy & Research Organizations",
    domains: [
      "iea.org",
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
    ],
  },
  {
    priority: 3,
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
    priority: 3,
    name: "Energy Data, Statistics & Research",
    domains: [
      "ourworldindata.org",
      "ember-energy.org",
      "enerdata.net",
      "irena.org/publications",
      "carbonbrief.org",
    ],
  },

  // ═══ PRIORITY 4 — Reputable News Agencies ═══
  {
    priority: 4,
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
    priority: 4,
    name: "Energy-Focused News & Market Intelligence",
    domains: [
      "energyintel.com",
      "argusmedia.com",
      "spglobal.com",
      "bnef.com",
      "upstreamonline.com",
      "worldoil.com",
    ],
  },
  {
    priority: 4,
    name: "Major Financial & Business Press",
    domains: [
      "ft.com",
      "wsj.com",
      "economist.com",
      "euractiv.com",
    ],
  },

  // ═══ PRIORITY 5 — Infrastructure, Companies, Research & Other Media ═══
  {
    priority: 5,
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
    priority: 5,
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
    priority: 5,
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
    priority: 5,
    name: "Mediterranean & Regional Cooperation",
    domains: [
      "ufmsecretariat.org",
      "med-tso.org",
      "res4africa.org",
    ],
  },
  {
    priority: 5,
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
    ],
  },
  {
    priority: 5,
    name: "Specialized Energy Media & Research",
    domains: [
      "oilprice.com",
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
 *  important (P1 Algerian) domains are always included. */
export function getTrustedDomainsByPriority(): string[] {
  return TRUSTED_SOURCE_GROUPS.flatMap((g) => g.domains);
}

/** Backward-compatible alias */
export function getTrustedDomains(): string[] {
  return getTrustedDomainsByPriority();
}

/**
 * Check if a URL's hostname matches or is a subdomain of an approved domain.
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
