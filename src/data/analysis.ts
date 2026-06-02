export type AnalysisArticle = {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  source: string;
  href: string;
};

export type FilterCategory = string;

export const filters: FilterCategory[] = [
  "All",
  "Natural Gas",
  "Energy Security",
  "Algeria–Europe",
  "Solar Energy",
  "Sustainability",
  "Geopolitics",
  "Infrastructure",
];

export const featuredArticle: AnalysisArticle = {
  category: "Energy Security",
  title: "Nigeria–Algeria–Europe Gas Pipeline: A Strategic Corridor for European Energy Security",
  excerpt:
    "A research-oriented analysis of the proposed corridor's strategic importance, infrastructure challenges, financing complexity, and potential role in Europe's long-term energy diversification.",
  date: "May 2026",
  source: "Policy Analysis",
  href: "/analysis/nigeria-algeria-europe-pipeline",
};

export const sidebarArticles: AnalysisArticle[] = [
  {
    category: "Energy Future",
    title: "Why Algeria Matters in Europe's Energy Future",
    excerpt: "Concise analysis connecting infrastructure, policy, and regional cooperation priorities.",
    date: "May 2026",
    source: "Strategic Note",
    href: "/analysis/why-algeria-matters",
  },
  {
    category: "Mediterranean Routes",
    title: "Italy and Spain as Key Destinations for Algerian Energy",
    excerpt: "Concise analysis connecting infrastructure, policy, and regional cooperation priorities.",
    date: "May 2026",
    source: "Regional Analysis",
    href: "/analysis/italy-spain-gateways",
  },
  {
    category: "Sustainability",
    title: "Solar Energy and the Next Phase of Algeria–Europe Cooperation",
    excerpt: "Concise analysis connecting infrastructure, policy, and regional cooperation priorities.",
    date: "May 2026",
    source: "Sustainability Report",
    href: "/analysis/solar-energy-algeria",
  },
];

export const latestArticles: AnalysisArticle[] = [
  {
    category: "Energy Security",
    title: "Algeria's Role in Europe's Energy Diversification",
    excerpt:
      "How Algeria's energy infrastructure, geography, and policy relationships shape Europe's diversification strategy.",
    date: "May 2026",
    source: "Policy Analysis",
    href: "/analysis/algeria-europe-diversification",
  },
  {
    category: "Infrastructure",
    title: "The Trans-Saharan Gas Pipeline and Regional Stability",
    excerpt:
      "A strategic look at corridor feasibility, regional security, investment requirements, and geopolitical constraints.",
    date: "May 2026",
    source: "Infrastructure Brief",
    href: "/analysis/trans-saharan-pipeline",
  },
  {
    category: "Geopolitics",
    title: "Mediterranean Energy Security After the Global Gas Shift",
    excerpt:
      "The Mediterranean's changing role as Europe rethinks supply chains, partnerships, and long-term energy security.",
    date: "April 2026",
    source: "Strategic Note",
    href: "/analysis/mediterranean-energy-security",
  },
  {
    category: "Solar Energy",
    title: "Solar Potential in Algeria: From Domestic Power to Export Opportunity",
    excerpt:
      "Assessing Algeria's solar potential as both a domestic transition pathway and a future cooperation opportunity.",
    date: "April 2026",
    source: "Sustainability Report",
    href: "/analysis/solar-potential-algeria",
  },
  {
    category: "Algeria–Europe",
    title: "European Demand and North African Energy Strategy",
    excerpt:
      "Why European demand signals continue to influence North African energy planning, infrastructure, and diplomacy.",
    date: "March 2026",
    source: "Market Perspective",
    href: "/analysis/european-demand-north-africa",
  },
  {
    category: "Natural Gas",
    title: "How Italy and Spain Shape Algeria's Energy Outlook",
    excerpt:
      "An editorial analysis of Italy and Spain as key destinations and gateways for Algerian gas and future cooperation.",
    date: "March 2026",
    source: "Regional Analysis",
    href: "/analysis/italy-spain-algeria-outlook",
  },
];
