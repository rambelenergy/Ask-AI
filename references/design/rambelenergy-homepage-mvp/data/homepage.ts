export type NavItem = {
  label: string;
  href: string;
};

export type FocusArea = {
  title: string;
  description: string;
};

export type Article = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
};

export type Publication = {
  type: string;
  title: string;
  description: string;
  date: string;
  href: string;
};

export type StrategicItem = {
  title: string;
  description: string;
};

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Analysis", href: "/analysis" },
  { label: "Research", href: "/research" },
  { label: "Energy Focus", href: "/energy-focus" },
  { label: "AI Preview", href: "/ai-preview" },
  { label: "Contact", href: "/contact" },
];

export const strategicItems: StrategicItem[] = [
  {
    title: "Gas Infrastructure",
    description: "Pipeline corridors, transport capacity, terminals, and strategic connectivity.",
  },
  {
    title: "Algeria as an Energy Hub",
    description: "A potential Mediterranean bridge linking African resources with Europe.",
  },
  {
    title: "Italy & Spain Destinations",
    description: "Key Southern European gateways for energy flows and future cooperation.",
  },
  {
    title: "European Energy Security",
    description: "Diversification, reliability, and pragmatic long-term supply strategy.",
  },
];

export const latestArticles: Article[] = [
  {
    category: "Energy Security",
    title: "Why Algeria Matters in Europe’s Energy Security",
    excerpt: "Examining Algeria’s strategic position in supply diversification, infrastructure access, and regional cooperation.",
    date: "May 2026",
    href: "/analysis/why-algeria-matters",
  },
  {
    category: "Infrastructure",
    title: "Nigeria–Algeria–Europe Pipeline: Strategic Opportunity or Political Challenge?",
    excerpt: "A balanced view of corridor potential, financing complexity, implementation risks, and regional stability.",
    date: "May 2026",
    href: "/analysis/nigeria-algeria-europe-pipeline",
  },
  {
    category: "Mediterranean Energy",
    title: "Italy and Spain as Gateways for Algerian Energy",
    excerpt: "How Mediterranean destinations shape access, partnerships, and Europe’s future energy planning.",
    date: "April 2026",
    href: "/analysis/italy-spain-gateways",
  },
  {
    category: "Solar Energy",
    title: "Solar Energy and Algeria’s Long-Term Opportunity",
    excerpt: "A sustainability perspective on renewable potential and future Algeria–Europe collaboration.",
    date: "April 2026",
    href: "/analysis/solar-energy-algeria",
  },
];

export const publications: Publication[] = [
  {
    type: "Policy Brief",
    title: "Algeria–Europe Energy Strategic Outlook",
    description: "A structured briefing on energy security, cooperation, and infrastructure priorities.",
    date: "May 2026",
    href: "/research/algeria-europe-strategic-outlook",
  },
  {
    type: "Brief",
    title: "Mediterranean Energy Security Brief",
    description: "Strategic notes on supply routes, market access, and regional energy stability.",
    date: "April 2026",
    href: "/research/mediterranean-energy-security",
  },
  {
    type: "Research Note",
    title: "Nigeria–Algeria–Europe Pipeline Research Note",
    description: "An editorial research preview on corridor feasibility, opportunity, and policy questions.",
    date: "March 2026",
    href: "/research/pipeline-research-note",
  },
];

export const focusAreas: FocusArea[] = [
  { title: "Natural Gas", description: "Supply, infrastructure, and market strategy." },
  { title: "Solar Energy", description: "Renewable potential and cooperation pathways." },
  { title: "Energy Security", description: "Diversification and regional resilience." },
  { title: "Algeria–Europe Relations", description: "Energy diplomacy and shared priorities." },
  { title: "Mediterranean Energy", description: "Routes, gateways, and policy context." },
  { title: "Sustainability Transition", description: "Long-term low-carbon opportunities." },
];
