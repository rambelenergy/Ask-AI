import type { ExternalResource } from "@/types/resource";

export type RenewableEnergySource = {
  title: string;
  source: string;
  url: string;
  badge: "External Source";
};

export const renewableEnergySources: RenewableEnergySource[] = [
  {
    title: "Renewable Energy, Green Hydrogen & Socio-Economic Development",
    source: "GIZ",
    url: "https://www.giz.de/en/projects/technology-and-socio-economic-development-renewable-energies-green-hydrogen-and-energy",
    badge: "External Source",
  },
  {
    title: "Germany and Algeria Establish a Hydrogen Taskforce",
    source: "German Federal Ministry for Economic Affairs",
    url: "https://www.bundeswirtschaftsministerium.de/Redaktion/EN/Pressemitteilungen/2024/02/20240208-germany-and-algeria-set-up-hydrogen-taskforce.html",
    badge: "External Source",
  },
  {
    title: "PtX and Renewable Energy Potential in Algeria",
    source: "Fraunhofer ISI",
    url: "https://www.isi.fraunhofer.de/en/competence-center/energiepolitik-energiemaerkte/projekte/kfw_ptx_algeria.html",
    badge: "External Source",
  },
  {
    title: "Desertec 3.0: Hydrogen from the Desert",
    source: "ZfK",
    url: "https://www.zfk.de/energie/gas/desertec-30-wasserstoff-aus-der-wueste",
    badge: "External Source",
  },
];

export const globalSolarMapResource: ExternalResource = {
  title: "Global Solar Map",
  source: "Global Solar Atlas",
  description: "Explore solar resource and photovoltaic power potential data for Algeria and other regions through the Global Solar Atlas.",
  url: "https://globalsolaratlas.info/map?s=30.446988,0.225220&m=site",
  badge: "External Interactive Resource",
};

export const saharaSectionContent = {
  eyebrow: "Solar Energy & Green Hydrogen",
  title: "Sahara Renewable Energy Potential",
  description:
    "Algeria's Sahara represents one of the world's most strategic territories for the future of renewable energy. With exceptional solar resources, vast available land, and growing cooperation with Germany and the European Union, the Algerian desert is emerging as a major hub for green hydrogen, solar power generation, and sustainable industrial development. As Europe accelerates its energy transition, Algeria's geographic position and renewable potential could transform the Sahara into a critical energy bridge between Africa and Europe.",
  ctaLabel: "Explore Renewable Energy Sources",
  imageAlt: "Sahara solar energy conceptual landscape",
};
