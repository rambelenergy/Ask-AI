-- RamBelEnergy CMS — Seed site_content blocks
-- Migration: 006_seed_site_content

INSERT INTO public.site_content (block_key, label, content_json)
VALUES
  (
    'homepage_mission',
    'Homepage Mission Text',
    '{
      "title": "Platform Mission",
      "text": "RamBelEnergy aims to provide professional analysis, research, and strategic insight on Algeria\u2013Europe energy relations, with a focus on gas infrastructure, energy security, solar energy, sustainability, and future cooperation between Africa and Europe."
    }'
  ),
  (
    'homepage_pipeline_highlight',
    'Pipeline Highlight Section',
    '{
      "eyebrow": "Featured Strategic Focus",
      "title": "Nigeria\u2013Algeria\u2013Europe Gas Pipeline",
      "description": "The proposed corridor represents a strategic connection between African energy resources and European energy security needs, with Italy and Spain as important destinations."
    }'
  ),
  (
    'homepage_energy_focus',
    'Energy Focus Areas',
    '[
      {"title": "Natural Gas", "description": "Supply, infrastructure, and market strategy."},
      {"title": "Solar Energy", "description": "Renewable potential and cooperation pathways."},
      {"title": "Energy Security", "description": "Diversification and regional resilience."},
      {"title": "Algeria\u2013Europe Relations", "description": "Energy diplomacy and shared priorities."},
      {"title": "Mediterranean Energy", "description": "Routes, gateways, and policy context."},
      {"title": "Sustainability Transition", "description": "Long-term low-carbon opportunities."}
    ]'
  ),
  (
    'contact_cta',
    'Contact CTA Section',
    '{
      "title": "Research, Media & Strategic Energy Collaboration",
      "description": "For research inquiries, institutional discussions, or strategic energy collaboration, contact RamBelEnergy.",
      "button_label": "Contact",
      "button_href": "/contact"
    }'
  ),
  (
    'ai_preview_text',
    'AI Preview Text',
    '{
      "title": "Planned for next phase: RAG-based AI Search",
      "description": "Future versions of the platform will provide source-based answers from trusted government, news, and research materials.",
      "example_question": "What is the strategic importance of the Nigeria\u2013Algeria\u2013Europe gas pipeline?"
    }'
  )
ON CONFLICT (block_key) DO UPDATE SET
  label = EXCLUDED.label,
  content_json = EXCLUDED.content_json;
