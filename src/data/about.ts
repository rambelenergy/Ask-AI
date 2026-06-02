export type ProfileIdentity = {
  title: string;
};

export type MissionPoint = {
  title: string;
  description: string;
};

export type CoreFocusItem = {
  marker: "relations" | "pipeline" | "security" | "solar";
  title: string;
  description: string;
};

export type EditorialValue = {
  title: string;
  description: string;
};

export type AboutContent = {
  breadcrumb: string[];
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  profile: {
    title: string;
    biography: string;
    replacementNote: string;
    identities: ProfileIdentity[];
  };
  mission: {
    title: string;
    text: string;
    points: MissionPoint[];
  };
  focusAreas: CoreFocusItem[];
  values: EditorialValue[];
  futureVision: {
    text: string;
    badge: string;
    note: string;
  };
};

export const aboutContent: AboutContent = {
  breadcrumb: ["Home", "About"],
  hero: {
    eyebrow: "About / Profile",
    title: "About RamBelEnergy",
    subtitle:
      "Independent analysis on Algeria–Europe energy relations, sustainability, and Mediterranean energy security.",
  },
  profile: {
    title: "About Mr. Ramdane",
    biography:
      "<p>Ramdane Belamri is a journalist, PhD holder, and analyst focusing on energy, geopolitics, sustainability, and Euro-African cooperation.</p>" +
      "<p>Born in Sétif, Algeria, he has built a career combining journalism and academic research across print, television, and digital media for over twenty-five years.</p>" +
      "<p>He earned a PhD in Media and Communication Sciences from the University of Algiers 3 and is currently pursuing an international doctoral degree at the University of Seville.</p>" +
      "<p>His work centers on Algeria's strategic position in the Mediterranean energy landscape — covering natural gas, solar energy, green hydrogen, infrastructure corridors, and the evolving energy relationship between Africa and Europe.</p>" +
      "<p>RamBelEnergy is his independent platform for professional analysis, research, and strategic energy intelligence, designed to bridge the information gap between Algeria's energy reality and international understanding.</p>",
    replacementNote:
      "Profile biography and approved portrait will be updated after client confirmation.",
    identities: [
      { title: "Journalist" },
      { title: "PhD Holder" },
      { title: "Energy & Geopolitical Analyst" },
      { title: "Euro-African Energy Focus" },
    ],
  },
  mission: {
    title: "Platform Mission",
    text:
      "RamBelEnergy aims to provide professional analysis, research, and strategic insight on Algeria–Europe energy relations, with a focus on gas infrastructure, energy security, solar energy, sustainability, and future cooperation between Africa and Europe.",
    points: [
      {
        title: "Independent analysis",
        description: "Research-oriented commentary developed with editorial discipline.",
      },
      {
        title: "Source-based insight",
        description: "Context shaped around selected and reviewable public materials.",
      },
      {
        title: "Strategic energy focus",
        description: "Gas, solar, security, infrastructure, and regional cooperation.",
      },
      {
        title: "Long-term sustainable cooperation",
        description: "Future-facing dialogue linking Algeria, Africa, and Europe.",
      },
    ],
  },
  focusAreas: [
    {
      marker: "relations",
      title: "Algeria–Europe Energy Relations",
      description:
        "Exploring energy diplomacy, shared priorities, market links, and long-term strategic cooperation.",
    },
    {
      marker: "pipeline",
      title: "Nigeria–Algeria–Europe Gas Pipeline",
      description:
        "Assessing corridor potential, infrastructure questions, and implications for European supply security.",
    },
    {
      marker: "security",
      title: "Mediterranean Energy Security",
      description:
        "Examining gateways, supply diversification, and the Mediterranean strategic context.",
    },
    {
      marker: "solar",
      title: "Solar Energy & Sustainability",
      description:
        "Considering renewable opportunities and sustainable cooperation pathways across regions.",
    },
  ],
  values: [
    {
      title: "Independent Analysis",
      description: "Clear, neutral commentary focused on strategic energy questions.",
    },
    {
      title: "Source-Based Insight",
      description: "Perspective grounded in selected public and research materials.",
    },
    {
      title: "Professional Research",
      description: "Structured output designed for informed professional audiences.",
    },
    {
      title: "Long-Term Strategic View",
      description: "Attention to policy, infrastructure, sustainability, and cooperation over time.",
    },
  ],
  futureVision: {
    text:
      "The platform is designed to begin as a professional energy analysis platform and gradually evolve toward AI-powered knowledge capabilities for Algeria–Europe energy, sustainability, and strategic intelligence.",
    badge: "Planned for next phase",
    note:
      "Coming next: AI-powered search drawing on selected government, news, and research materials.",
  },
};
