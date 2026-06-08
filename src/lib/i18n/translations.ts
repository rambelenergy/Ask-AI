import type { Language, TranslationKey } from "./types";

type TranslationMap = Record<TranslationKey, string>;

const translations: Record<Language, TranslationMap> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.askEnergy": "Ask Energy",
    "nav.articles": "Articles",
    "nav.algerianSahara": "Algerian Sahara",
    "nav.globalMap": "Global map",
    "nav.about": "About",
    "nav.analysis": "Analysis",
    "nav.research": "Research",
    "nav.energyFocus": "Energy Focus",
    "nav.aiAssistant": "AI Assistant",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.menu": "Menu",
    "nav.search": "Search",
    "nav.dashboard": "Dashboard",
    "nav.signOut": "Sign out",
    "nav.signedInAs": "Signed in as",
    "nav.topTagline": "Algeria–Europe Energy Intelligence",

    // Home Hero
    "home.hero.eyebrow": "Algeria–Europe Energy Intelligence",
    "home.hero.title": "Independent Analysis on Algeria–Europe Energy Relations",
    "home.hero.subtitle":
      "A professional platform for energy analysis, sustainability intelligence, and strategic insight connecting Algeria, Africa, and Europe.",
    "home.hero.ctaAnalysis": "Read Latest Analysis",
    "home.hero.ctaExplore": "Explore Energy Focus",

    // Home AI Assistant
    "home.ai.eyebrow": "ASK Energy",
    "home.ai.title": "ASK Energy",
    "home.ai.description":
      "The AI-powered Energy Intelligence Assistant. Paste any content and ask — the assistant answers based only on the text you provide.",
    "home.ai.exampleLabel": "Example question",
    "home.ai.exampleQuestion":
      "What role does Algeria play in Europe's energy security according to this content?",
    "home.ai.disclaimer":
      "Phase 1 — This assistant answers only from the content you paste. It does not search external sources, retrieve documents, or learn from past conversations.",
    "home.ai.contextLabel": "Context",
    "home.ai.contextPlaceholder": "Paste the content you want the assistant to reference…",
    "home.ai.contextOverLimit": "Content exceeds the {max}-character limit.",
    "home.ai.questionLabel": "Question",
    "home.ai.questionPlaceholder": "Ask a question based on the context above…",
    "home.ai.questionOverLimit": "Question exceeds the {max}-character limit.",
    "home.ai.submit": "Ask",
    "home.ai.analyzing": "Analyzing…",
    "home.ai.clear": "Clear",
    "home.ai.responseLabel": "Response",
    "home.ai.responseDisclaimer":
      "This response is based only on the content you provided. Review before relying on it.",
    "home.ai.errorTitle": "Unable to reach AI service. Check your connection and try again.",
    "home.ai.noContent": "Please provide both content and a question.",
    "home.ai.poweredBy": "Phase 1 AI Prototype",

    // Home Strategic
    "home.strategic.eyebrow": "Featured Strategic Focus",
    "home.strategic.title": "Nigeria–Algeria–Europe Gas Pipeline",
    "home.strategic.desc":
      "The proposed corridor represents a strategic connection between African energy resources and European energy security needs, with Italy and Spain as important destinations.",
    "home.strategic.learnMore": "Learn more",

    // Home Analysis
    "home.analysis.eyebrow": "Latest Analysis",
    "home.analysis.heading": "Recent insight and commentary",
    "home.analysis.viewAll": "View all analysis",
    "home.analysis.readMore": "Read more",

    // Home Sahara
    "home.sahara.eyebrow": "Solar & Green Hydrogen",
    "home.sahara.title": "Algeria's Solar and Renewable Energy Opportunity",
    "home.sahara.desc":
      "Algeria possesses one of the highest solar irradiation levels in the world, especially across its vast Saharan territories. This natural advantage positions the country as a potential future hub for solar electricity generation and green hydrogen production, contributing to both domestic energy transition and Euro-African energy cooperation.",
    "home.sahara.cta": "Explore renewable sources",

    // Home Renewable Sources
    "home.renewable.eyebrow": "Selected External References",
    "home.renewable.heading": "Selected Renewable Energy Sources",
    "home.renewable.desc":
      "Selected external references related to Algeria's renewable energy, green hydrogen cooperation, and sustainable development opportunities.",
    "home.renewable.viewSource": "View Source",

    // Home Solar Map
    "home.solarMap.eyebrow": "Explore Solar Potential",
    "home.solarMap.heading": "Global Solar Map",
    "home.solarMap.desc":
      "Explore solar resource and photovoltaic power potential data for Algeria and other regions through the Global Solar Atlas.",
    "home.solarMap.open": "Open Global Solar Map",

    // Home Research
    "home.research.eyebrow": "Research & Publications",
    "home.research.heading": "Briefs, reports, and research notes",
    "home.research.browse": "Browse publications",
    "home.research.viewPublication": "View publication",

    // Home About
    "home.about.eyebrow": "About the Founder",
    "home.about.heading": "Ramdane Belamri",
    "home.about.viewProfile": "View Full Profile",
    "home.about.researchPub": "Research & Publications",

    // Home Focus
    "home.focus.eyebrow": "Focus Areas",
    "home.focus.heading": "Energy themes covered by RamBelEnergy",

    // Home CTA
    "home.cta.eyebrow": "Contact / Collaboration",
    "home.cta.title": "Research, Media & Strategic Energy Collaboration",
    "home.cta.desc":
      "For research inquiries, institutional discussions, or strategic energy collaboration, contact RamBelEnergy.",
    "home.cta.button": "Contact",

    // Footer
    "footer.tagline":
      "Professional energy analysis and sustainability intelligence focused on Algeria-Africa–Europe relations and Mediterranean energy security.",
    "footer.disclaimer":
      "RamBelEnergy is an independent energy journalism, research, and analysis platform. Our focus is energy policy analysis and news (particularly Algeria-Africa–Europe).",
    "footer.copyright": "RamBelEnergy. All rights reserved.",
    "footer.navHeading": "Navigation",
    "footer.focusHeading": "Focus Areas",
    "footer.contactHeading": "Contact",
    "footer.location": "Algeria & Europe",
    "footer.inquiries": "Institutional inquiries\nResearch collaboration",
    "footer.getInTouch": "Get in touch",

    // About
    "about.hero.eyebrow": "About the Platform",
    "about.hero.title": "Professional Energy Analysis\nand Strategic Intelligence",
    "about.hero.subtitle":
      "An independent platform providing editorial analysis, research perspective, and energy intelligence across Algeria, Africa, and Europe.",
    "about.hero.note":
      "A professional platform presenting editorial analysis, research perspective, and strategic energy intelligence across Algeria, Africa, and Europe.",
    "about.hero.visualLabel": "Research & strategic context",
    "about.hero.visualDesc":
      "Energy routes, policy material, and Mediterranean cooperation represented through a restrained institutional visual.",
    "about.profile.eyebrow": "About the Founder",
    "about.profile.title": "Professional Background & Identity",
    "about.mission.eyebrow": "Mission",
    "about.mission.title": "Purpose and Editorial Mission",
    "about.values.eyebrow": "Editorial Values",
    "about.values.heading": "Principles guiding the platform",
    "about.future.eyebrow": "Future Vision",
    "about.future.title": "From analysis platform to knowledge capabilities",
    "about.future.aiNote":
      "Preview statement only. Full AI or RAG capability is not available in the Phase 1 frontend scope.",
    "about.future.aiPreview": "View AI Assistant",
    "about.future.viewAi": "View AI Assistant",
    "about.cta.title": "Collaboration & Inquiries",
    "about.cta.desc":
      "For research, media, institutional, or strategic energy discussions, contact RamBelEnergy.",
    "about.cta.button": "Contact",

    // Analysis Listing
    "analysis.pageTitle": "News & Analysis",
    "analysis.heading": "Analysis & Commentary",
    "analysis.subtitle":
      "Independent analysis on Algeria–Europe energy relations, sustainability, and Mediterranean energy security.",
    "analysis.featured": "Featured Analysis",
    "analysis.latest": "Latest",
    "analysis.allAnalysis": "All Analysis",
    "analysis.noArticles": "No articles have been published yet.",
    "analysis.filterCategory": "Filter by category",
    "analysis.filterAll": "All",
    "analysis.readMore": "Read more",
    "analysis.published": "Published",
    "analysis.category": "Category",
    "analysis.aiPreview": "AI Preview",
    "analysis.viewAll": "View all",

    // Article Detail
    "article.backToAnalysis": "Back to Analysis",
    "article.published": "Published",
    "article.category": "Category",
    "article.summarize.title": "Summarize This Article",
    "article.summarize.button": "Summarize Article",
    "article.summarize.summarizing": "Summarizing…",
    "article.summarize.loading": "Loading…",
    "article.summarize.error": "Unable to generate summary. Please try again.",
    "article.summarize.retry": "Try again",
    "article.summarize.disclaimer":
      "AI-generated summary for preview purposes. Always refer to the full article for complete context.",
    "article.related.title": "Related Analysis",
    "article.contact.title": "Research & Collaboration",
    "article.contact.desc":
      "For research inquiries, institutional discussions, or strategic energy collaboration.",
    "article.contact.button": "Contact",

    // Research Listing
    "research.pageTitle": "Research & Publications",
    "research.heading": "Research & Publications",
    "research.subtitle":
      "Briefs, reports, and research notes on Algeria–Europe energy relations and Mediterranean energy security.",
    "research.allPublications": "All Publications",
    "research.noPublications": "No publications have been published yet.",
    "research.filterType": "Filter by type",
    "research.filterAll": "All",
    "research.filterCategory": "Filter by category",
    "research.viewPublication": "View publication",
    "research.published": "Published",
    "research.type": "Type",
    "research.focusHeading": "Research Focus Areas",
    "research.aiPreview": "AI Research Preview",
    "research.sourceApproach": "Source Approach",

    // Contact
    "contact.eyebrow": "Get in Touch",
    "contact.title": "Contact",
    "contact.subtitle":
      "For research inquiries, institutional discussions, or strategic energy collaboration, please reach out to RamBelEnergy.",
    "contact.email": "contact@rambelenergy.com",
    "contact.location": "Algeria & Europe",
    "contact.inquiries": "Institutional inquiries\nResearch collaboration",
    "contact.cta.title": "Collaboration & Inquiries",
    "contact.cta.desc":
      "For research, media, institutional, or strategic energy discussions, contact RamBelEnergy.",
    "contact.cta.button": "Contact",

    // Energy Focus
    "energyFocus.pageTitle": "Energy Focus",
    "energyFocus.heading": "Energy Focus",
    "energyFocus.subtitle":
      "The key energy themes and strategic topics covered by RamBelEnergy across Algeria, Africa, the Mediterranean, and Europe.",
    "energyFocus.cta": "Explore analysis",

    // Global Map
    "globalMap.pageTitle": "Global Solar Map",
    "globalMap.interactiveBadge": "External Interactive Resource",
    "globalMap.heading": "Global Solar Map",
    "globalMap.description":
      "Explore solar resource and photovoltaic power potential data for Algeria and other regions through the Global Solar Atlas — an interactive tool by the World Bank Group.",
    "globalMap.openMap": "Open Global Solar Map",
    "globalMap.homeLink": "Visit Global Solar Atlas Home",
    "globalMap.coordinatesLabel": "Algeria coordinates: 30.45°N, 0.23°E",
    "globalMap.solarDataTitle": "Solar Resource Data",
    "globalMap.solarDataDesc":
      "Access global horizontal irradiation (GHI), direct normal irradiation (DNI), and photovoltaic power potential.",
    "globalMap.interactiveTitle": "Interactive Map",
    "globalMap.interactiveDesc":
      "Zoom, pan, and click anywhere on the map to get site-specific solar data and annual PV output estimates.",
    "globalMap.algeriaFocusTitle": "Algeria Focus",
    "globalMap.algeriaFocusDesc":
      "Map pre-centered on Algeria at 30.45°N, 0.23°E — ready to explore the Sahara's world-class solar potential.",

    // AI Assistant Page
    "ai.pageTitle": "AI Assistant",
    "ai.prototypeBadge": "Limited prototype",
    "ai.heading": "AI Research Assistant",
    "ai.subtitle":
      "Paste content and ask questions. The assistant answers based only on the text you provide.",
    "ai.tryAssistant": "Try the Assistant",
    "ai.howItWorks": "How It Works",
    "ai.useCases": "Use Cases",
    "ai.sourceTrust": "Source Trust",
    "ai.disclaimer": "Disclaimer",

    // Common
    "common.home": "Home",
    "common.breadcrumb": "Breadcrumb",
    "common.readMore": "Read more",
    "common.loading": "Loading…",
    "common.error": "An error occurred.",
    "common.retry": "Try again",
    "common.back": "Back",
    "common.viewAll": "View all",
    "common.noResults": "No results found.",
    "common.contact": "Contact",
    "common.language": "Language",
  },

  fr: {
    // Navigation
    "nav.home": "Accueil",
    "nav.askEnergy": "Ask Energy",
    "nav.articles": "Articles",
    "nav.algerianSahara": "Sahara Algérien",
    "nav.globalMap": "Carte mondiale",
    "nav.about": "À propos",
    "nav.analysis": "Analyses",
    "nav.research": "Recherche",
    "nav.energyFocus": "Focus Énergie",
    "nav.aiAssistant": "Assistant IA",
    "nav.contact": "Contact",
    "nav.login": "Connexion",
    "nav.menu": "Menu",
    "nav.search": "Rechercher",
    "nav.dashboard": "Tableau de bord",
    "nav.signOut": "Déconnexion",
    "nav.signedInAs": "Connecté en tant que",
    "nav.topTagline": "Intelligence Énergétique Algérie–Europe",

    // Home Hero
    "home.hero.eyebrow": "Intelligence Énergétique Algérie–Europe",
    "home.hero.title":
      "Analyse Indépendante des Relations Énergétiques Algérie–Europe",
    "home.hero.subtitle":
      "Une plateforme professionnelle d'analyse énergétique, de veille durable et de perspective stratégique reliant l'Algérie, l'Afrique et l'Europe.",
    "home.hero.ctaAnalysis": "Lire les Dernières Analyses",
    "home.hero.ctaExplore": "Explorer le Focus Énergie",

    // Home AI Assistant
    "home.ai.eyebrow": "ASK Energy",
    "home.ai.title": "ASK Energy",
    "home.ai.description":
      "L'assistant d'intelligence énergétique alimenté par IA. Collez un contenu et posez une question — l'assistant répond uniquement à partir du texte fourni.",
    "home.ai.exampleLabel": "Exemple de question",
    "home.ai.exampleQuestion":
      "Quel rôle joue l'Algérie dans la sécurité énergétique européenne selon ce contenu ?",
    "home.ai.disclaimer":
      "Phase 1 — Cet assistant répond uniquement à partir du contenu que vous collez. Il n'effectue pas de recherches externes et n'apprend pas des conversations passées.",
    "home.ai.contextLabel": "Contexte",
    "home.ai.contextPlaceholder":
      "Collez le contenu que vous souhaitez faire référencer par l'assistant…",
    "home.ai.contextOverLimit":
      "Le contenu dépasse la limite de {max} caractères.",
    "home.ai.questionLabel": "Question",
    "home.ai.questionPlaceholder":
      "Posez une question basée sur le contexte ci-dessus…",
    "home.ai.questionOverLimit":
      "La question dépasse la limite de {max} caractères.",
    "home.ai.submit": "Demander",
    "home.ai.analyzing": "Analyse en cours…",
    "home.ai.clear": "Effacer",
    "home.ai.responseLabel": "Réponse",
    "home.ai.responseDisclaimer":
      "Cette réponse est basée uniquement sur le contenu que vous avez fourni. Veuillez la vérifier avant de vous y fier.",
    "home.ai.errorTitle":
      "Impossible de contacter le service IA. Vérifiez votre connexion et réessayez.",
    "home.ai.noContent":
      "Veuillez fournir à la fois un contenu et une question.",
    "home.ai.poweredBy": "Prototype IA Phase 1",

    // Home Strategic
    "home.strategic.eyebrow": "Focus Stratégique",
    "home.strategic.title": "Gazoduc Nigeria–Algérie–Europe",
    "home.strategic.desc":
      "Le corridor proposé représente une connexion stratégique entre les ressources énergétiques africaines et les besoins de sécurité énergétique européens, avec l'Italie et l'Espagne comme destinations importantes.",
    "home.strategic.learnMore": "En savoir plus",

    // Home Analysis
    "home.analysis.eyebrow": "Dernières Analyses",
    "home.analysis.heading": "Aperçus et commentaires récents",
    "home.analysis.viewAll": "Voir toutes les analyses",
    "home.analysis.readMore": "Lire la suite",

    // Home Sahara
    "home.sahara.eyebrow": "Solaire & Hydrogène Vert",
    "home.sahara.title":
      "L'Opportunité Solaire et Renouvelable de l'Algérie",
    "home.sahara.desc":
      "L'Algérie possède l'un des niveaux d'irradiation solaire les plus élevés au monde, en particulier sur ses vastes territoires sahariens. Cet avantage naturel positionne le pays comme un futur hub potentiel pour la production d'électricité solaire et d'hydrogène vert, contribuant à la fois à la transition énergétique nationale et à la coopération énergétique euro-africaine.",
    "home.sahara.cta": "Explorer les sources renouvelables",

    // Home Renewable Sources
    "home.renewable.eyebrow": "Références Externes Sélectionnées",
    "home.renewable.heading": "Sources d'Énergie Renouvelable Sélectionnées",
    "home.renewable.desc":
      "Références externes sélectionnées relatives aux énergies renouvelables en Algérie, à la coopération sur l'hydrogène vert et aux opportunités de développement durable.",
    "home.renewable.viewSource": "Voir la Source",

    // Home Solar Map
    "home.solarMap.eyebrow": "Explorer le Potentiel Solaire",
    "home.solarMap.heading": "Carte Solaire Mondiale",
    "home.solarMap.desc":
      "Explorez les données de ressource solaire et de potentiel photovoltaïque pour l'Algérie et d'autres régions via le Global Solar Atlas.",
    "home.solarMap.open": "Ouvrir la Carte Solaire Mondiale",

    // Home Research
    "home.research.eyebrow": "Recherche & Publications",
    "home.research.heading": "Notes, rapports et documents de recherche",
    "home.research.browse": "Parcourir les publications",
    "home.research.viewPublication": "Voir la publication",

    // Home About
    "home.about.eyebrow": "À propos du Fondateur",
    "home.about.heading": "Ramdane Belamri",
    "home.about.viewProfile": "Voir le Profil Complet",
    "home.about.researchPub": "Recherche & Publications",

    // Home Focus
    "home.focus.eyebrow": "Domaines d'Expertise",
    "home.focus.heading": "Thèmes énergétiques couverts par RamBelEnergy",

    // Home CTA
    "home.cta.eyebrow": "Contact / Collaboration",
    "home.cta.title":
      "Recherche, Médias et Collaboration Énergétique Stratégique",
    "home.cta.desc":
      "Pour des demandes de recherche, des discussions institutionnelles ou une collaboration énergétique stratégique, contactez RamBelEnergy.",
    "home.cta.button": "Contact",

    // Footer
    "footer.tagline":
      "Analyse énergétique professionnelle et veille durable axées sur les relations Algérie-Africa–Europe et la sécurité énergétique méditerranéenne.",
    "footer.disclaimer":
      "RamBelEnergy est une plateforme indépendante de journalisme, de recherche et d'analyse énergétique. Notre focus est l'analyse des politiques et de l'actualité énergétiques (en particulier Algérie-Africa–Europe).",
    "footer.copyright": "RamBelEnergy. Tous droits réservés.",
    "footer.navHeading": "Navigation",
    "footer.focusHeading": "Domaines d'Expertise",
    "footer.contactHeading": "Contact",
    "footer.location": "Algérie & Europe",
    "footer.inquiries":
      "Demandes institutionnelles\nCollaboration de recherche",
    "footer.getInTouch": "Nous contacter",

    // About
    "about.hero.eyebrow": "À propos de la Plateforme",
    "about.hero.title":
      "Analyse Énergétique Professionnelle\net Intelligence Stratégique",
    "about.hero.subtitle":
      "Une plateforme indépendante offrant des analyses éditoriales, des perspectives de recherche et une veille énergétique couvrant l'Algérie, l'Afrique et l'Europe.",
    "about.hero.note":
      "Une plateforme professionnelle présentant des analyses éditoriales, des perspectives de recherche et une intelligence énergétique stratégique à travers l'Algérie, l'Afrique et l'Europe.",
    "about.hero.visualLabel": "Recherche & contexte stratégique",
    "about.hero.visualDesc":
      "Routes énergétiques, documents politiques et coopération méditerranéenne représentés par un visuel institutionnel sobre.",
    "about.profile.eyebrow": "À propos du Fondateur",
    "about.profile.title": "Parcours Professionnel & Identité",
    "about.mission.eyebrow": "Mission",
    "about.mission.title": "Objectif et Mission Éditoriale",
    "about.values.eyebrow": "Valeurs Éditoriales",
    "about.values.heading": "Principes guidant la plateforme",
    "about.future.eyebrow": "Vision Future",
    "about.future.title":
      "D'une plateforme d'analyse aux capacités de connaissance",
    "about.future.aiNote":
      "Déclaration préliminaire uniquement. La capacité IA complète ou RAG n'est pas disponible dans le périmètre de la Phase 1.",
    "about.future.aiPreview": "Voir l'Assistant IA",
    "about.future.viewAi": "Voir l'Assistant IA",
    "about.cta.title": "Collaboration & Demandes",
    "about.cta.desc":
      "Pour des discussions de recherche, médiatiques, institutionnelles ou stratégiques sur l'énergie, contactez RamBelEnergy.",
    "about.cta.button": "Contact",

    // Analysis Listing
    "analysis.pageTitle": "Actualités & Analyses",
    "analysis.heading": "Analyse & Commentaires",
    "analysis.subtitle":
      "Analyse indépendante des relations énergétiques Algérie–Europe, de la durabilité et de la sécurité énergétique méditerranéenne.",
    "analysis.featured": "Analyse à la Une",
    "analysis.latest": "Récent",
    "analysis.allAnalysis": "Toutes les Analyses",
    "analysis.noArticles": "Aucun article n'a encore été publié.",
    "analysis.filterCategory": "Filtrer par catégorie",
    "analysis.filterAll": "Tout",
    "analysis.readMore": "Lire la suite",
    "analysis.published": "Publié",
    "analysis.category": "Catégorie",
    "analysis.aiPreview": "Aperçu IA",
    "analysis.viewAll": "Voir tout",

    // Article Detail
    "article.backToAnalysis": "Retour aux Analyses",
    "article.published": "Publié",
    "article.category": "Catégorie",
    "article.summarize.title": "Résumer cet Article",
    "article.summarize.button": "Résumer l'Article",
    "article.summarize.summarizing": "Résumé en cours…",
    "article.summarize.loading": "Chargement…",
    "article.summarize.error":
      "Impossible de générer le résumé. Veuillez réessayer.",
    "article.summarize.retry": "Réessayer",
    "article.summarize.disclaimer":
      "Résumé généré par IA à titre indicatif. Consultez toujours l'article complet pour le contexte intégral.",
    "article.related.title": "Analyses Connexes",
    "article.contact.title": "Recherche & Collaboration",
    "article.contact.desc":
      "Pour des demandes de recherche, des discussions institutionnelles ou une collaboration énergétique stratégique.",
    "article.contact.button": "Contact",

    // Research Listing
    "research.pageTitle": "Recherche & Publications",
    "research.heading": "Recherche & Publications",
    "research.subtitle":
      "Notes, rapports et documents de recherche sur les relations énergétiques Algérie–Europe et la sécurité énergétique méditerranéenne.",
    "research.allPublications": "Toutes les Publications",
    "research.noPublications": "Aucune publication n'a encore été publiée.",
    "research.filterType": "Filtrer par type",
    "research.filterAll": "Tout",
    "research.filterCategory": "Filtrer par catégorie",
    "research.viewPublication": "Voir la publication",
    "research.published": "Publié",
    "research.type": "Type",
    "research.focusHeading": "Domaines de Recherche",
    "research.aiPreview": "Aperçu IA de Recherche",
    "research.sourceApproach": "Approche des Sources",

    // Contact
    "contact.eyebrow": "Nous Contacter",
    "contact.title": "Contact",
    "contact.subtitle":
      "Pour des demandes de recherche, des discussions institutionnelles ou une collaboration énergétique stratégique, veuillez contacter RamBelEnergy.",
    "contact.email": "contact@rambelenergy.com",
    "contact.location": "Algérie & Europe",
    "contact.inquiries":
      "Demandes institutionnelles\nCollaboration de recherche",
    "contact.cta.title": "Collaboration & Demandes",
    "contact.cta.desc":
      "Pour des discussions de recherche, médiatiques, institutionnelles ou stratégiques sur l'énergie, contactez RamBelEnergy.",
    "contact.cta.button": "Contact",

    // Energy Focus
    "energyFocus.pageTitle": "Focus Énergie",
    "energyFocus.heading": "Focus Énergie",
    "energyFocus.subtitle":
      "Les thèmes énergétiques clés et les sujets stratégiques couverts par RamBelEnergy à travers l'Algérie, l'Afrique, la Méditerranée et l'Europe.",
    "energyFocus.cta": "Explorer les analyses",

    // Global Map
    "globalMap.pageTitle": "Carte Solaire Mondiale",
    "globalMap.interactiveBadge": "Ressource Interactive Externe",
    "globalMap.heading": "Carte Solaire Mondiale",
    "globalMap.description":
      "Explorez les données de ressource solaire et de potentiel photovoltaïque pour l'Algérie et d'autres régions via le Global Solar Atlas — un outil interactif du Groupe de la Banque Mondiale.",
    "globalMap.openMap": "Ouvrir la Carte Solaire Mondiale",
    "globalMap.homeLink": "Visiter la Page d'Accueil du Global Solar Atlas",
    "globalMap.coordinatesLabel": "Coordonnées Algérie : 30.45°N, 0.23°E",
    "globalMap.solarDataTitle": "Données de Ressource Solaire",
    "globalMap.solarDataDesc":
      "Accédez à l'irradiation horizontale globale (GHI), l'irradiation normale directe (DNI) et le potentiel photovoltaïque.",
    "globalMap.interactiveTitle": "Carte Interactive",
    "globalMap.interactiveDesc":
      "Zoomez, déplacez et cliquez n'importe où sur la carte pour obtenir des données solaires spécifiques au site et des estimations de production PV annuelle.",
    "globalMap.algeriaFocusTitle": "Focus Algérie",
    "globalMap.algeriaFocusDesc":
      "Carte pré-centrée sur l'Algérie à 30.45°N, 0.23°E — prête à explorer le potentiel solaire de classe mondiale du Sahara.",

    // AI Assistant Page
    "ai.pageTitle": "Assistant IA",
    "ai.prototypeBadge": "Prototype limité",
    "ai.heading": "Assistant de Recherche IA",
    "ai.subtitle":
      "Collez du contenu et posez des questions. L'assistant répond uniquement à partir du texte que vous fournissez.",
    "ai.tryAssistant": "Essayer l'Assistant",
    "ai.howItWorks": "Fonctionnement",
    "ai.useCases": "Cas d'Usage",
    "ai.sourceTrust": "Fiabilité des Sources",
    "ai.disclaimer": "Avertissement",

    // Common
    "common.home": "Accueil",
    "common.breadcrumb": "Fil d'Ariane",
    "common.readMore": "Lire la suite",
    "common.loading": "Chargement…",
    "common.error": "Une erreur est survenue.",
    "common.retry": "Réessayer",
    "common.back": "Retour",
    "common.viewAll": "Voir tout",
    "common.noResults": "Aucun résultat trouvé.",
    "common.contact": "Contact",
    "common.language": "Langue",
  },

  ar: {
    // Navigation
    "nav.home": "الرئيسية",
    "nav.askEnergy": "Ask Energy",
    "nav.articles": "المقالات",
    "nav.algerianSahara": "الصحراء الجزائرية",
    "nav.globalMap": "الخريطة العالمية",
    "nav.about": "حول",
    "nav.analysis": "تحليلات",
    "nav.research": "أبحاث",
    "nav.energyFocus": "محور الطاقة",
    "nav.aiAssistant": "المساعد الذكي",
    "nav.contact": "اتصل بنا",
    "nav.login": "تسجيل الدخول",
    "nav.menu": "القائمة",
    "nav.search": "بحث",
    "nav.dashboard": "لوحة التحكم",
    "nav.signOut": "تسجيل الخروج",
    "nav.signedInAs": "مسجل الدخول باسم",
    "nav.topTagline": "استخبارات الطاقة بين الجزائر وأوروبا",

    // Home Hero
    "home.hero.eyebrow": "استخبارات الطاقة بين الجزائر وأوروبا",
    "home.hero.title": "تحليل مستقل للعلاقات الطاقوية بين الجزائر وأوروبا",
    "home.hero.subtitle":
      "منصة مهنية لتحليل الطاقة واستخبارات الاستدامة والرؤية الاستراتيجية التي تربط الجزائر وأفريقيا وأوروبا.",
    "home.hero.ctaAnalysis": "اقرأ أحدث التحليلات",
    "home.hero.ctaExplore": "استكشف محور الطاقة",

    // Home AI Assistant
    "home.ai.eyebrow": "ASK Energy",
    "home.ai.title": "ASK Energy",
    "home.ai.description":
      "مساعد استخبارات الطاقة المدعوم بالذكاء الاصطناعي. الصق أي محتوى واطرح سؤالاً — يجيب المساعد فقط بناءً على النص الذي تقدمه.",
    "home.ai.exampleLabel": "مثال على سؤال",
    "home.ai.exampleQuestion":
      "ما هو دور الجزائر في أمن الطاقة الأوروبي وفقًا لهذا المحتوى؟",
    "home.ai.disclaimer":
      "المرحلة الأولى — يجيب هذا المساعد فقط من المحتوى الذي تلصقه. لا يبحث في مصادر خارجية ولا يتعلم من المحادثات السابقة.",
    "home.ai.contextLabel": "المحتوى",
    "home.ai.contextPlaceholder":
      "الصق المحتوى الذي تريد من المساعد الرجوع إليه…",
    "home.ai.contextOverLimit":
      "يتجاوز المحتوى الحد الأقصى البالغ {max} حرفًا.",
    "home.ai.questionLabel": "السؤال",
    "home.ai.questionPlaceholder": "اطرح سؤالاً بناءً على المحتوى أعلاه…",
    "home.ai.questionOverLimit":
      "يتجاوز السؤال الحد الأقصى البالغ {max} حرفًا.",
    "home.ai.submit": "اسأل",
    "home.ai.analyzing": "جارٍ التحليل…",
    "home.ai.clear": "مسح",
    "home.ai.responseLabel": "الرد",
    "home.ai.responseDisclaimer":
      "يستند هذا الرد فقط إلى المحتوى الذي قدمته. يرجى مراجعته قبل الاعتماد عليه.",
    "home.ai.errorTitle":
      "تعذر الوصول إلى خدمة الذكاء الاصطناعي. تحقق من اتصالك وحاول مرة أخرى.",
    "home.ai.noContent": "يرجى تقديم كل من المحتوى والسؤال.",
    "home.ai.poweredBy": "نموذج أولي للمرحلة الأولى",

    // Home Strategic
    "home.strategic.eyebrow": "محور استراتيجي مميز",
    "home.strategic.title": "خط أنابيب الغاز نيجيريا–الجزائر–أوروبا",
    "home.strategic.desc":
      "يمثل الممر المقترح رابطًا استراتيجيًا بين موارد الطاقة الأفريقية واحتياجات أمن الطاقة الأوروبية، مع إيطاليا وإسبانيا كوجهتين مهمتين.",
    "home.strategic.learnMore": "اعرف المزيد",

    // Home Analysis
    "home.analysis.eyebrow": "أحدث التحليلات",
    "home.analysis.heading": "رؤى وتعليقات حديثة",
    "home.analysis.viewAll": "عرض جميع التحليلات",
    "home.analysis.readMore": "اقرأ المزيد",

    // Home Sahara
    "home.sahara.eyebrow": "الطاقة الشمسية والهيدروجين الأخضر",
    "home.sahara.title": "فرصة الجزائر في الطاقة الشمسية والمتجددة",
    "home.sahara.desc":
      "تمتلك الجزائر أحد أعلى مستويات الإشعاع الشمسي في العالم، خاصة عبر أراضيها الصحراوية الشاسعة. هذه الميزة الطبيعية تضع البلاد كمركز محتمل مستقبلي لإنتاج الكهرباء الشمسية والهيدروجين الأخضر، مما يساهم في التحول الطاقوي المحلي والتعاون الطاقوي الأورو-أفريقي.",
    "home.sahara.cta": "استكشف المصادر المتجددة",

    // Home Renewable Sources
    "home.renewable.eyebrow": "مراجع خارجية مختارة",
    "home.renewable.heading": "مصادر الطاقة المتجددة المختارة",
    "home.renewable.desc":
      "مراجع خارجية مختارة تتعلق بالطاقة المتجددة في الجزائر والتعاون في الهيدروجين الأخضر وفرص التنمية المستدامة.",
    "home.renewable.viewSource": "عرض المصدر",

    // Home Solar Map
    "home.solarMap.eyebrow": "استكشف الإمكانات الشمسية",
    "home.solarMap.heading": "خريطة الطاقة الشمسية العالمية",
    "home.solarMap.desc":
      "استكشف بيانات الموارد الشمسية وإمكانات الطاقة الكهروضوئية للجزائر والمناطق الأخرى من خلال الأطلس الشمسي العالمي.",
    "home.solarMap.open": "افتح خريطة الطاقة الشمسية العالمية",

    // Home Research
    "home.research.eyebrow": "الأبحاث والمنشورات",
    "home.research.heading": "موجزات وتقارير ومذكرات بحثية",
    "home.research.browse": "تصفح المنشورات",
    "home.research.viewPublication": "عرض المنشور",

    // Home About
    "home.about.eyebrow": "حول المؤسس",
    "home.about.heading": "رمضان بلامري",
    "home.about.viewProfile": "عرض الملف الكامل",
    "home.about.researchPub": "الأبحاث والمنشورات",

    // Home Focus
    "home.focus.eyebrow": "مجالات التركيز",
    "home.focus.heading": "المواضيع الطاقوية التي تغطيها RamBelEnergy",

    // Home CTA
    "home.cta.eyebrow": "اتصال / تعاون",
    "home.cta.title": "البحث والإعلام والتعاون الطاقوي الاستراتيجي",
    "home.cta.desc":
      "للاستفسارات البحثية أو المناقشات المؤسسية أو التعاون الطاقوي الاستراتيجي، اتصل بـ RamBelEnergy.",
    "home.cta.button": "اتصل بنا",

    // Footer
    "footer.tagline":
      "تحليل طاقوي مهني واستخبارات استدامة تركز على العلاقات بين الجزائر وأفريقيا وأوروبا وأمن الطاقة المتوسطي.",
    "footer.disclaimer":
      "RamBelEnergy هي منصة مستقلة للصحافة والبحث والتحليل في مجال الطاقة. ينصب تركيزنا على تحليل سياسات وأخبار الطاقة (خاصة الجزائر-أفريقيا-أوروبا).",
    "footer.copyright": "RamBelEnergy. جميع الحقوق محفوظة.",
    "footer.navHeading": "التنقل",
    "footer.focusHeading": "مجالات التركيز",
    "footer.contactHeading": "اتصل بنا",
    "footer.location": "الجزائر وأوروبا",
    "footer.inquiries": "استفسارات مؤسسية\nتعاون بحثي",
    "footer.getInTouch": "تواصل معنا",

    // About
    "about.hero.eyebrow": "حول المنصة",
    "about.hero.title": "تحليل طاقوي مهني\nواستخبارات استراتيجية",
    "about.hero.subtitle":
      "منصة مستقلة تقدم تحليلات تحريرية ومنظورات بحثية واستخبارات طاقوية عبر الجزائر وأفريقيا وأوروبا.",
    "about.hero.note":
      "منصة مهنية تقدم تحليلات تحريرية ومنظورات بحثية واستخبارات طاقوية استراتيجية عبر الجزائر وأفريقيا وأوروبا.",
    "about.hero.visualLabel": "بحث وسياق استراتيجي",
    "about.hero.visualDesc":
      "مسارات الطاقة والمواد السياسية والتعاون المتوسطي ممثلة بصورة مؤسسية رصينة.",
    "about.profile.eyebrow": "ملف المؤسس",
    "about.profile.title": "الخلفية المهنية والهوية",
    "about.mission.eyebrow": "المهمة",
    "about.mission.title": "الهدف والمهمة التحريرية",
    "about.values.eyebrow": "القيم التحريرية",
    "about.values.heading": "المبادئ الموجهة للمنصة",
    "about.future.eyebrow": "رؤية مستقبلية",
    "about.future.title": "من منصة تحليل إلى قدرات معرفية",
    "about.future.aiNote":
      "بيان أولي فقط. قدرات الذكاء الاصطناعي الكاملة أو RAG غير متوفرة في نطاق المرحلة الأولى.",
    "about.future.aiPreview": "عرض المساعد الذكي",
    "about.future.viewAi": "عرض المساعد الذكي",
    "about.cta.title": "التعاون والاستفسارات",
    "about.cta.desc":
      "للمناقشات البحثية أو الإعلامية أو المؤسسية أو الاستراتيجية حول الطاقة، اتصل بـ RamBelEnergy.",
    "about.cta.button": "اتصل بنا",

    // Analysis Listing
    "analysis.pageTitle": "الأخبار والتحليلات",
    "analysis.heading": "تحليل وتعليقات",
    "analysis.subtitle":
      "تحليل مستقل للعلاقات الطاقوية بين الجزائر وأوروبا والاستدامة وأمن الطاقة المتوسطي.",
    "analysis.featured": "تحليل مميز",
    "analysis.latest": "الأحدث",
    "analysis.allAnalysis": "جميع التحليلات",
    "analysis.noArticles": "لم يتم نشر أي مقالات بعد.",
    "analysis.filterCategory": "تصفية حسب الفئة",
    "analysis.filterAll": "الكل",
    "analysis.readMore": "اقرأ المزيد",
    "analysis.published": "نُشر",
    "analysis.category": "الفئة",
    "analysis.aiPreview": "معاينة بالذكاء الاصطناعي",
    "analysis.viewAll": "عرض الكل",

    // Article Detail
    "article.backToAnalysis": "العودة إلى التحليلات",
    "article.published": "نُشر",
    "article.category": "الفئة",
    "article.summarize.title": "تلخيص هذا المقال",
    "article.summarize.button": "تلخيص المقال",
    "article.summarize.summarizing": "جارٍ التلخيص…",
    "article.summarize.loading": "جارٍ التحميل…",
    "article.summarize.error":
      "تعذر إنشاء الملخص. يرجى المحاولة مرة أخرى.",
    "article.summarize.retry": "حاول مرة أخرى",
    "article.summarize.disclaimer":
      "ملخص تم إنشاؤه بالذكاء الاصطناعي لأغراض المعاينة. يُرجى دائمًا الرجوع إلى المقال الكامل للسياق المتكامل.",
    "article.related.title": "تحليلات ذات صلة",
    "article.contact.title": "بحث وتعاون",
    "article.contact.desc":
      "للاستفسارات البحثية أو المناقشات المؤسسية أو التعاون الطاقوي الاستراتيجي.",
    "article.contact.button": "اتصل بنا",

    // Research Listing
    "research.pageTitle": "الأبحاث والمنشورات",
    "research.heading": "الأبحاث والمنشورات",
    "research.subtitle":
      "موجزات وتقارير ومذكرات بحثية حول العلاقات الطاقوية بين الجزائر وأوروبا وأمن الطاقة المتوسطي.",
    "research.allPublications": "جميع المنشورات",
    "research.noPublications": "لم يتم نشر أي منشورات بعد.",
    "research.filterType": "تصفية حسب النوع",
    "research.filterAll": "الكل",
    "research.filterCategory": "تصفية حسب الفئة",
    "research.viewPublication": "عرض المنشور",
    "research.published": "نُشر",
    "research.type": "النوع",
    "research.focusHeading": "مجالات البحث",
    "research.aiPreview": "معاينة بحث بالذكاء الاصطناعي",
    "research.sourceApproach": "نهج المصادر",

    // Contact
    "contact.eyebrow": "تواصل معنا",
    "contact.title": "اتصل بنا",
    "contact.subtitle":
      "للاستفسارات البحثية أو المناقشات المؤسسية أو التعاون الطاقوي الاستراتيجي، يرجى التواصل مع RamBelEnergy.",
    "contact.email": "contact@rambelenergy.com",
    "contact.location": "الجزائر وأوروبا",
    "contact.inquiries": "استفسارات مؤسسية\nتعاون بحثي",
    "contact.cta.title": "التعاون والاستفسارات",
    "contact.cta.desc":
      "للمناقشات البحثية أو الإعلامية أو المؤسسية أو الاستراتيجية حول الطاقة، اتصل بـ RamBelEnergy.",
    "contact.cta.button": "اتصل بنا",

    // Energy Focus
    "energyFocus.pageTitle": "محور الطاقة",
    "energyFocus.heading": "محور الطاقة",
    "energyFocus.subtitle":
      "المواضيع الطاقوية الرئيسية والموضوعات الاستراتيجية التي تغطيها RamBelEnergy عبر الجزائر وأفريقيا والمتوسط وأوروبا.",
    "energyFocus.cta": "استكشف التحليلات",

    // Global Map
    "globalMap.pageTitle": "الخريطة الشمسية العالمية",
    "globalMap.interactiveBadge": "مورد تفاعلي خارجي",
    "globalMap.heading": "الخريطة الشمسية العالمية",
    "globalMap.description":
      "استكشف بيانات الموارد الشمسية وإمكانات الطاقة الكهروضوئية للجزائر والمناطق الأخرى من خلال الأطلس الشمسي العالمي — أداة تفاعلية من مجموعة البنك الدولي.",
    "globalMap.openMap": "افتح الخريطة الشمسية العالمية",
    "globalMap.homeLink": "زيارة الصفحة الرئيسية للأطلس الشمسي العالمي",
    "globalMap.coordinatesLabel": "إحداثيات الجزائر: 30.45°N, 0.23°E",
    "globalMap.solarDataTitle": "بيانات الموارد الشمسية",
    "globalMap.solarDataDesc":
      "الوصول إلى الإشعاع الأفقي العالمي (GHI) والإشعاع العمودي المباشر (DNI) وإمكانات الطاقة الكهروضوئية.",
    "globalMap.interactiveTitle": "خريطة تفاعلية",
    "globalMap.interactiveDesc":
      "تكبير، تحريك، والنقر في أي مكان على الخريطة للحصول على بيانات شمسية محددة للموقع وتقديرات الإنتاج الكهروضوئي السنوي.",
    "globalMap.algeriaFocusTitle": "التركيز على الجزائر",
    "globalMap.algeriaFocusDesc":
      "الخريطة ممركزة مسبقًا على الجزائر عند 30.45°N, 0.23°E — جاهزة لاستكشاف الإمكانات الشمسية العالمية للصحراء.",

    // AI Assistant Page
    "ai.pageTitle": "المساعد الذكي",
    "ai.prototypeBadge": "نموذج أولي محدود",
    "ai.heading": "مساعد البحث الذكي",
    "ai.subtitle":
      "الصق المحتوى واطرح الأسئلة. يجيب المساعد فقط بناءً على النص الذي تقدمه.",
    "ai.tryAssistant": "جرّب المساعد",
    "ai.howItWorks": "كيف يعمل",
    "ai.useCases": "حالات الاستخدام",
    "ai.sourceTrust": "موثوقية المصادر",
    "ai.disclaimer": "إخلاء مسؤولية",

    // Common
    "common.home": "الرئيسية",
    "common.breadcrumb": "مسار التنقل",
    "common.readMore": "اقرأ المزيد",
    "common.loading": "جارٍ التحميل…",
    "common.error": "حدث خطأ.",
    "common.retry": "حاول مرة أخرى",
    "common.back": "رجوع",
    "common.viewAll": "عرض الكل",
    "common.noResults": "لم يتم العثور على نتائج.",
    "common.contact": "اتصل بنا",
    "common.language": "اللغة",
  },

  de: {
    // Navigation
    "nav.home": "Startseite",
    "nav.askEnergy": "Ask Energy",
    "nav.articles": "Artikel",
    "nav.algerianSahara": "Algerische Sahara",
    "nav.globalMap": "Weltkarte",
    "nav.about": "Über uns",
    "nav.analysis": "Analyse",
    "nav.research": "Forschung",
    "nav.energyFocus": "Energiefokus",
    "nav.aiAssistant": "KI-Assistent",
    "nav.contact": "Kontakt",
    "nav.login": "Anmelden",
    "nav.menu": "Menü",
    "nav.search": "Suche",
    "nav.dashboard": "Dashboard",
    "nav.signOut": "Abmelden",
    "nav.signedInAs": "Angemeldet als",
    "nav.topTagline": "Energie-Intelligence Algerien–Europa",

    // Home Hero
    "home.hero.eyebrow": "Energie-Intelligence Algerien–Europa",
    "home.hero.title": "Unabhängige Analyse der Energiebeziehungen zwischen Algerien und Europa",
    "home.hero.subtitle":
      "Eine professionelle Plattform für Energieanalyse, Nachhaltigkeits-Intelligence und strategische Einblicke, die Algerien, Afrika und Europa verbindet.",
    "home.hero.ctaAnalysis": "Neueste Analysen lesen",
    "home.hero.ctaExplore": "Energiefokus entdecken",

    // Home AI Assistant
    "home.ai.eyebrow": "ASK Energy",
    "home.ai.title": "ASK Energy",
    "home.ai.description":
      "Der KI-gestützte Energie-Intelligence-Assistent. Fügen Sie beliebige Inhalte ein und stellen Sie eine Frage — der Assistent antwortet ausschließlich auf Grundlage des von Ihnen bereitgestellten Textes.",
    "home.ai.exampleLabel": "Beispielfrage",
    "home.ai.exampleQuestion":
      "Welche Rolle spielt Algerien für die Energiesicherheit Europas laut diesem Inhalt?",
    "home.ai.disclaimer":
      "Phase 1 — Dieser Assistent antwortet nur auf Grundlage der von Ihnen eingefügten Inhalte. Er sucht nicht in externen Quellen, ruft keine Dokumente ab und lernt nicht aus früheren Gesprächen.",
    "home.ai.contextLabel": "Kontext",
    "home.ai.contextPlaceholder": "Fügen Sie den Inhalt ein, auf den sich der Assistent beziehen soll…",
    "home.ai.contextOverLimit": "Der Inhalt überschreitet die Grenze von {max} Zeichen.",
    "home.ai.questionLabel": "Frage",
    "home.ai.questionPlaceholder": "Stellen Sie eine Frage basierend auf dem obigen Kontext…",
    "home.ai.questionOverLimit": "Die Frage überschreitet die Grenze von {max} Zeichen.",
    "home.ai.submit": "Fragen",
    "home.ai.analyzing": "Analyse läuft…",
    "home.ai.clear": "Löschen",
    "home.ai.responseLabel": "Antwort",
    "home.ai.responseDisclaimer":
      "Diese Antwort basiert ausschließlich auf dem von Ihnen bereitgestellten Inhalt. Bitte überprüfen Sie sie, bevor Sie sich darauf verlassen.",
    "home.ai.errorTitle": "KI-Dienst nicht erreichbar. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
    "home.ai.noContent": "Bitte geben Sie sowohl Inhalt als auch eine Frage an.",
    "home.ai.poweredBy": "KI-Prototyp Phase 1",

    // Home Strategic
    "home.strategic.eyebrow": "Strategischer Fokus",
    "home.strategic.title": "Nigeria–Algerien–Europa-Gaspipeline",
    "home.strategic.desc":
      "Der vorgeschlagene Korridor stellt eine strategische Verbindung zwischen afrikanischen Energieressourcen und europäischen Energiesicherheitsbedürfnissen dar, mit Italien und Spanien als wichtigen Zielen.",
    "home.strategic.learnMore": "Mehr erfahren",

    // Home Analysis
    "home.analysis.eyebrow": "Neueste Analysen",
    "home.analysis.heading": "Aktuelle Einblicke und Kommentare",
    "home.analysis.viewAll": "Alle Analysen anzeigen",
    "home.analysis.readMore": "Weiterlesen",

    // Home Sahara
    "home.sahara.eyebrow": "Solar & Grüner Wasserstoff",
    "home.sahara.title": "Algeriens Chance auf Solarenergie und erneuerbare Energien",
    "home.sahara.desc":
      "Algerien verfügt über eine der höchsten Sonneneinstrahlungen weltweit, insbesondere in seinen weiten Sahara-Gebieten. Dieser natürliche Vorteil positioniert das Land als potenziellen zukünftigen Knotenpunkt für die Erzeugung von Solarstrom und die Produktion von grünem Wasserstoff und trägt sowohl zur nationalen Energiewende als auch zur euro-afrikanischen Energiekooperation bei.",
    "home.sahara.cta": "Erneuerbare Quellen entdecken",

    // Home Renewable Sources
    "home.renewable.eyebrow": "Ausgewählte Externe Referenzen",
    "home.renewable.heading": "Ausgewählte Erneuerbare Energiequellen",
    "home.renewable.desc":
      "Ausgewählte externe Referenzen zu erneuerbaren Energien in Algerien, Kooperation im Bereich grüner Wasserstoff und nachhaltige Entwicklungsmöglichkeiten.",
    "home.renewable.viewSource": "Quelle anzeigen",

    // Home Solar Map
    "home.solarMap.eyebrow": "Solarpotenzial erkunden",
    "home.solarMap.heading": "Globale Solarkarte",
    "home.solarMap.desc":
      "Erkunden Sie Daten zu Solarressourcen und Photovoltaik-Potenzial für Algerien und andere Regionen über den Global Solar Atlas.",
    "home.solarMap.open": "Globale Solarkarte öffnen",

    // Home Research
    "home.research.eyebrow": "Forschung & Publikationen",
    "home.research.heading": "Kurzberichte, Reports und Forschungsnotizen",
    "home.research.browse": "Publikationen durchsuchen",
    "home.research.viewPublication": "Publikation anzeigen",

    // Home About
    "home.about.eyebrow": "Über den Gründer",
    "home.about.heading": "Ramdane Belamri",
    "home.about.viewProfile": "Vollständiges Profil anzeigen",
    "home.about.researchPub": "Forschung & Publikationen",

    // Home Focus
    "home.focus.eyebrow": "Schwerpunkte",
    "home.focus.heading": "Energiethemen, die RamBelEnergy abdeckt",

    // Home CTA
    "home.cta.eyebrow": "Kontakt / Zusammenarbeit",
    "home.cta.title": "Forschung, Medien & Strategische Energiezusammenarbeit",
    "home.cta.desc":
      "Für Forschungsanfragen, institutionelle Gespräche oder strategische Energiezusammenarbeit kontaktieren Sie RamBelEnergy.",
    "home.cta.button": "Kontakt",

    // Footer
    "footer.tagline":
      "Professionelle Energieanalyse und Nachhaltigkeits-Intelligence mit Fokus auf die Beziehungen Algerien-Africa–Europa und die Energiesicherheit im Mittelmeerraum.",
    "footer.disclaimer":
      "RamBelEnergy ist eine unabhängige Plattform für Energie-Journalismus, -Forschung und -Analyse. Unser Fokus liegt auf energiepolitischer Analyse und Nachrichten (insbesondere Algerien-Africa–Europa).",
    "footer.copyright": "RamBelEnergy. Alle Rechte vorbehalten.",
    "footer.navHeading": "Navigation",
    "footer.focusHeading": "Schwerpunkte",
    "footer.contactHeading": "Kontakt",
    "footer.location": "Algerien & Europa",
    "footer.inquiries": "Institutionelle Anfragen\nForschungskooperation",
    "footer.getInTouch": "Kontakt aufnehmen",

    // About
    "about.hero.eyebrow": "Über die Plattform",
    "about.hero.title": "Professionelle Energieanalyse\nund Strategische Intelligence",
    "about.hero.subtitle":
      "Eine unabhängige Plattform für redaktionelle Analysen, Forschungsperspektiven und Energie-Intelligence in Algerien, Afrika und Europa.",
    "about.hero.note":
      "Eine professionelle Plattform, die redaktionelle Analysen, Forschungsperspektiven und strategische Energie-Intelligence in Algerien, Afrika und Europa präsentiert.",
    "about.hero.visualLabel": "Forschung & strategischer Kontext",
    "about.hero.visualDesc":
      "Energierouten, politisches Material und mediterrane Zusammenarbeit, dargestellt durch eine zurückhaltende institutionelle Visualisierung.",
    "about.profile.eyebrow": "Über den Gründer",
    "about.profile.title": "Beruflicher Hintergrund & Identität",
    "about.mission.eyebrow": "Mission",
    "about.mission.title": "Zweck und redaktionelle Mission",
    "about.values.eyebrow": "Redaktionelle Werte",
    "about.values.heading": "Leitprinzipien der Plattform",
    "about.future.eyebrow": "Zukunftsvision",
    "about.future.title": "Von der Analyseplattform zu Wissensfähigkeiten",
    "about.future.aiNote":
      "Nur vorläufige Aussage. Vollständige KI- oder RAG-Funktionalität ist im Umfang der Phase 1 nicht verfügbar.",
    "about.future.aiPreview": "KI-Assistenten anzeigen",
    "about.future.viewAi": "KI-Assistenten anzeigen",
    "about.cta.title": "Zusammenarbeit & Anfragen",
    "about.cta.desc":
      "Für Forschungs-, Medien-, institutionelle oder strategische Energiegespräche kontaktieren Sie RamBelEnergy.",
    "about.cta.button": "Kontakt",

    // Analysis Listing
    "analysis.pageTitle": "Nachrichten & Analyse",
    "analysis.heading": "Analyse & Kommentar",
    "analysis.subtitle":
      "Unabhängige Analyse der Energiebeziehungen zwischen Algerien und Europa, Nachhaltigkeit und Energiesicherheit im Mittelmeerraum.",
    "analysis.featured": "Vorgestellte Analyse",
    "analysis.latest": "Neueste",
    "analysis.allAnalysis": "Alle Analysen",
    "analysis.noArticles": "Es wurden noch keine Artikel veröffentlicht.",
    "analysis.filterCategory": "Nach Kategorie filtern",
    "analysis.filterAll": "Alle",
    "analysis.readMore": "Weiterlesen",
    "analysis.published": "Veröffentlicht",
    "analysis.category": "Kategorie",
    "analysis.aiPreview": "KI-Vorschau",
    "analysis.viewAll": "Alle anzeigen",

    // Article Detail
    "article.backToAnalysis": "Zurück zur Analyse",
    "article.published": "Veröffentlicht",
    "article.category": "Kategorie",
    "article.summarize.title": "Diesen Artikel zusammenfassen",
    "article.summarize.button": "Artikel zusammenfassen",
    "article.summarize.summarizing": "Wird zusammengefasst…",
    "article.summarize.loading": "Wird geladen…",
    "article.summarize.error": "Zusammenfassung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.",
    "article.summarize.retry": "Erneut versuchen",
    "article.summarize.disclaimer":
      "KI-generierte Zusammenfassung zu Vorschauzwecken. Bitte lesen Sie stets den vollständigen Artikel für den gesamten Kontext.",
    "article.related.title": "Verwandte Analysen",
    "article.contact.title": "Forschung & Zusammenarbeit",
    "article.contact.desc":
      "Für Forschungsanfragen, institutionelle Gespräche oder strategische Energiezusammenarbeit.",
    "article.contact.button": "Kontakt",

    // Research Listing
    "research.pageTitle": "Forschung & Publikationen",
    "research.heading": "Forschung & Publikationen",
    "research.subtitle":
      "Kurzberichte, Reports und Forschungsnotizen zu den Energiebeziehungen Algerien–Europa und der Energiesicherheit im Mittelmeerraum.",
    "research.allPublications": "Alle Publikationen",
    "research.noPublications": "Es wurden noch keine Publikationen veröffentlicht.",
    "research.filterType": "Nach Typ filtern",
    "research.filterAll": "Alle",
    "research.filterCategory": "Nach Kategorie filtern",
    "research.viewPublication": "Publikation anzeigen",
    "research.published": "Veröffentlicht",
    "research.type": "Typ",
    "research.focusHeading": "Forschungsschwerpunkte",
    "research.aiPreview": "KI-Forschungsvorschau",
    "research.sourceApproach": "Quellenansatz",

    // Contact
    "contact.eyebrow": "Kontaktieren Sie uns",
    "contact.title": "Kontakt",
    "contact.subtitle":
      "Für Forschungsanfragen, institutionelle Gespräche oder strategische Energiezusammenarbeit wenden Sie sich bitte an RamBelEnergy.",
    "contact.email": "contact@rambelenergy.com",
    "contact.location": "Algerien & Europa",
    "contact.inquiries": "Institutionelle Anfragen\nForschungskooperation",
    "contact.cta.title": "Zusammenarbeit & Anfragen",
    "contact.cta.desc":
      "Für Forschungs-, Medien-, institutionelle oder strategische Energiegespräche kontaktieren Sie RamBelEnergy.",
    "contact.cta.button": "Kontakt",

    // Energy Focus
    "energyFocus.pageTitle": "Energiefokus",
    "energyFocus.heading": "Energiefokus",
    "energyFocus.subtitle":
      "Die wichtigsten Energiethemen und strategischen Schwerpunkte, die RamBelEnergy in Algerien, Afrika, dem Mittelmeerraum und Europa abdeckt.",
    "energyFocus.cta": "Analysen entdecken",

    // Global Map
    "globalMap.pageTitle": "Globale Solarkarte",
    "globalMap.interactiveBadge": "Externe Interaktive Ressource",
    "globalMap.heading": "Globale Solarkarte",
    "globalMap.description":
      "Erkunden Sie Daten zu Solarressourcen und Photovoltaik-Potenzial für Algerien und andere Regionen über den Global Solar Atlas — ein interaktives Tool der Weltbankgruppe.",
    "globalMap.openMap": "Globale Solarkarte öffnen",
    "globalMap.homeLink": "Global Solar Atlas Startseite besuchen",
    "globalMap.coordinatesLabel": "Algerien Koordinaten: 30.45°N, 0.23°E",
    "globalMap.solarDataTitle": "Solarressourcendaten",
    "globalMap.solarDataDesc":
      "Zugriff auf globale Horizontalstrahlung (GHI), direkte Normalstrahlung (DNI) und Photovoltaik-Potenzial.",
    "globalMap.interactiveTitle": "Interaktive Karte",
    "globalMap.interactiveDesc":
      "Zoomen, verschieben und klicken Sie auf die Karte, um standortspezifische Solardaten und jährliche PV-Ertragsschätzungen zu erhalten.",
    "globalMap.algeriaFocusTitle": "Algerien-Fokus",
    "globalMap.algeriaFocusDesc":
      "Karte auf Algerien bei 30.45°N, 0.23°E zentriert — bereit, das Weltklasse-Solarpotenzial der Sahara zu erkunden.",

    // AI Assistant Page
    "ai.pageTitle": "KI-Assistent",
    "ai.prototypeBadge": "Eingeschränkter Prototyp",
    "ai.heading": "KI-Forschungsassistent",
    "ai.subtitle":
      "Fügen Sie Inhalte ein und stellen Sie Fragen. Der Assistent antwortet ausschließlich auf Grundlage des von Ihnen bereitgestellten Textes.",
    "ai.tryAssistant": "Assistenten ausprobieren",
    "ai.howItWorks": "So funktioniert es",
    "ai.useCases": "Anwendungsfälle",
    "ai.sourceTrust": "Quellenvertrauen",
    "ai.disclaimer": "Haftungsausschluss",

    // Common
    "common.home": "Startseite",
    "common.breadcrumb": "Breadcrumb",
    "common.readMore": "Weiterlesen",
    "common.loading": "Wird geladen…",
    "common.error": "Ein Fehler ist aufgetreten.",
    "common.retry": "Erneut versuchen",
    "common.back": "Zurück",
    "common.viewAll": "Alle anzeigen",
    "common.noResults": "Keine Ergebnisse gefunden.",
    "common.contact": "Kontakt",
    "common.language": "Sprache",
  },

  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.askEnergy": "Ask Energy",
    "nav.articles": "Artículos",
    "nav.algerianSahara": "Sahara Argelino",
    "nav.globalMap": "Mapa global",
    "nav.about": "Acerca de",
    "nav.analysis": "Análisis",
    "nav.research": "Investigación",
    "nav.energyFocus": "Enfoque Energético",
    "nav.aiAssistant": "Asistente IA",
    "nav.contact": "Contacto",
    "nav.login": "Iniciar sesión",
    "nav.menu": "Menú",
    "nav.search": "Buscar",
    "nav.dashboard": "Panel",
    "nav.signOut": "Cerrar sesión",
    "nav.signedInAs": "Conectado como",
    "nav.topTagline": "Inteligencia Energética Argelia–Europa",

    // Home Hero
    "home.hero.eyebrow": "Inteligencia Energética Argelia–Europa",
    "home.hero.title": "Análisis Independiente sobre las Relaciones Energéticas Argelia–Europa",
    "home.hero.subtitle":
      "Una plataforma profesional de análisis energético, inteligencia de sostenibilidad y visión estratégica que conecta Argelia, África y Europa.",
    "home.hero.ctaAnalysis": "Leer el Último Análisis",
    "home.hero.ctaExplore": "Explorar Enfoque Energético",

    // Home AI Assistant
    "home.ai.eyebrow": "ASK Energy",
    "home.ai.title": "ASK Energy",
    "home.ai.description":
      "El Asistente de Inteligencia Energética impulsado por IA. Pegue cualquier contenido y pregunte — el asistente responde basándose únicamente en el texto que proporcione.",
    "home.ai.exampleLabel": "Pregunta de ejemplo",
    "home.ai.exampleQuestion":
      "¿Qué papel desempeña Argelia en la seguridad energética de Europa según este contenido?",
    "home.ai.disclaimer":
      "Fase 1 — Este asistente responde solo a partir del contenido que pegue. No busca fuentes externas, no recupera documentos ni aprende de conversaciones anteriores.",
    "home.ai.contextLabel": "Contexto",
    "home.ai.contextPlaceholder": "Pegue el contenido que desea que el asistente referencie…",
    "home.ai.contextOverLimit": "El contenido supera el límite de {max} caracteres.",
    "home.ai.questionLabel": "Pregunta",
    "home.ai.questionPlaceholder": "Haga una pregunta basada en el contexto anterior…",
    "home.ai.questionOverLimit": "La pregunta supera el límite de {max} caracteres.",
    "home.ai.submit": "Preguntar",
    "home.ai.analyzing": "Analizando…",
    "home.ai.clear": "Limpiar",
    "home.ai.responseLabel": "Respuesta",
    "home.ai.responseDisclaimer":
      "Esta respuesta se basa únicamente en el contenido que proporcionó. Revísela antes de confiar en ella.",
    "home.ai.errorTitle": "No se puede acceder al servicio de IA. Verifique su conexión e intente de nuevo.",
    "home.ai.noContent": "Proporcione tanto el contenido como una pregunta.",
    "home.ai.poweredBy": "Prototipo IA Fase 1",

    // Home Strategic
    "home.strategic.eyebrow": "Enfoque Estratégico Destacado",
    "home.strategic.title": "Gasoducto Nigeria–Argelia–Europa",
    "home.strategic.desc":
      "El corredor propuesto representa una conexión estratégica entre los recursos energéticos africanos y las necesidades de seguridad energética europea, con Italia y España como destinos importantes.",
    "home.strategic.learnMore": "Más información",

    // Home Analysis
    "home.analysis.eyebrow": "Último Análisis",
    "home.analysis.heading": "Perspectivas y comentarios recientes",
    "home.analysis.viewAll": "Ver todo el análisis",
    "home.analysis.readMore": "Leer más",

    // Home Sahara
    "home.sahara.eyebrow": "Solar e Hidrógeno Verde",
    "home.sahara.title": "La Oportunidad Solar y Renovable de Argelia",
    "home.sahara.desc":
      "Argelia posee uno de los niveles de irradiación solar más altos del mundo, especialmente en sus vastos territorios saharianos. Esta ventaja natural posiciona al país como un futuro centro potencial para la generación de electricidad solar y la producción de hidrógeno verde, contribuyendo tanto a la transición energética nacional como a la cooperación energética euroafricana.",
    "home.sahara.cta": "Explorar fuentes renovables",

    // Home Renewable Sources
    "home.renewable.eyebrow": "Referencias Externas Seleccionadas",
    "home.renewable.heading": "Fuentes de Energía Renovable Seleccionadas",
    "home.renewable.desc":
      "Referencias externas seleccionadas relacionadas con la energía renovable de Argelia, la cooperación en hidrógeno verde y las oportunidades de desarrollo sostenible.",
    "home.renewable.viewSource": "Ver Fuente",

    // Home Solar Map
    "home.solarMap.eyebrow": "Explorar el Potencial Solar",
    "home.solarMap.heading": "Mapa Solar Global",
    "home.solarMap.desc":
      "Explore los datos de recursos solares y potencial de energía fotovoltaica para Argelia y otras regiones a través del Global Solar Atlas.",
    "home.solarMap.open": "Abrir Mapa Solar Global",

    // Home Research
    "home.research.eyebrow": "Investigación y Publicaciones",
    "home.research.heading": "Informes, reportes y notas de investigación",
    "home.research.browse": "Explorar publicaciones",
    "home.research.viewPublication": "Ver publicación",

    // Home About
    "home.about.eyebrow": "Sobre el Fundador",
    "home.about.heading": "Ramdane Belamri",
    "home.about.viewProfile": "Ver Perfil Completo",
    "home.about.researchPub": "Investigación y Publicaciones",

    // Home Focus
    "home.focus.eyebrow": "Áreas de Enfoque",
    "home.focus.heading": "Temas energéticos cubiertos por RamBelEnergy",

    // Home CTA
    "home.cta.eyebrow": "Contacto / Colaboración",
    "home.cta.title": "Investigación, Medios y Colaboración Energética Estratégica",
    "home.cta.desc":
      "Para consultas de investigación, debates institucionales o colaboración energética estratégica, contacte con RamBelEnergy.",
    "home.cta.button": "Contacto",

    // Footer
    "footer.tagline":
      "Análisis energético profesional e inteligencia de sostenibilidad centrados en las relaciones Argelia-Africa–Europa y la seguridad energética del Mediterráneo.",
    "footer.disclaimer":
      "RamBelEnergy es una plataforma independiente de periodismo, investigación y análisis energético. Nuestro enfoque es el análisis de políticas y noticias energéticas (particularmente Argelia-Africa–Europa).",
    "footer.copyright": "RamBelEnergy. Todos los derechos reservados.",
    "footer.navHeading": "Navegación",
    "footer.focusHeading": "Áreas de Enfoque",
    "footer.contactHeading": "Contacto",
    "footer.location": "Argelia y Europa",
    "footer.inquiries": "Consultas institucionales\nColaboración en investigación",
    "footer.getInTouch": "Contactar",

    // About
    "about.hero.eyebrow": "Acerca de la Plataforma",
    "about.hero.title": "Análisis Energético Profesional\ne Inteligencia Estratégica",
    "about.hero.subtitle":
      "Una plataforma independiente que ofrece análisis editorial, perspectiva de investigación e inteligencia energética en Argelia, África y Europa.",
    "about.hero.note":
      "Una plataforma profesional que presenta análisis editorial, perspectiva de investigación e inteligencia energética estratégica en Argelia, África y Europa.",
    "about.hero.visualLabel": "Investigación y contexto estratégico",
    "about.hero.visualDesc":
      "Rutas energéticas, material político y cooperación mediterránea representados a través de una imagen institucional sobria.",
    "about.profile.eyebrow": "Sobre el Fundador",
    "about.profile.title": "Trayectoria Profesional e Identidad",
    "about.mission.eyebrow": "Misión",
    "about.mission.title": "Propósito y Misión Editorial",
    "about.values.eyebrow": "Valores Editoriales",
    "about.values.heading": "Principios que guían la plataforma",
    "about.future.eyebrow": "Visión de Futuro",
    "about.future.title": "De plataforma de análisis a capacidades de conocimiento",
    "about.future.aiNote":
      "Solo declaración preliminar. La capacidad completa de IA o RAG no está disponible en el alcance de la Fase 1.",
    "about.future.aiPreview": "Ver Asistente IA",
    "about.future.viewAi": "Ver Asistente IA",
    "about.cta.title": "Colaboración y Consultas",
    "about.cta.desc":
      "Para debates de investigación, medios, institucionales o estratégicos sobre energía, contacte con RamBelEnergy.",
    "about.cta.button": "Contacto",

    // Analysis Listing
    "analysis.pageTitle": "Noticias y Análisis",
    "analysis.heading": "Análisis y Comentarios",
    "analysis.subtitle":
      "Análisis independiente sobre las relaciones energéticas Argelia–Europa, la sostenibilidad y la seguridad energética del Mediterráneo.",
    "analysis.featured": "Análisis Destacado",
    "analysis.latest": "Más Reciente",
    "analysis.allAnalysis": "Todo el Análisis",
    "analysis.noArticles": "Aún no se han publicado artículos.",
    "analysis.filterCategory": "Filtrar por categoría",
    "analysis.filterAll": "Todos",
    "analysis.readMore": "Leer más",
    "analysis.published": "Publicado",
    "analysis.category": "Categoría",
    "analysis.aiPreview": "Vista Previa IA",
    "analysis.viewAll": "Ver todo",

    // Article Detail
    "article.backToAnalysis": "Volver a Análisis",
    "article.published": "Publicado",
    "article.category": "Categoría",
    "article.summarize.title": "Resumir Este Artículo",
    "article.summarize.button": "Resumir Artículo",
    "article.summarize.summarizing": "Resumiendo…",
    "article.summarize.loading": "Cargando…",
    "article.summarize.error": "No se pudo generar el resumen. Inténtelo de nuevo.",
    "article.summarize.retry": "Intentar de nuevo",
    "article.summarize.disclaimer":
      "Resumen generado por IA con fines de vista previa. Consulte siempre el artículo completo para el contexto íntegro.",
    "article.related.title": "Análisis Relacionado",
    "article.contact.title": "Investigación y Colaboración",
    "article.contact.desc":
      "Para consultas de investigación, debates institucionales o colaboración energética estratégica.",
    "article.contact.button": "Contacto",

    // Research Listing
    "research.pageTitle": "Investigación y Publicaciones",
    "research.heading": "Investigación y Publicaciones",
    "research.subtitle":
      "Informes, reportes y notas de investigación sobre las relaciones energéticas Argelia–Europa y la seguridad energética del Mediterráneo.",
    "research.allPublications": "Todas las Publicaciones",
    "research.noPublications": "Aún no se han publicado publicaciones.",
    "research.filterType": "Filtrar por tipo",
    "research.filterAll": "Todos",
    "research.filterCategory": "Filtrar por categoría",
    "research.viewPublication": "Ver publicación",
    "research.published": "Publicado",
    "research.type": "Tipo",
    "research.focusHeading": "Áreas de Investigación",
    "research.aiPreview": "Vista Previa de Investigación IA",
    "research.sourceApproach": "Enfoque de Fuentes",

    // Contact
    "contact.eyebrow": "Contactar",
    "contact.title": "Contacto",
    "contact.subtitle":
      "Para consultas de investigación, debates institucionales o colaboración energética estratégica, contacte con RamBelEnergy.",
    "contact.email": "contact@rambelenergy.com",
    "contact.location": "Argelia y Europa",
    "contact.inquiries": "Consultas institucionales\nColaboración en investigación",
    "contact.cta.title": "Colaboración y Consultas",
    "contact.cta.desc":
      "Para debates de investigación, medios, institucionales o estratégicos sobre energía, contacte con RamBelEnergy.",
    "contact.cta.button": "Contacto",

    // Energy Focus
    "energyFocus.pageTitle": "Enfoque Energético",
    "energyFocus.heading": "Enfoque Energético",
    "energyFocus.subtitle":
      "Los temas energéticos clave y los asuntos estratégicos cubiertos por RamBelEnergy en Argelia, África, el Mediterráneo y Europa.",
    "energyFocus.cta": "Explorar análisis",

    // Global Map
    "globalMap.pageTitle": "Mapa Solar Global",
    "globalMap.interactiveBadge": "Recurso Interactivo Externo",
    "globalMap.heading": "Mapa Solar Global",
    "globalMap.description":
      "Explore los datos de recursos solares y potencial de energía fotovoltaica para Argelia y otras regiones a través del Global Solar Atlas — una herramienta interactiva del Grupo del Banco Mundial.",
    "globalMap.openMap": "Abrir Mapa Solar Global",
    "globalMap.homeLink": "Visitar la Página del Global Solar Atlas",
    "globalMap.coordinatesLabel": "Coordenadas de Argelia: 30.45°N, 0.23°E",
    "globalMap.solarDataTitle": "Datos de Recursos Solares",
    "globalMap.solarDataDesc":
      "Acceda a la irradiación horizontal global (GHI), irradiación normal directa (DNI) y potencial de energía fotovoltaica.",
    "globalMap.interactiveTitle": "Mapa Interactivo",
    "globalMap.interactiveDesc":
      "Acérquese, desplace y haga clic en cualquier lugar del mapa para obtener datos solares específicos del sitio y estimaciones de producción fotovoltaica anual.",
    "globalMap.algeriaFocusTitle": "Enfoque Argelia",
    "globalMap.algeriaFocusDesc":
      "Mapa pre-centrado en Argelia a 30.45°N, 0.23°E — listo para explorar el potencial solar de clase mundial del Sahara.",

    // AI Assistant Page
    "ai.pageTitle": "Asistente IA",
    "ai.prototypeBadge": "Prototipo limitado",
    "ai.heading": "Asistente de Investigación IA",
    "ai.subtitle":
      "Pegue contenido y haga preguntas. El asistente responde basándose únicamente en el texto que proporcione.",
    "ai.tryAssistant": "Probar el Asistente",
    "ai.howItWorks": "Cómo Funciona",
    "ai.useCases": "Casos de Uso",
    "ai.sourceTrust": "Fiabilidad de Fuentes",
    "ai.disclaimer": "Aviso Legal",

    // Common
    "common.home": "Inicio",
    "common.breadcrumb": "Ruta de navegación",
    "common.readMore": "Leer más",
    "common.loading": "Cargando…",
    "common.error": "Se produjo un error.",
    "common.retry": "Intentar de nuevo",
    "common.back": "Volver",
    "common.viewAll": "Ver todo",
    "common.noResults": "No se encontraron resultados.",
    "common.contact": "Contacto",
    "common.language": "Idioma",
  },

  it: {
    // Navigation
    "nav.home": "Home",
    "nav.askEnergy": "Ask Energy",
    "nav.articles": "Articoli",
    "nav.algerianSahara": "Sahara Algerino",
    "nav.globalMap": "Mappa globale",
    "nav.about": "Chi siamo",
    "nav.analysis": "Analisi",
    "nav.research": "Ricerca",
    "nav.energyFocus": "Focus Energia",
    "nav.aiAssistant": "Assistente IA",
    "nav.contact": "Contatti",
    "nav.login": "Accedi",
    "nav.menu": "Menu",
    "nav.search": "Cerca",
    "nav.dashboard": "Dashboard",
    "nav.signOut": "Esci",
    "nav.signedInAs": "Accesso come",
    "nav.topTagline": "Intelligence Energetica Algeria–Europa",

    // Home Hero
    "home.hero.eyebrow": "Intelligence Energetica Algeria–Europa",
    "home.hero.title": "Analisi Indipendente sulle Relazioni Energetiche Algeria–Europa",
    "home.hero.subtitle":
      "Una piattaforma professionale per l'analisi energetica, l'intelligence sulla sostenibilità e la visione strategica che collega Algeria, Africa ed Europa.",
    "home.hero.ctaAnalysis": "Leggi le Ultime Analisi",
    "home.hero.ctaExplore": "Esplora il Focus Energia",

    // Home AI Assistant
    "home.ai.eyebrow": "ASK Energy",
    "home.ai.title": "ASK Energy",
    "home.ai.description":
      "L'Assistente di Intelligence Energetica basato su IA. Incolla qualsiasi contenuto e fai una domanda — l'assistente risponde solo in base al testo fornito.",
    "home.ai.exampleLabel": "Esempio di domanda",
    "home.ai.exampleQuestion":
      "Qual è il ruolo dell'Algeria nella sicurezza energetica europea secondo questo contenuto?",
    "home.ai.disclaimer":
      "Fase 1 — Questo assistente risponde solo in base al contenuto che incolli. Non cerca fonti esterne, non recupera documenti né apprende dalle conversazioni passate.",
    "home.ai.contextLabel": "Contesto",
    "home.ai.contextPlaceholder": "Incolla il contenuto a cui l'assistente deve fare riferimento…",
    "home.ai.contextOverLimit": "Il contenuto supera il limite di {max} caratteri.",
    "home.ai.questionLabel": "Domanda",
    "home.ai.questionPlaceholder": "Fai una domanda basata sul contesto sopra…",
    "home.ai.questionOverLimit": "La domanda supera il limite di {max} caratteri.",
    "home.ai.submit": "Chiedi",
    "home.ai.analyzing": "Analisi in corso…",
    "home.ai.clear": "Cancella",
    "home.ai.responseLabel": "Risposta",
    "home.ai.responseDisclaimer":
      "Questa risposta si basa solo sul contenuto fornito. Verificala prima di farvi affidamento.",
    "home.ai.errorTitle": "Impossibile raggiungere il servizio IA. Verifica la connessione e riprova.",
    "home.ai.noContent": "Fornisci sia il contenuto che una domanda.",
    "home.ai.poweredBy": "Prototipo IA Fase 1",

    // Home Strategic
    "home.strategic.eyebrow": "Focus Strategico in Evidenza",
    "home.strategic.title": "Gasdotto Nigeria–Algeria–Europa",
    "home.strategic.desc":
      "Il corridoio proposto rappresenta una connessione strategica tra le risorse energetiche africane e le esigenze di sicurezza energetica europea, con Italia e Spagna come destinazioni importanti.",
    "home.strategic.learnMore": "Scopri di più",

    // Home Analysis
    "home.analysis.eyebrow": "Ultime Analisi",
    "home.analysis.heading": "Approfondimenti e commenti recenti",
    "home.analysis.viewAll": "Vedi tutte le analisi",
    "home.analysis.readMore": "Leggi di più",

    // Home Sahara
    "home.sahara.eyebrow": "Solare e Idrogeno Verde",
    "home.sahara.title": "L'Opportunità Solare e Rinnovabile dell'Algeria",
    "home.sahara.desc":
      "L'Algeria possiede uno dei livelli di irradiazione solare più elevati al mondo, specialmente nei suoi vasti territori sahariani. Questo vantaggio naturale posiziona il paese come futuro hub potenziale per la generazione di elettricità solare e la produzione di idrogeno verde, contribuendo sia alla transizione energetica nazionale che alla cooperazione energetica euro-africana.",
    "home.sahara.cta": "Esplora le fonti rinnovabili",

    // Home Renewable Sources
    "home.renewable.eyebrow": "Riferimenti Esterni Selezionati",
    "home.renewable.heading": "Fonti di Energia Rinnovabile Selezionate",
    "home.renewable.desc":
      "Riferimenti esterni selezionati relativi all'energia rinnovabile in Algeria, alla cooperazione sull'idrogeno verde e alle opportunità di sviluppo sostenibile.",
    "home.renewable.viewSource": "Visualizza Fonte",

    // Home Solar Map
    "home.solarMap.eyebrow": "Esplora il Potenziale Solare",
    "home.solarMap.heading": "Mappa Solare Globale",
    "home.solarMap.desc":
      "Esplora i dati sulle risorse solari e il potenziale di energia fotovoltaica per l'Algeria e altre regioni attraverso il Global Solar Atlas.",
    "home.solarMap.open": "Apri la Mappa Solare Globale",

    // Home Research
    "home.research.eyebrow": "Ricerca e Pubblicazioni",
    "home.research.heading": "Brief, rapporti e note di ricerca",
    "home.research.browse": "Sfoglia le pubblicazioni",
    "home.research.viewPublication": "Visualizza pubblicazione",

    // Home About
    "home.about.eyebrow": "Il Fondatore",
    "home.about.heading": "Ramdane Belamri",
    "home.about.viewProfile": "Visualizza Profilo Completo",
    "home.about.researchPub": "Ricerca e Pubblicazioni",

    // Home Focus
    "home.focus.eyebrow": "Aree di Focus",
    "home.focus.heading": "Temi energetici trattati da RamBelEnergy",

    // Home CTA
    "home.cta.eyebrow": "Contatti / Collaborazione",
    "home.cta.title": "Ricerca, Media e Collaborazione Energetica Strategica",
    "home.cta.desc":
      "Per richieste di ricerca, discussioni istituzionali o collaborazione energetica strategica, contatta RamBelEnergy.",
    "home.cta.button": "Contatti",

    // Footer
    "footer.tagline":
      "Analisi energetica professionale e intelligence sulla sostenibilità focalizzate sulle relazioni Algeria-Africa–Europa e sulla sicurezza energetica del Mediterraneo.",
    "footer.disclaimer":
      "RamBelEnergy è una piattaforma indipendente di giornalismo, ricerca e analisi energetica. Il nostro focus è l'analisi delle politiche e delle notizie energetiche (in particolare Algeria-Africa–Europa).",
    "footer.copyright": "RamBelEnergy. Tutti i diritti riservati.",
    "footer.navHeading": "Navigazione",
    "footer.focusHeading": "Aree di Focus",
    "footer.contactHeading": "Contatti",
    "footer.location": "Algeria ed Europa",
    "footer.inquiries": "Richieste istituzionali\nCollaborazione di ricerca",
    "footer.getInTouch": "Contattaci",

    // About
    "about.hero.eyebrow": "La Piattaforma",
    "about.hero.title": "Analisi Energetica Professionale\ne Intelligence Strategica",
    "about.hero.subtitle":
      "Una piattaforma indipendente che fornisce analisi editoriali, prospettive di ricerca e intelligence energetica in Algeria, Africa ed Europa.",
    "about.hero.note":
      "Una piattaforma professionale che presenta analisi editoriali, prospettive di ricerca e intelligence energetica strategica in Algeria, Africa ed Europa.",
    "about.hero.visualLabel": "Ricerca e contesto strategico",
    "about.hero.visualDesc":
      "Rotte energetiche, materiali politici e cooperazione mediterranea rappresentati attraverso un'immagine istituzionale sobria.",
    "about.profile.eyebrow": "Il Fondatore",
    "about.profile.title": "Background Professionale e Identità",
    "about.mission.eyebrow": "Missione",
    "about.mission.title": "Scopo e Missione Editoriale",
    "about.values.eyebrow": "Valori Editoriali",
    "about.values.heading": "Principi che guidano la piattaforma",
    "about.future.eyebrow": "Visione Futura",
    "about.future.title": "Da piattaforma di analisi a capacità di conoscenza",
    "about.future.aiNote":
      "Solo dichiarazione preliminare. La piena capacità IA o RAG non è disponibile nell'ambito della Fase 1.",
    "about.future.aiPreview": "Visualizza Assistente IA",
    "about.future.viewAi": "Visualizza Assistente IA",
    "about.cta.title": "Collaborazione e Richieste",
    "about.cta.desc":
      "Per discussioni di ricerca, media, istituzionali o strategiche sull'energia, contatta RamBelEnergy.",
    "about.cta.button": "Contatti",

    // Analysis Listing
    "analysis.pageTitle": "Notizie e Analisi",
    "analysis.heading": "Analisi e Commenti",
    "analysis.subtitle":
      "Analisi indipendente sulle relazioni energetiche Algeria–Europa, la sostenibilità e la sicurezza energetica del Mediterraneo.",
    "analysis.featured": "Analisi in Evidenza",
    "analysis.latest": "Recenti",
    "analysis.allAnalysis": "Tutte le Analisi",
    "analysis.noArticles": "Nessun articolo è stato ancora pubblicato.",
    "analysis.filterCategory": "Filtra per categoria",
    "analysis.filterAll": "Tutti",
    "analysis.readMore": "Leggi di più",
    "analysis.published": "Pubblicato",
    "analysis.category": "Categoria",
    "analysis.aiPreview": "Anteprima IA",
    "analysis.viewAll": "Vedi tutti",

    // Article Detail
    "article.backToAnalysis": "Torna alle Analisi",
    "article.published": "Pubblicato",
    "article.category": "Categoria",
    "article.summarize.title": "Riassumi Questo Articolo",
    "article.summarize.button": "Riassumi Articolo",
    "article.summarize.summarizing": "Riassunto in corso…",
    "article.summarize.loading": "Caricamento…",
    "article.summarize.error": "Impossibile generare il riassunto. Riprova.",
    "article.summarize.retry": "Riprova",
    "article.summarize.disclaimer":
      "Riassunto generato dall'IA a scopo di anteprima. Consulta sempre l'articolo completo per il contesto integrale.",
    "article.related.title": "Analisi Correlate",
    "article.contact.title": "Ricerca e Collaborazione",
    "article.contact.desc":
      "Per richieste di ricerca, discussioni istituzionali o collaborazione energetica strategica.",
    "article.contact.button": "Contatti",

    // Research Listing
    "research.pageTitle": "Ricerca e Pubblicazioni",
    "research.heading": "Ricerca e Pubblicazioni",
    "research.subtitle":
      "Brief, rapporti e note di ricerca sulle relazioni energetiche Algeria–Europa e la sicurezza energetica del Mediterraneo.",
    "research.allPublications": "Tutte le Pubblicazioni",
    "research.noPublications": "Nessuna pubblicazione è stata ancora pubblicata.",
    "research.filterType": "Filtra per tipo",
    "research.filterAll": "Tutti",
    "research.filterCategory": "Filtra per categoria",
    "research.viewPublication": "Visualizza pubblicazione",
    "research.published": "Pubblicato",
    "research.type": "Tipo",
    "research.focusHeading": "Aree di Ricerca",
    "research.aiPreview": "Anteprima Ricerca IA",
    "research.sourceApproach": "Approccio alle Fonti",

    // Contact
    "contact.eyebrow": "Contattaci",
    "contact.title": "Contatti",
    "contact.subtitle":
      "Per richieste di ricerca, discussioni istituzionali o collaborazione energetica strategica, contatta RamBelEnergy.",
    "contact.email": "contact@rambelenergy.com",
    "contact.location": "Algeria ed Europa",
    "contact.inquiries": "Richieste istituzionali\nCollaborazione di ricerca",
    "contact.cta.title": "Collaborazione e Richieste",
    "contact.cta.desc":
      "Per discussioni di ricerca, media, istituzionali o strategiche sull'energia, contatta RamBelEnergy.",
    "contact.cta.button": "Contatti",

    // Energy Focus
    "energyFocus.pageTitle": "Focus Energia",
    "energyFocus.heading": "Focus Energia",
    "energyFocus.subtitle":
      "I temi energetici chiave e gli argomenti strategici trattati da RamBelEnergy in Algeria, Africa, Mediterraneo ed Europa.",
    "energyFocus.cta": "Esplora le analisi",

    // Global Map
    "globalMap.pageTitle": "Mappa Solare Globale",
    "globalMap.interactiveBadge": "Risorsa Interattiva Esterna",
    "globalMap.heading": "Mappa Solare Globale",
    "globalMap.description":
      "Esplora i dati sulle risorse solari e il potenziale di energia fotovoltaica per l'Algeria e altre regioni attraverso il Global Solar Atlas — uno strumento interattivo del Gruppo della Banca Mondiale.",
    "globalMap.openMap": "Apri Mappa Solare Globale",
    "globalMap.homeLink": "Visita la Home del Global Solar Atlas",
    "globalMap.coordinatesLabel": "Coordinate Algeria: 30.45°N, 0.23°E",
    "globalMap.solarDataTitle": "Dati sulle Risorse Solari",
    "globalMap.solarDataDesc":
      "Accedi all'irradiazione orizzontale globale (GHI), all'irradiazione normale diretta (DNI) e al potenziale fotovoltaico.",
    "globalMap.interactiveTitle": "Mappa Interattiva",
    "globalMap.interactiveDesc":
      "Zoom, sposta e clicca ovunque sulla mappa per ottenere dati solari specifici del sito e stime di produzione fotovoltaica annuale.",
    "globalMap.algeriaFocusTitle": "Focus Algeria",
    "globalMap.algeriaFocusDesc":
      "Mappa pre-centrata sull'Algeria a 30.45°N, 0.23°E — pronta per esplorare il potenziale solare di livello mondiale del Sahara.",

    // AI Assistant Page
    "ai.pageTitle": "Assistente IA",
    "ai.prototypeBadge": "Prototipo limitato",
    "ai.heading": "Assistente di Ricerca IA",
    "ai.subtitle":
      "Incolla il contenuto e fai domande. L'assistente risponde solo in base al testo fornito.",
    "ai.tryAssistant": "Prova l'Assistente",
    "ai.howItWorks": "Come Funziona",
    "ai.useCases": "Casi d'Uso",
    "ai.sourceTrust": "Affidabilità delle Fonti",
    "ai.disclaimer": "Avvertenza",

    // Common
    "common.home": "Home",
    "common.breadcrumb": "Briciole di pane",
    "common.readMore": "Leggi di più",
    "common.loading": "Caricamento…",
    "common.error": "Si è verificato un errore.",
    "common.retry": "Riprova",
    "common.back": "Indietro",
    "common.viewAll": "Vedi tutti",
    "common.noResults": "Nessun risultato trovato.",
    "common.contact": "Contatti",
    "common.language": "Lingua",
  },
};

export function getTranslations(lang: Language): TranslationMap {
  return translations[lang] || translations.en;
}

export function t(lang: Language, key: TranslationKey): string {
  const map = getTranslations(lang);
  return map[key] ?? translations.en[key] ?? key;
}
