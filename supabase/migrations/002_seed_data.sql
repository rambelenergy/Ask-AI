-- RamBelEnergy CMS — Seed Data
-- Migration: 002_seed_data
-- NOTE: All content is placeholder. Replace with real content during CMS setup.

-- ─────────────────────────────────────────────
-- Seed: articles
-- ─────────────────────────────────────────────
INSERT INTO public.articles (slug, title, excerpt, body, body_html, cover_image_url, category, source, is_featured, published_at, status)
VALUES
  (
    'nigeria-algeria-europe-pipeline',
    'Nigeria–Algeria–Europe Gas Pipeline: A Strategic Corridor for European Energy Security',
    'A research-oriented analysis of the proposed corridor''s strategic importance, infrastructure challenges, financing complexity, and potential role in Europe''s long-term energy diversification.',
    '[PLACEHOLDER: Full article body in markdown format]',
    '<p>[PLACEHOLDER: Full article body in HTML format]</p>',
    '/images/placeholders/article-cover-1.jpg',
    'Energy Security',
    'Policy Analysis',
    true,
    NOW() - INTERVAL '5 days',
    'published'
  ),
  (
    'why-algeria-matters',
    'Why Algeria Matters in Europe''s Energy Future',
    'Concise analysis connecting infrastructure, policy, and regional cooperation priorities.',
    '[PLACEHOLDER: Full article body in markdown format]',
    '<p>[PLACEHOLDER: Full article body in HTML format]</p>',
    '/images/placeholders/article-cover-2.jpg',
    'Energy Future',
    'Strategic Note',
    false,
    NOW() - INTERVAL '10 days',
    'published'
  ),
  (
    'italy-spain-gateways',
    'Italy and Spain as Key Destinations for Algerian Energy',
    'Concise analysis connecting infrastructure, policy, and regional cooperation priorities.',
    '[PLACEHOLDER: Full article body in markdown format]',
    '<p>[PLACEHOLDER: Full article body in HTML format]</p>',
    '/images/placeholders/article-cover-3.jpg',
    'Mediterranean Routes',
    'Regional Analysis',
    false,
    NOW() - INTERVAL '15 days',
    'published'
  ),
  (
    'solar-energy-algeria',
    'Solar Energy and the Next Phase of Algeria–Europe Cooperation',
    'Concise analysis connecting infrastructure, policy, and regional cooperation priorities.',
    '[PLACEHOLDER: Full article body in markdown format]',
    '<p>[PLACEHOLDER: Full article body in HTML format]</p>',
    '/images/placeholders/article-cover-4.jpg',
    'Sustainability',
    'Sustainability Report',
    false,
    NOW() - INTERVAL '20 days',
    'published'
  ),
  (
    'algeria-europe-diversification',
    'Algeria''s Role in Europe''s Energy Diversification',
    'How Algeria''s energy infrastructure, geography, and policy relationships shape Europe''s diversification strategy.',
    '[PLACEHOLDER: Full article body in markdown format]',
    '<p>[PLACEHOLDER: Full article body in HTML format]</p>',
    '/images/placeholders/article-cover-5.jpg',
    'Energy Security',
    'Policy Analysis',
    false,
    NOW() - INTERVAL '25 days',
    'published'
  ),
  (
    'draft-article-example',
    'Draft Article — Under Review',
    'This is a draft article that is not yet published.',
    '[PLACEHOLDER: Draft content]',
    '<p>[PLACEHOLDER: Draft content]</p>',
    NULL,
    'Geopolitics',
    'Internal Note',
    false,
    NULL,
    'draft'
  );

