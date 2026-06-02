-- Seed articles for development
INSERT INTO articles (id, title, slug, excerpt, content, category, author, published_at, status, source_url, created_at, updated_at) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Why Algeria Matters in Europe''s Energy Security',
  'why-algeria-matters-europe-energy-security',
  'Examining Algeria''s strategic position in supply diversification, infrastructure access, and regional cooperation.',
  E'## Algeria''s Strategic Energy Position\n\nAlgeria holds a unique position in the Mediterranean energy landscape. As one of Africa''s largest natural gas producers and a key supplier to European markets, the country''s energy policy decisions reverberate across the continent.\n\n### Supply Diversification\n\nWith European nations seeking to reduce dependence on single suppliers, Algeria offers a geographically proximate and politically stable alternative. The existing pipeline infrastructure connecting Algerian gas fields to Italy and Spain provides established routes that can be expanded.\n\n### Infrastructure Access\n\nThe TransMed pipeline and Medgaz pipeline represent critical infrastructure linking North African resources to European consumers. These corridors have capacity for expansion and could accommodate new production from both existing and developing fields.\n\n### Regional Cooperation\n\nBeyond bilateral energy deals, Algeria participates in broader Mediterranean energy forums and initiatives. The country''s engagement with the European Union''s energy partnership frameworks signals commitment to long-term supply relationships.\n\n## Looking Forward\n\nAs Europe transitions toward cleaner energy sources, Algeria''s potential in solar energy and green hydrogen production positions it as a partner not just for fossil fuels, but for sustainable energy cooperation.\n\nThe strategic question is not whether Algeria matters to European energy security—it unquestionably does—but how both sides can structure cooperation to benefit from the energy transition while maintaining supply reliability during the transition period.',
  'Energy Security',
  'Ramdane Belamri',
  '2026-05-15T00:00:00Z',
  'published',
  'https://example.com/algeria-energy-security',
  NOW(),
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'Nigeria–Algeria–Europe Pipeline: Strategic Opportunity or Political Challenge?',
  'nigeria-algeria-europe-pipeline-strategic-opportunity',
  'A balanced view of corridor potential, financing complexity, implementation risks, and regional stability.',
  E'## The Pipeline Vision\n\nThe proposed Nigeria–Algeria–Europe gas pipeline represents one of the most ambitious infrastructure projects in African energy history. Spanning over 4,000 kilometers, this corridor would connect West African gas resources to European markets via the existing North African pipeline network.\n\n### Strategic Benefits\n\n**For Nigeria**: The pipeline offers a route to monetize vast natural gas reserves that have historically been underutilized due to lack of export infrastructure.\n\n**For Algeria**: Acting as a transit country strengthens Algeria''s position as a regional energy hub.\n\n**For Europe**: Diversification of supply sources reduces dependence on any single supplier.\n\n### Implementation Challenges\n\nThe project faces significant hurdles:\n\n- **Financing**: Estimated costs exceed $20 billion\n- **Security**: Passing through the Sahel region raises security concerns\n- **Technical**: Crossing the Sahara Desert presents engineering challenges\n- **Regulatory**: Harmonizing regulations across multiple jurisdictions\n\n## Conclusion\n\nThe pipeline represents both opportunity and risk. Success requires coordinated international cooperation, significant investment, and sustained political commitment.',
  'Infrastructure',
  'Ramdane Belamri',
  '2026-05-10T00:00:00Z',
  'published',
  NULL,
  NOW(),
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333',
  'Italy and Spain as Gateways for Algerian Energy',
  'italy-spain-gateways-algerian-energy',
  'How Mediterranean destinations shape access, partnerships, and Europe''s future energy planning.',
  E'## Mediterranean Energy Gateways\n\nItaly and Spain serve as critical entry points for Algerian energy into European markets. Their geographical proximity, existing infrastructure, and energy policy orientations make them natural partners for North African energy cooperation.\n\n### Italy: The Eastern Route\n\nItaly receives Algerian gas primarily through the TransMed pipeline.\n\n**Key factors:**\n- Existing pipeline capacity of approximately 34 billion cubic meters annually\n- Eni''s long-standing partnership with Sonatrach\n- Italy''s aggressive renewable energy targets\n\n### Spain: The Western Route\n\nSpain connects to Algeria via the Medgaz underwater pipeline and LNG shipments.\n\n**Key factors:**\n- Medgaz pipeline expansion increasing capacity\n- Spain''s LNG infrastructure offering flexibility\n- Potential for Algerian hydrogen exports via Spanish ports\n\n## Future Cooperation\n\nBoth countries are exploring beyond traditional gas trade:\n\n- **Green hydrogen**: Algeria''s solar potential could support hydrogen production\n- **Renewable energy**: Joint ventures in solar and wind projects\n- **Energy efficiency**: Technology transfer and capacity building',
  'Mediterranean Energy',
  'Ramdane Belamri',
  '2026-04-28T00:00:00Z',
  'published',
  NULL,
  NOW(),
  NOW()
),
(
  '44444444-4444-4444-4444-444444444444',
  'Solar Energy and Algeria''s Long-Term Opportunity',
  'solar-energy-algeria-long-term-opportunity',
  'A sustainability perspective on renewable potential and future Algeria–Europe collaboration.',
  E'## Algeria''s Solar Potential\n\nAlgeria possesses some of the world''s best solar resources. With vast desert areas receiving over 2,000 hours of annual sunshine and irradiation levels exceeding 2,000 kWh/m²/year, the country has the potential to become a solar energy powerhouse.\n\n### Current State\n\nDespite excellent resources, Algeria''s solar deployment remains limited. The country''s renewable energy program aims for 15,000 MW of renewable capacity by 2035.\n\n**Challenges:**\n- Limited domestic investment capacity\n- Regulatory framework still developing\n- Grid infrastructure needs upgrading\n- Technical expertise gaps\n\n### European Partnership Opportunity\n\nEuropean countries see Algeria as a potential partner for:\n\n1. **Green hydrogen production**\n2. **Direct power exports**\n3. **Joint venture projects**\n\n## Path Forward\n\nRealizing Algeria''s solar potential requires streamlined regulatory frameworks, international investment partnerships, grid infrastructure development, and long-term supply agreements with European partners.',
  'Solar Energy',
  'Ramdane Belamri',
  '2026-04-20T00:00:00Z',
  'published',
  NULL,
  NOW(),
  NOW()
);

-- Seed publications for development
INSERT INTO publications (id, title, slug, description, publication_date, created_at, updated_at) VALUES
(
  '55555555-5555-5555-5555-555555555555',
  'Algeria–Europe Energy Strategic Outlook 2026',
  'algeria-europe-strategic-outlook-2026',
  'A structured briefing on energy security, cooperation, and infrastructure priorities between Algeria and European partners.',
  '2026-05-01T00:00:00Z',
  NOW(),
  NOW()
),
(
  '66666666-6666-6666-6666-666666666666',
  'Mediterranean Energy Security Brief',
  'mediterranean-energy-security-brief',
  'Strategic notes on supply routes, market access, and regional energy stability in the Mediterranean context.',
  '2026-04-15T00:00:00Z',
  NOW(),
  NOW()
),
(
  '77777777-7777-7777-7777-777777777777',
  'Nigeria–Algeria–Europe Pipeline Research Note',
  'nigeria-algeria-europe-pipeline-research-note',
  'An editorial research preview on corridor feasibility, opportunity, and policy questions for the proposed transcontinental pipeline.',
  '2026-03-20T00:00:00Z',
  NOW(),
  NOW()
);
