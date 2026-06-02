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
      "Professional energy analysis and sustainability intelligence focused on Algeria–Europe relations and Mediterranean energy security.",
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
      "Analyse énergétique professionnelle et veille durable axées sur les relations Algérie–Europe et la sécurité énergétique méditerranéenne.",
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
      "تحليل طاقوي مهني واستخبارات استدامة تركز على العلاقات بين الجزائر وأوروبا وأمن الطاقة المتوسطي.",
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
};

export function getTranslations(lang: Language): TranslationMap {
  return translations[lang] || translations.en;
}

export function t(lang: Language, key: TranslationKey): string {
  const map = getTranslations(lang);
  return map[key] ?? translations.en[key] ?? key;
}
