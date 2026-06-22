# PRD-05: Algeria Energy Projects Database

**Feature ID:** F05
**Version:** 2.0
**Date:** 2026-06-17
**Status:** Revised — automated collection architecture replacing manual CMS
**Estimated Effort:** ~18-22 days (revised from ~7.5 — automated pipeline + 19 sources + map)
**Depends On:** None (independent) — shares crawl infrastructure with F02 (RAG + Cron)
**Priority:** P0 — Client priority #2
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---

## 5. Algeria Energy Projects Database

### 5.1 Problem Statement

The site focuses on Algeria-Europe energy relations but has no dedicated page for active Algerian energy projects. Visitors researching the context cannot easily find major pipeline projects, renewable initiatives, LNG infrastructure, or interconnection projects.

More critically, a manually-maintained project page would quickly become stale and unreliable. Algeria's energy landscape is dynamic — projects change status, new partnerships are announced, capacities are revised. Only an automated, self-updating database sourced from official channels can maintain the credibility this platform demands.

### 5.2 Philosophy

> **"Automate as much as possible, rely on trusted data sources and AI, and avoid manual content management whenever possible."**

The CMS is not the primary way of creating projects. It is a **review and approval layer** — humans in the loop for oversight, not data entry. The platform automatically collects, extracts, deduplicates, and updates project data from 19 official sources. The admin reviews, corrects, approves, or rejects changes.

### 5.3 Goals

- Build a **self-updating energy projects database** — not a static content page
- Ingest project data from **19 official sources** across 4 tiers (Algerian Official, International Organizations, News/Market Intelligence, International Operating Companies)
- **AI-powered extraction** parses unstructured pages (French, Arabic, English) into an 18-field structured schema
- **Deduplication and change detection** matches incoming data against existing projects, flags updates for review
- **Review CMS** — new and changed projects appear in a review queue; admin approves, edits, or rejects
- **Interactive map** showing project locations with GPS coordinates
- **Frontend** — filterable project cards (category, status, wilaya) and full detail view
- All projects sourced with verifiable URLs and last-updated timestamps
- **Algeria-only** scope for current version

### 5.4 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| EP-01 | Researcher | Browse all Algerian energy projects in one place with source attribution | I can understand the full landscape and verify information |
| EP-02 | Investor | Filter projects by type, status, and location | I can focus on areas of interest |
| EP-03 | Admin | Review AI-extracted project data in a queue and approve/correct/reject | Data stays accurate without manual data entry burden |
| EP-04 | Journalist | Click from project to original official source | I can verify claims against primary sources |
| EP-05 | Policy analyst | See project locations on an interactive map | I can visualize infrastructure geographically |

---

## 5.5 Data Source Architecture

### Source Classification — 19 Sources, 4 Tiers

#### Tier 1 — Algerian Official Sources (6 sources)

| # | Source | URL | Data Collected |
|---|--------|-----|----------------|
| 1 | Ministry of Energy, Mines and Renewable Energies | `energy.gov.dz` | Official announcements, energy projects, renewable projects, national strategies |
| 2 | Sonatrach | `sonatrach.com` | Oil & gas projects, LNG, petrochemical, pipelines, annual reports, press releases |
| 3 | Sonelgaz | `sonelgaz.dz` | Power plants, electricity transmission, renewable energy, grid expansion |
| 4 | ALNAFT | `alnaft.dz` | Oil & gas blocks, exploration projects, licensing rounds, hydrocarbon fields |
| 5 | AAPI (Algerian Investment Promotion Agency) | `aapi.dz` | Energy investment projects, foreign investment announcements |
| 6 | Journal Officiel (JORADP) | `joradp.dz` | Official decrees, project approvals, energy regulations |

#### Tier 2 — International Organizations (5 sources)

| # | Source | URL | Data Collected |
|---|--------|-----|----------------|
| 7 | World Bank | `data.worldbank.org` | Energy indicators, project financing data |
| 8 | International Energy Agency (IEA) | `iea.org` | Country reports, energy project data |
| 9 | OPEC | `opec.org` | Member country data, production statistics |
| 10 | Global Energy Monitor | `globalenergymonitor.org` | Power plants, renewable facilities, infrastructure projects |
| 11 | African Development Bank | `afdb.org` | Project financing, energy infrastructure investments |

#### Tier 3 — News & Market Intelligence (1 source)