-- ─────────────────────────────────────────────
-- Seed: publications
-- ─────────────────────────────────────────────
INSERT INTO public.publications (slug, title, excerpt, body, body_html, cover_image_url, pub_type, category, region, published_at, status)
VALUES
  (
    'algeria-europe-strategic-outlook',
    'Algeria–Europe Energy Relations: Strategic Outlook',
    'A strategic overview of Algeria''s role in European energy diversification, gas infrastructure, and future sustainability cooperation.',
    '[PLACEHOLDER: Full publication body in markdown format]',
    '<p>[PLACEHOLDER: Full publication body in HTML format]</p>',
    '/images/placeholders/pub-cover-1.jpg',
    'Policy Brief',
    'Energy Security',
    'Algeria / Europe',
    NOW() - INTERVAL '3 days',
    'published'
  ),
  (
    'nigeria-algeria-europe-pipeline-research',
    'Nigeria–Algeria–Europe Gas Pipeline: Strategic Implications',
    'A focused assessment of the proposed corridor''s strategic value, infrastructure challenges, and implications for European energy security.',
    '[PLACEHOLDER: Full publication body in markdown format]',
    '<p>[PLACEHOLDER: Full publication body in HTML format]</p>',
    '/images/placeholders/pub-cover-2.jpg',
    'Research Note',
    'Energy Security',
    'Africa / Europe',
    NOW() - INTERVAL '8 days',
    'published'
  ),
  (
    'solar-energy-algeria-research',
    'Solar Energy in Algeria: Long-Term Opportunity for Europe',
    'A policy-oriented view of Algeria''s solar potential, domestic transition needs, and future cooperation with European markets.',
    '[PLACEHOLDER: Full publication body in markdown format]',
    '<p>[PLACEHOLDER: Full publication body in HTML format]</p>',
    '/images/placeholders/pub-cover-3.jpg',
    'Policy Brief',
    'Sustainability',
    'Algeria / Europe',
    NOW() - INTERVAL '14 days',
    'published'
  ),
  (
    'italy-spain-exports',
    'Italy and Spain in the Future of Algerian Energy Exports',
    'How Southern European routes, interconnections, and LNG infrastructure shape Algeria''s long-term export strategy.',
    '[PLACEHOLDER: Full publication body in markdown format]',
    '<p>[PLACEHOLDER: Full publication body in HTML format]</p>',
    '/images/placeholders/pub-cover-4.jpg',
    'Analysis',
    'Infrastructure',
    'Mediterranean',
    NOW() - INTERVAL '20 days',
    'published'
  ),
  (
    'mediterranean-energy-security',
    'Mediterranean Energy Security After the Global Gas Shift',
    'An examination of Mediterranean energy flows after recent global gas market changes and Europe''s diversification efforts.',
    '[PLACEHOLDER: Full publication body in markdown format]',
    '<p>[PLACEHOLDER: Full publication body in HTML format]</p>',
    '/images/placeholders/pub-cover-5.jpg',
    'Research Note',
    'Geopolitics',
    'Mediterranean',
    NOW() - INTERVAL '30 days',
    'published'
  ),
  (
    'draft-publication-example',
    'Draft Publication — Under Review',
    'This is a draft publication that is not yet published.',
    '[PLACEHOLDER: Draft content]',
    '<p>[PLACEHOLDER: Draft content]</p>',
    NULL,
    'Report',
    'Energy Policy',
    'Europe',
    NULL,
    'draft'
  );

-- ─────────────────────────────────────────────
-- Seed: site_content (homepage blocks)
-- ─────────────────────────────────────────────
INSERT INTO public.site_content (block_key, label, content_json)
VALUES
  (
    'hero',
    'Homepage Hero',
    '{
      "eyebrow": "Independent Energy Analysis",
      "title": "Algeria–Europe Energy Relations",
      "subtitle": "Research, analysis, and strategic insight on gas infrastructure, energy security, solar potential, and Mediterranean cooperation.",
      "cta_label": "Explore Analysis",
      "cta_href": "/analysis"
    }'
  ),
  (
    'strategic_priorities',
    'Strategic Priorities Section',
    '[
      {"title": "Gas Infrastructure", "description": "Pipeline corridors, transport capacity, terminals, and strategic connectivity."},
      {"title": "Algeria as an Energy Hub", "description": "A potential Mediterranean bridge linking African resources with Europe."},
      {"title": "Italy & Spain Destinations", "description": "Key Southern European gateways for energy flows and future cooperation."},
      {"title": "European Energy Security", "description": "Diversification, reliability, and pragmatic long-term supply strategy."}
    ]'
  ),
  (
    'focus_areas',
    'Focus Areas Section',
    '[
      {"title": "Natural Gas", "description": "Supply, infrastructure, and market strategy."},
      {"title": "Solar Energy", "description": "Renewable potential and cooperation pathways."},
      {"title": "Energy Security", "description": "Diversification and regional resilience."},
      {"title": "Algeria–Europe Relations", "description": "Energy diplomacy and shared priorities."},
      {"title": "Mediterranean Energy", "description": "Routes, gateways, and policy context."},
      {"title": "Sustainability Transition", "description": "Long-term low-carbon opportunities."}
    ]'
  ),
  (
    'footer',
    'Footer Content',
    '{
      "tagline": "Independent analysis on Algeria–Europe energy relations.",
      "copyright": "RamBelEnergy. All rights reserved."
    }'
  );

