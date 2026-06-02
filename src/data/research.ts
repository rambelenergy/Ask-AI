export type ResearchPublication = {
  type: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  region: string;
  href: string;
};

export const featuredPublication: ResearchPublication = {
  type: "Policy Brief",
  title: "Algeria–Europe Energy Relations: Strategic Outlook",
  excerpt:
    "A strategic overview of Algeria's role in European energy diversification, gas infrastructure, and future sustainability cooperation.",
  date: "May 2026",
  category: "Energy Security",
  region: "Algeria / Europe",
  href: "/research/algeria-europe-strategic-outlook",
};

export const publications: ResearchPublication[] = [
  {
    type: "Research Note",
    title: "Nigeria–Algeria–Europe Gas Pipeline: Strategic Implications",
    excerpt:
      "A focused assessment of the proposed corridor's strategic value, infrastructure challenges, and implications for European energy security.",
    date: "May 2026",
    category: "Energy Security",
    region: "Africa / Europe",
    href: "/research/nigeria-algeria-europe-pipeline",
  },
  {
    type: "Policy Brief",
    title: "Solar Energy in Algeria: Long-Term Opportunity for Europe",
    excerpt:
      "A policy-oriented view of Algeria's solar potential, domestic transition needs, and future cooperation with European markets.",
    date: "April 2026",
    category: "Sustainability",
    region: "Algeria / Europe",
    href: "/research/solar-energy-algeria",
  },
  {
    type: "Analysis",
    title: "Italy and Spain in the Future of Algerian Energy Exports",
    excerpt:
      "How Southern European routes, interconnections, and LNG infrastructure shape Algeria's long-term export strategy.",
    date: "April 2026",
    category: "Infrastructure",
    region: "Mediterranean",
    href: "/research/italy-spain-exports",
  },
  {
    type: "Research Note",
    title: "Mediterranean Energy Security After the Global Gas Shift",
    excerpt:
      "An examination of Mediterranean energy flows after recent global gas market changes and Europe's diversification efforts.",
    date: "March 2026",
    category: "Geopolitics",
    region: "Mediterranean",
    href: "/research/mediterranean-energy-security",
  },
  {
    type: "Report",
    title: "Algeria's Position in Europe's Energy Diversification Strategy",
    excerpt:
      "A structured report on Algeria's role in supply diversification, regional infrastructure, and strategic energy diplomacy.",
    date: "March 2026",
    category: "Energy Policy",
    region: "Europe",
    href: "/research/algeria-europe-diversification",
  },
  {
    type: "Policy Brief",
    title: "From Gas to Solar: Algeria's Sustainable Energy Transition",
    excerpt:
      "A concise brief on how Algeria can balance gas relevance with solar development and long-term sustainability cooperation.",
    date: "February 2026",
    category: "Solar Energy",
    region: "Algeria",
    href: "/research/gas-to-solar-transition",
  },
];