| # | Source | URL | Data Collected |
|---|--------|-----|----------------|
| 12 | Reuters Energy | `reuters.com/business/energy` | Latest announcements, project updates, market context |

#### Tier 4 — International Operating Companies (7 sources)

| # | Company | Press Release URL | Algeria-Specific |
|---|---------|-------------------|------------------|
| 13 | Eni (Italy) | `eni.com/en-IT/media/press-release.html` | `eni.com/en-IT/actions/global-activities/algeria.html` |
| 14 | TotalEnergies (France) | `totalenergies.com/media/news` | `totalenergies.com/newsroom` |
| 15 | BP (UK) | `bp.com/en/global/corporate/news-and-insights.html` | — |
| 16 | Equinor (Norway) | `equinor.com/news` | — |
| 17 | ExxonMobil (US) | `corporate.exxonmobil.com/news` | — |
| 18 | Chevron (US) | `chevron.com/newsroom` | — |
| 19 | Occidental / Oxy (US) | `oxy.com/newsroom` | — |

**Cross-verification rule:** Tier 4 company sources are cross-checked against Tier 1 Algerian official sources. Discrepancies are flagged in the review queue for human verification.

---

## 5.6 Automated Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    VERCEL CRON (every 6-12 hours)             │
└────────────────────────────┬─────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐             ┌─────────────────────────┐
│  TIER 1 CRAWLER      │             │  TIER 2-4 CRAWLER        │
│  Algerian Official    │             │  International + News +   │
│  (6 sources)          │             │  Companies (13 sources)   │
│  • Conservative rate  │             │  • Standard rate limits   │
│  • Gov site handling  │             │  • RSS where available    │
└─────────┬─────────────┘             └──────────┬──────────────┘
          │                                       │
          └───────────────────┬───────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    AI EXTRACTION PIPELINE                      │
│                                                                │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │ Content Fetch │──▶│ LLM Extraction│──▶│ Structure → 18    │  │
│  │ (cheerio +    │   │ (OpenAI)      │   │ fields (JSON)     │  │
│  │  readability) │   │ FR/EN/AR      │   │                   │  │
│  └──────────────┘   └──────────────┘   └──────────────────┘  │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│              DEDUPLICATION + CHANGE DETECTION                  │
│                                                                │
│  • Match incoming projects against existing DB by:             │
│    - Name similarity (fuzzy + embedding)                       │
│    - Location proximity (GPS)                                  │
│    - Source URL cross-reference                                │
│  • Detect: NEW | UPDATED | UNCHANGED | CONFLICT                │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                    REVIEW QUEUE (Admin CMS)                    │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ NEW PROJECTS         │ CHANGES TO REVIEW    │ CONFLICTS   ││
│  │ (approve/reject)     │ (approve/dismiss)    │ (resolve)   ││
│  └──────────────────────────────────────────────────────────┘│
│                                                                │
│  Admin actions: Approve → Published | Edit → Published        │
│                 Reject → Archived | Dismiss change → Keep prev│
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                  LIVE DATABASE (Supabase)                      │
│                                                                │
│  • Published projects feed /energy-projects page               │
│  • Each project has: source_url, last_updated, sync_history    │
│  • Audit log: every change tracked                             │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│                      FRONTEND                                  │
│                                                                │
│  /energy-projects                                              │
│  ├── Hero + description                                        │
│  ├── Filter bar: category pills + status dropdown + wilaya     │
│  ├── Project grid: cards with status/category badges           │
│  ├── Interactive map: Leaflet with GPS markers                 │
│  └── Project detail: expand/modal with all 18 fields           │
└──────────────────────────────────────────────────────────────┘
```

---

## 5.7 Database Schema — 18 Fields

```sql
CREATE TABLE energy_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                              -- Project Name
  slug TEXT NOT NULL UNIQUE,
  energy_sector TEXT NOT NULL CHECK (energy_sector IN (
    'oil', 'gas', 'lng', 'renewable', 'hydrogen', 'power', 'petrochemical', 'other'
  )),
  project_type TEXT CHECK (project_type IN (
    'pipeline', 'field', 'plant', 'terminal', 'grid', 'solar', 'wind', 'exploration', 'other'
  )),
  wilaya TEXT,                                     -- Wilaya (province)
  municipality TEXT,                               -- Municipality
  gps_lat DECIMAL(10, 7),                          -- GPS Latitude
  gps_lng DECIMAL(10, 7),                          -- GPS Longitude
  operating_company TEXT,                          -- Primary operator
  project_partners TEXT[] DEFAULT '{}',            -- Array of partner entities
  investment_value TEXT,                           -- e.g., "$2.5 billion"
  production_capacity TEXT,                        -- e.g., "30 bcm/year", "15 GW"
  project_status TEXT NOT NULL CHECK (project_status IN (
    'operational', 'under_construction', 'planned', 'proposed', 'completed', 'suspended'
  )),
  completion_percentage DECIMAL(5,2),              -- % complete when available
  start_date DATE,                                 -- Project start / groundbreaking
  expected_completion_date DATE,                   -- Expected completion / commissioning
  project_description TEXT,                        -- AI-extracted summary

  -- Source tracking
  source_url TEXT,                                 -- Link to official source
  source_name TEXT,                                -- e.g., "Sonatrach", "Eni"
  last_updated TIMESTAMPTZ DEFAULT NOW(),          -- Auto-stamped on sync
  last_source_check TIMESTAMPTZ DEFAULT NOW(),     -- When source was last crawled
  source_urls TEXT[] DEFAULT '{}',                 -- All source URLs (for cross-referenced projects)

  -- Review workflow
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN (
    'pending', 'approved', 'rejected', 'changes_pending'
  )),
  reviewed_by TEXT,                                -- Admin user ID
  reviewed_at TIMESTAMPTZ,

  -- Metadata
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  sync_history JSONB DEFAULT '[]',                 -- Array of {timestamp, action, field_changes}
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_energy_projects_sector ON energy_projects(energy_sector);
CREATE INDEX idx_energy_projects_status ON energy_projects(project_status);
CREATE INDEX idx_energy_projects_wilaya ON energy_projects(wilaya);
CREATE INDEX idx_energy_projects_review ON energy_projects(review_status);
CREATE INDEX idx_energy_projects_source ON energy_projects(source_name);
```

---

## 5.8 AI Extraction Prompt Design

The LLM prompt extracts 18 structured fields from raw page content (French, Arabic, or English). Core design:

```
System: You are an energy project data extractor. Extract structured data
from the following content about an Algerian energy project.

