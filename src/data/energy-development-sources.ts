import type { ExternalResource } from "@/types/resource";

export type DevelopmentCategory = {
  label: string;
};

export const developmentCategories: DevelopmentCategory[] = [
  { label: "Energy & Development" },
  { label: "Energy and Education" },
  { label: "Energy and Healthcare" },
  { label: "Women and Energy" },
  { label: "Green Jobs" },
  { label: "Rural Electrification" },
  { label: "Sahel Development" },
  { label: "Trans-Saharan Gas Pipeline & Local Economic Impact" },
];

export const energyDevelopmentSources: ExternalResource[] = [
  {
    title: "Energy4Sahel — Energy Access & Human Development",
    source: "UNDP",
    url: "https://www.undp.org/energy/energy4sahel",
    description:
      "Energy access, education, healthcare, job creation, and sustainable development across the Sahel region.",
    badge: "External Source",
  },
  {
    title: "Mission 300 — Electricity Access for 300 Million Africans by 2030",
    source: "World Bank",
    url: "https://www.worldbank.org/en/programs/energizing-africa",
    description:
      "Initiative to provide electricity access to 300 million Africans by 2030.",
    badge: "External Source",
  },
  {
    title: "Mission 300 — Large-Scale Electrification & Economic Development",
    source: "African Development Bank",
    url: "https://www.afdb.org/en/topics-and-sectors/initiatives-and-partnerships/mission-300",
    description:
      "Large-scale electrification and economic development projects across Africa.",
    badge: "External Source",
  },
  {
    title: "Light Up and Power Africa — Development-Focused Energy Projects",
    source: "African Development Bank",
    url: "https://www.afdb.org/en/topics-and-sectors/initiatives-partnerships/light-up-and-power-africa",
    description:
      "Development-focused energy projects improving electricity access and economic opportunities.",
    badge: "External Source",
  },
  {
    title: "Africa Energy Outlook — Investment & Development Reports",
    source: "International Energy Agency",
    url: "https://www.iea.org/regions/africa",
    description:
      "Energy outlook, energy access, investment, and development reports for Africa.",
    badge: "External Source",
  },
];