-- ─────────────────────────────────────────────
-- Seed: about_sections
-- ─────────────────────────────────────────────
INSERT INTO public.about_sections (section_key, label, content_json, sort_order)
VALUES
  (
    'hero',
    'About Page Hero',
    '{
      "eyebrow": "About / Profile",
      "title": "About RamBelEnergy",
      "subtitle": "Independent analysis on Algeria–Europe energy relations, sustainability, and Mediterranean energy security."
    }',
    1
  ),
  (
    'profile',
    'Profile Section',
    '{
      "title": "About Mr. Ramdane",
      "biography": "[PLACEHOLDER: Full biography text will be updated after client confirmation.]",
      "sumarize": "Born in Sétif, in northeastern Algeria, Ramdane Belamri grew up in a city renowned for its harsh winters and freezing temperatures. From an early age, he understood the true value of warmth within the home and the vital importance of energy in everyday life",
      "replacement_note": "Profile biography and approved portrait will be updated after client confirmation.",
      "identities": [
        {"title": "Journalist"},
        {"title": "PhD Holder"},
        {"title": "Energy & Geopolitical Analyst"},
        {"title": "Euro-African Energy Focus"}
      ]
    }',
    2
  ),
  (
    'mission',
    'Mission Section',
    '{
      "title": "Platform Mission",
      "text": "RamBelEnergy aims to provide professional analysis, research, and strategic insight on Algeria–Europe energy relations, with a focus on gas infrastructure, energy security, solar energy, sustainability, and future cooperation between Africa and Europe.",
      "points": [
        {"title": "Independent analysis", "description": "Research-oriented commentary developed with editorial discipline."},
        {"title": "Source-based insight", "description": "Context shaped around selected and reviewable public materials."},
        {"title": "Strategic energy focus", "description": "Gas, solar, security, infrastructure, and regional cooperation."},
        {"title": "Long-term sustainable cooperation", "description": "Future-facing dialogue linking Algeria, Africa, and Europe."}
      ]
    }',
    3
  ),
  (
    'values',
    'Editorial Values Section',
    '[
      {"title": "Independent Analysis", "description": "Clear, neutral commentary focused on strategic energy questions."},
      {"title": "Source-Based Insight", "description": "Perspective grounded in selected public and research materials."},
      {"title": "Professional Research", "description": "Structured output designed for informed professional audiences."},
      {"title": "Long-Term Strategic View", "description": "Attention to policy, infrastructure, sustainability, and cooperation over time."}
    ]',
    4
  ),
  (
    'future_vision',
    'Future Vision Section',
    '{
      "text": "The platform is designed to begin as a professional energy analysis platform and gradually evolve toward AI-powered knowledge capabilities for Algeria–Europe energy, sustainability, and strategic intelligence.",
      "badge": "Planned for next phase",
      "note": "Coming next: AI-powered search based on trusted government, news, and research sources."
    }',
    5
  );

-- ─────────────────────────────────────────────
-- Seed: focus_themes
-- ─────────────────────────────────────────────
INSERT INTO public.focus_themes (icon, title, description, sort_order, is_active)
VALUES
  ('ShieldCheck',  'Natural Gas',                'Supply, infrastructure, and market strategy.',                    1, true),
  ('SunMedium',    'Solar Energy',               'Renewable potential and cooperation pathways.',                 2, true),
  ('Route',        'Energy Infrastructure',      'Pipelines, terminals, and strategic connectivity.',             3, true),
  ('Globe2',       'Algeria–Europe Relations',   'Energy diplomacy and shared priorities.',                       4, true),
  ('MapPinned',    'Mediterranean Energy',       'Routes, gateways, and policy context.',                         5, true),
  ('Layers',       'Sustainability Transition',  'Long-term low-carbon opportunities.',                           6, true);