Output ONLY valid JSON with these fields (null if not found):
- projectName, energySector, projectType, wilaya, municipality,
  gpsCoordinates { lat, lng }, operatingCompany, projectPartners [],
  investmentValue, productionCapacity, projectStatus,
  completionPercentage, startDate, expectedCompletionDate,
  description

Rules:
1. Extract only from provided content — do not hallucinate
2. Project status map: "opérationnel"→operational, "en construction"→under_construction,
   "prévu/planifié"→planned, "proposé"→proposed, "achevé"→completed, "suspendu"→suspended
3. Numbers: preserve original units ("30 bcm/year", "15 GW")
4. Partners: return as array ["Sonatrach", "Eni"]
5. If multiple projects on page, extract ALL as array
6. Include extraction_confidence: "high"|"medium"|"low" per field
7. If content is not about an energy project, return {"isProject": false}
```

---

## 5.9 Deduplication Strategy

When new data arrives from crawling, match against existing database:

| Method | What it catches |
|--------|-----------------|
| **Name similarity** (embedding cosine similarity ≥0.85) | Same project with slight name variations across sources |
| **GPS proximity** (within 5 km) | Same location referenced differently |
| **Source URL match** | Exact same source page re-crawled |
| **Partner + type + wilaya overlap** | Multi-signal match when name is ambiguous |

**Match outcomes:**

| Outcome | Action |
|---------|--------|
| **NEW** — no match found | → Review queue: "New Project" |
| **UPDATED** — match found, fields changed | → Review queue: "Changes Detected" with diff |
| **UNCHANGED** — match found, no changes | → Touch `last_source_check`, skip review |
| **CONFLICT** — match found, contradictory data from different sources | → Review queue: "Conflict — Multiple Sources Disagree" |

### 5.10 Admin Review CMS

#### Review Queue View (`/admin/projects/review`)

```
┌──────────────────────────────────────────────────────────────┐
│  Review Queue                                   12 pending    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  [NEW] [CHANGES] [CONFLICTS]  ← tabs                         │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 🟡 NEW PROJECT                           Sonatrach · 2h │ │
│  │                                                          │ │
│  │ Hassi R'Mel Solar Plant                                  │ │
│  │ Sector: Renewable  │  Type: Solar  │  Wilaya: Laghouat   │ │
│  │ Capacity: 150 MW   │  Status: Under Construction         │ │
│  │                                                          │ │
│  │ Source: sonatrach.com/press/hassi-rmel-solar             │ │
│  │ Confidence: High (8/18 fields high confidence)           │ │
│  │                                                          │ │
│  │ [Approve]  [Edit]  [Reject]                              │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 🔵 CHANGES DETECTED                       Eni · 5h ago  │ │
│  │                                                          │ │
│  │ Medgaz Pipeline Expansion                                │ │
│  │ ─────────────────────────────────────────────────────── │ │
│  │ Capacity: 8 bcm/year → 10 bcm/year                       │ │
│  │ Status: Operational → Operational (unchanged)            │ │
│  │                                                          │ │
│  │ Source: eni.com/media/press-release/medgaz-expansion      │ │
│  │                                                          │ │
│  │ [Approve Change]  [Dismiss]  [Edit]                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 🔴 CONFLICT                              Reuters · 1d   │ │
│  │                                                          │ │
│  │ TSGP Pipeline — Status Discrepancy                       │ │
│  │ ─────────────────────────────────────────────────────── │ │
│  │ Sonatrach: Planned          Reuters: Under Discussion    │ │
│  │ JORADP: Proposed            Eni: Planned                 │ │
│  │                                                          │ │
│  │ [Keep Sonatrach]  [Accept Reuters]  [Manual Resolve]    │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

