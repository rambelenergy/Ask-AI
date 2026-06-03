export interface TrustedSourceGroup {
  priority: number;
  name: string;
  domains: string[];
}

/**
 * Trusted source priority groups for Ask Energy.
 *
 * Ordered by priority — Priority 1 sources rank highest.
 * Exact domain matching with subdomain support.
 */
export const TRUSTED_SOURCE_GROUPS: TrustedSourceGroup[] = [
  {
    priority: 1,
    name: "International Energy Institutions",
    domains: [
      "iea.org",
      "irena.org",
      "worldenergy.org",
      "opec.org",
      "iaea.org",
    ],
  },
  {
    priority: 2,
    name: "European Energy Sources",
    domains: [
      "energy.ec.europa.eu",
      "ec.europa.eu",
      "eib.org",
      "eea.europa.eu",
      "entsoe.eu",
      "entsog.eu",
      "acer.europa.eu",
      "bruegel.org",
    ],
  },
  {
    priority: 3,
    name: "Algeria-Focused Sources",
    domains: [
      "sonatrach.com",
      "energy.gov.dz",
      "aapi.dz",
      "aps.dz",
      "sonelgaz.dz",
      "alnaft.dz",
      "cder.dz",
      "mfa.gov.dz",
    ],
  },
  {
    priority: 4,
    name: "Energy Data & Statistics",
    domains: [
      "data.worldbank.org",
      "imf.org",
      "data.un.org",
      "ourworldindata.org",
      "ember-energy.org",
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
    ],
  },
  {
    priority: 6,
    name: "European National Energy Authorities",
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
  {
    priority: 7,
    name: "Pipeline & Strategic Infrastructure",
    domains: [
      "medgaz.com",
      "south2corridor.net",
      "eni.com",
      "snam.it",
      "naturgy.com",
    ],
  },
  {
    priority: 8,
    name: "Energy Intelligence & Market Data",
    domains: [
      "bloomberg.com",
      "energyintel.com",
      "reuters.com",
      "ft.com",
      "euractiv.com",
      "argusmedia.com",
      "spglobal.com",
    ],
  },
  {
    priority: 9,
    name: "Mediterranean & Regional Cooperation",
    domains: [
      "ufmsecretariat.org",
      "med-tso.org",
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
