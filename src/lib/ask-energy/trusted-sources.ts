export interface TrustedSourceGroup {
  priority: number;
  name: string;
  domains: string[];
}

export const TRUSTED_SOURCE_GROUPS: TrustedSourceGroup[] = [
  {
    priority: 1,
    name: "International Energy & Research Institutions",
    domains: [
      "iea.org",
      "irena.org",
      "worldenergy.org",
      "opec.org",
      "iaea.org",
      "oxfordenergy.org",
      "energypolicy.columbia.edu",
    ],
  },
  {
    priority: 2,
    name: "European Energy & Infrastructure",
    domains: [
      "energy.ec.europa.eu",
      "ec.europa.eu",
      "eib.org",
      "eea.europa.eu",
      "acer.europa.eu",
      "entsoe.eu",
      "entsog.eu",
      "transparency.entsog.eu",
      "clean-hydrogen.europa.eu",
      "gie.eu",
      "bruegel.org",
    ],
  },
  {
    priority: 3,
    name: "Algeria Official Sources",
    domains: [
      "sonatrach.com",
      "sonelgaz.dz",
      "energy.gov.dz",
      "alnaft.dz",
      "aapi.dz",
      "aps.dz",
      "cder.dz",
      "el-mouradia.dz",
      "premier-ministre.gov.dz",
      "apn.dz",
      "majliselouma.dz",
      "joradp.dz",
      "cour-constitutionnelle.dz",
      "mfa.gov.dz",
    ],
  },
  {
    priority: 4,
    name: "TransMed, Pipeline & Strategic Infrastructure",
    domains: [
      "sea-corridor.com",
      "transmed-spa.it",
      "medgaz.com",
      "south2corridor.net",
      "galsi.it",
      "elmedproject.com",
      "offshore-technology.com",
      "offshore-mag.com",
      "gasprocessingnews.com",
      "eni.com",
      "snam.it",
    ],
  },
  {
    priority: 5,
    name: "Energy Intelligence & Market Data",
    domains: [
      "bloomberg.com",
      "bnef.com",
      "energyintel.com",
      "reuters.com",
      "ft.com",
      "euractiv.com",
      "argusmedia.com",
      "spglobal.com",
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
    priority: 8,
    name: "Hydrogen, Renewables & Future Energy",
    domains: [
      "hydrogeneurope.eu",
      "mission-innovation.net",
      "globalsolarcouncil.org",
      "gwec.net",
      "medhydrogenalliance.eu",
      "hydrogencouncil.com",
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