#### Audit Trail

Every project maintains a `sync_history` JSONB field:

```json
[
  {
    "timestamp": "2026-06-17T08:30:00Z",
    "action": "updated",
    "source": "eni.com",
    "changes": {
      "capacity": { "from": "8 bcm/year", "to": "10 bcm/year" }
    },
    "reviewed_by": "admin@rambelenergy.com",
    "reviewed_at": "2026-06-17T09:15:00Z"
  },
  {
    "timestamp": "2026-06-15T14:00:00Z",
    "action": "created",
    "source": "sonatrach.com",
    "reviewed_by": null,
    "reviewed_at": null
  }
]
```

---

## 5.11 Frontend Design

#### `/energy-projects` Page Structure

```
┌──────────────────────────────────────────────────────────────┐
│  Hero: "Algeria Energy Projects Database"                    │
│  Auto-updated from 19 official sources. Last sync: 2h ago.   │
├──────────────────────────────────────────────────────────────┤
│  [All] [Pipelines] [Renewable] [LNG] [Upstream] [Hydrogen]   │  ← Category pills
│  Status: [All ▼]   Wilaya: [All ▼]              [🔍 Search]  │  ← Filters
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐  ┌─────────────────────┐            │
│  │ 🟢 Operational       │  │ 🟡 Under Construction│            │
│  │ Pipeline             │  │ Renewable            │            │
│  │                      │  │                      │            │
│  │ Medgaz Pipeline      │  │ Solar 15 GW Programme│            │
│  │ Algeria → Spain      │  │ National rollout     │            │
│  │ 10 bcm/year          │  │ 15 GW target         │            │
│  │ Sonatrach · Naturgy  │  │ Sonelgaz · Sonatrach │            │
│  │                      │  │                      │            │
│  │ Source: Sonatrach    │  │ Source: energy.gov.dz│            │
│  │ Updated: 2 days ago  │  │ Updated: 5 days ago  │            │
│  │ [View Details →]     │  │ [View Details →]     │            │
│  └─────────────────────┘  └─────────────────────┘            │
│                                                               │
├──────────────────────────────────────────────────────────────┤
│                   INTERACTIVE MAP (Leaflet)                    │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │   🟢 🔵 🟡 🔴  ← Project markers by status              │ │
│  │   [Algeria map with project pins]                        │ │
│  │                                                          │ │
│  │   Click marker → popup: project name, status, capacity  │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

#### Project Card Component

```
┌──────────────────────────────────────────┐
│ ┌──────────────────────────────────────┐ │
│ │         Project Image / Map          │ │
│ └──────────────────────────────────────┘ │
│                                          │
│  🟢 Operational    📦 Pipeline           │
│                                          │
│  Medgaz Gas Pipeline                     │
│  Algeria → Spain (Almería)               │
│  10 bcm/year capacity                    │
│                                          │
│  Sonatrach · Naturgy                     │
│                                          │
│  Direct subsea pipeline connecting       │
│  Beni Saf, Algeria to Almería, Spain.    │
│  Recently expanded from 8 to 10 bcm/yr.  │
│                                          │
│  📎 Source: sonatrach.com                │
│  🕐 Updated: 2026-06-15                  │
│  [View Full Details →]                   │
└──────────────────────────────────────────┘
```

#### Status Badges

| Status | Color | Badge |
|--------|-------|-------|
| Operational | Green | 🟢 Operational |
| Under Construction | Amber | 🟡 Under Construction |
| Planned | Blue | 🔵 Planned |
| Proposed | Gray | ⚪ Proposed |
| Completed | Dark Green | ✅ Completed |
| Suspended | Red | 🔴 Suspended |

---

## 5.12 Initial Seed Projects (for System Validation)

The following 12 projects serve as the initial validation set to verify the pipeline extracts correctly. They will be overridden/reconciled when the automated pipeline ingests live data.

| Name | Category | Status | Capacity |
|------|----------|--------|----------|
| Transmed Pipeline (Enrico Mattei) | Pipeline | Operational | 33 bcm/year |
| Medgaz Pipeline | Pipeline | Operational | 10 bcm/year |
| Trans-Saharan Gas Pipeline (TSGP) | Pipeline | Planned | 30 bcm/year |
| GALSI Pipeline | Pipeline | Proposed | 8 bcm/year |
| Solar 15 GW Programme | Renewable | Under Construction | 15 GW |
| SoutH2 Corridor | Hydrogen | Planned | 4 Mt/year |
| ELMED Interconnection | Interconnection | Under Construction | 600 MW |
| Skikda LNG Terminal | LNG | Operational | Various |
| Arzew LNG Complex | LNG | Operational | Various |
| Hassi R'Mel Gas Field | Upstream | Operational | ~100 bcm/year |
| Touat Gas Project | Upstream | Operational | 4.5 bcm/year |
| Reggane Nord Gas Project | Upstream | Operational | Various |

---

## 5.13 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Crawl every 6-12 hours**, not real-time | Gov sites are slow; project data changes on a weekly/monthly cadence |
| **AI extraction via LLM**, not deterministic scraping | Pages are unstructured, mixed-language (FR/AR/EN), and diverse in format |
| **Review queue, not auto-publish** | Credibility demands human oversight — but the CMS is for review, not data entry |
| **18-field schema with nullables** | Not all fields are available for all projects; null means "not found in source" |
| **Source URL per project + sync_history** | Full traceability — every data point links back to the official source |
| **Embedding-based name matching** | Same project may appear as "Medgaz Pipeline", "Medgaz Gas Pipeline", "Gazoduc Medgaz" |
| **Algeria-only scope (v1)** | Avoid scope creep; international projects can be added in future phases |
| **Cross-reference Tier 4 vs Tier 1** | Company press releases are cross-checked against Algerian official sources |
| **Stale data handling** | Projects not updated by any source for >30 days are flagged for review |

---

## 5.14 Scope Boundary

### Included (F05 v2.0)

- ✅ Automated crawling of all 19 sources
- ✅ AI extraction pipeline (LLM → structured 18-field JSON)
- ✅ Deduplication + change detection + conflict flagging
- ✅ Admin review queue (approve/edit/reject/resolve conflicts)
- ✅ `/energy-projects` public page with filters and project cards
- ✅ Interactive map with GPS markers (Leaflet)
- ✅ Source attribution with verifiable URLs
- ✅ Sync history audit trail per project
- ✅ Stale data monitoring (>30 days flag)
- ✅ Project detail view (expandable or dedicated page)
- ✅ Responsive design (mobile-first)

### Excluded (Future Phases)

- ❌ Non-Algerian projects (North Africa / MENA expansion)
- ❌ Real-time streaming updates
- ❌ User-submitted project suggestions
- ❌ Public API for third-party access
- ❌ PDF report generation
- ❌ Historical timeline view of project changes
- ❌ Automated notifications on status changes
- ❌ Integration with ask-energy for project Q&A

---

## 5.15 Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Algerian gov sites down/slow | Medium | High | Retry with exponential backoff; cache last known good data |
| Site structure changes break scrapers | Medium | Medium | Monitoring alert; fallback to broader page fetch |
| AI extraction hallucinates data | High | Medium | Confidence scoring per field; human review queue; cross-source verification |
| Mixed-language extraction errors | Medium | Medium | LLM prompt tuned for FR/AR/EN; confidence flagging |
| Source rate-limiting/blocking | Medium | Low | Conservative crawl intervals (6-12h); respect robots.txt |
| Duplicate projects from multiple sources | Low | High | Embedding similarity + GPS proximity matching |
| No structured data on some sources | Medium | High | That's the point — AI extraction handles unstructured content |
| LLM extraction costs at scale | Medium | Medium | Batch processing; daily token budget; only extract when content changed |

---

## 5.16 Acceptance Criteria

- [ ] Automated crawl runs against all 19 sources on schedule (every 6-12 hours)
- [ ] AI extraction produces 18-field JSON with confidence scores
- [ ] Deduplication correctly matches same project across different sources
- [ ] Change detection identifies field-level updates between crawls
- [ ] Review queue shows: new projects, changed projects, and conflicts
- [ ] Admin can approve, edit, reject, or resolve each review item
- [ ] Published projects appear on `/energy-projects` with all available fields
- [ ] Category filter works (pills: pipelines, renewable, LNG, upstream, hydrogen, interconnection)
- [ ] Status filter works (dropdown: all, operational, under construction, planned, proposed)
- [ ] Wilaya filter works for geographic filtering
- [ ] Interactive map renders with GPS markers for all projects with coordinates
- [ ] Clicking map marker shows project name, status, capacity in popup
- [ ] Each project card shows source name and last-updated timestamp
- [ ] Source URL is clickable and links to original official page
- [ ] Stale projects (>30 days with no source update) are flagged
- [ ] All errors are logged to `crawl_logs` table with source, timestamp, error message
- [ ] Mobile: single column layout, filters stack vertically
- [ ] Page is SEO-optimized (meta, OG, structured data, sitemap)

---

## 5.17 Scope & Estimates

| Phase | Task | Estimate |
|-------|------|----------|
| **1. Source Config** | Configure 19 source URLs, crawl rules, rate limits, robots.txt respect | 2-3 days |
| **2. Crawl Infra** | Build parallel crawler with retry logic, failure logging, `crawl_logs` table | 2 days |
| **3. AI Extraction** | LLM extraction prompt + pipeline (FR/AR/EN → 18-field JSON), confidence scoring | 3-4 days |
| **4. Dedup + Change** | Embedding name matching, GPS proximity, field-level diff, conflict detection | 2-3 days |
| **5. Review CMS** | Admin review queue UI (tabs: new/changes/conflicts), approve/edit/reject workflow, audit log | 2 days |
| **6. Database** | Migration, types, indexes, sync_history JSONB, seed validation set | 0.5 day |
| **7. Frontend** | `/energy-projects` page, ProjectCard, ProjectGrid, filters, project detail view | 2-3 days |
| **8. Interactive Map** | Leaflet integration, GPS markers, status-colored pins, popup cards | 2 days |
| **9. Source Reliability** | Stale data flagging (>30 days), source health monitoring, admin alerts | 1 day |
| **10. Testing** | End-to-end crawl → extract → review → publish flow, edge cases, mobile | 2 days |
| **Total** | | **~18-22 days** |

---

## 5.18 Synergy with F02 (RAG + Cron)

This feature shares significant infrastructure with F02 (RAG document ingestion):

| Shared Component | F02 Use | F05 Use |
|-----------------|---------|---------|
| Cron scheduler | Ingest documents every 6h | Crawl project sources every 6-12h |
| Web scraper (cheerio + readability) | Fetch document pages | Fetch source pages |
| AI extraction pipeline | Chunk + embed documents | Extract 18-field project JSON |
| `crawl_logs` table | Track document ingestion | Track source crawling |
| Rate limiting + backoff | Respect source limits | Respect source limits |
| Admin review queue concept | Review imported documents | Review extracted projects |

**Recommendation:** Build F02 and F05 together (or F05 immediately after F02) to reuse the crawl infrastructure and reduce duplicate work. The combined estimate is shorter than the sum of independent builds.

---

