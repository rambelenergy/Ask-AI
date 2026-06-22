# Phase 2a — Live Prices & Algeria Project Map Interactive

**Version:** 1.0
**Date:** 2026-06-21
**Status:** Planning — Ready for Development
**PRDs:** [01_LIVE_ENERGY_PRICE.md](./prd/01_LIVE_ENERGY_PRICE.md) · [05_ENERGY_PROJECTS_ALGERIA.md](./prd/05_ENERGY_PROJECTS_ALGERIA.md)
**Index:** ← [Back to PRD Index](./prd/00_INDEX.md)

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Diagram Flow](#2-diagram-flow)
3. [Design Layout](#3-design-layout)
4. [Timeline](#4-timeline)

---

## 1. Tech Stack

### 1.1 Shared Foundation (Already Built)

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| **Framework** | Next.js (App Router) | 16.2.6 | SSR + API routes |
| **Language** | TypeScript | ^5 | Strict mode |
| **Styling** | Tailwind CSS | ^4 | Custom theme (navy, teal, slate) |
| **Database** | Supabase PostgreSQL | — | `pgvector` extension available |
| **Auth** | Supabase Auth | ^2.106 | SSR helpers via `@supabase/ssr` |
| **Icons** | Lucide React | ^1.16 | |
| **Vercel** | Deployment + Cron | — | Hosting + scheduled jobs |

### 1.2 Feature 1 — Live Energy Prices (F01)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **API Route** | Next.js Route Handler | `GET /api/energy-prices` — provider-agnostic facade |
| **Providers** | Multi-source abstraction | `PriceProvider` interface → pluggable sources |
| **Primary Source** | Argus Media / S&P Global Platts API | Saharan Blend, Brent, WTI, Murban, TTF (subscription required) |
| **Validation** | OPEC (opec.org) | OPEC Basket cross-check — public/free |
| **Fallback** | OilPrice.com scraping | Secondary reference — cheerio |
| **Supplemental** | EIA API (eia.gov) | Henry Hub (free API) |
| **Cache** | In-memory Map with TTL | 5 min tiered cache (server-side) |
| **Client Polling** | SWR | `^2.2.0` — 5-min `refreshInterval` |
| **Historical DB** | `energy_prices` table (Supabase) | Every fetch persisted — 90d per-fetch, 2yr hourly, indefinite daily |
| **Benchmark Registry** | Config-driven `BENCHMARK_REGISTRY` | Add benchmark → auto-flows to API + DB + UI + intelligence pages |
| **Intelligence Pages** | `/intelligence/[benchmark]` | Per-benchmark pages with price, trends, AI analysis, sources |
| **Charts** | Recharts or Chart.js (lightweight) | Historical trend charts (7d/30d/90d/1y) |
| **Homepage Widget** | `PriceTicker` component | Horizontal ticker — top 4 benchmarks |
| **Components** | `PriceGrid` + `PriceCard` | Full price dashboard on `/energy-prices` |

**New packages to install:**
```json
{
  "swr": "^2.2.0",
  "cheerio": "^1.0.0",
  "recharts": "^2.12.0"
}
```

### 1.3 Feature 2 — Algeria Project Map Interactive (F05)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Crawlers** | Vercel Cron + cheerio + @mozilla/readability | Scheduled crawl of 19 sources every 6-12h |
| **AI Extraction** | OpenAI (gpt-4o-mini) | LLM extracts 18-field structured JSON from unstructured pages (FR/AR/EN) |
| **Deduplication** | Embedding similarity (cosine ≥ 0.85) + GPS proximity (5 km) + fuzzy name matching | Match incoming projects against existing DB |
| **Change Detection** | Field-level diff comparison | Detect NEW / UPDATED / UNCHANGED / CONFLICT |
| **Review CMS** | Admin route `/admin/projects/review` | Approve / edit / reject / resolve conflicts |
| **Database** | `energy_projects` table (Supabase) | 18-field schema + audit trail (`sync_history` JSONB) |
| **Map** | Leaflet + React-Leaflet | Interactive map with GPS markers, popups, clustering |
| **Frontend** | `/energy-projects` page | Filter bar (category pills + status dropdown + wilaya + search) + project grid + map |
| **Project Cards** | `ProjectCard` component | Status badge, category, capacity, operators, source attribution |
| **Detail View** | Modal or dedicated page | All 18 fields, source URL, last-updated timestamp |
| **i18n** | Existing i18n system (`src/lib/i18n/`) | FR / EN / AR — project content in mixed languages |

**New packages to install:**
```json
{
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.2.0",
  "@types/leaflet": "^1.9.0",
  "cheerio": "^1.0.0",
  "@mozilla/readability": "^0.5.0",
  "gpt-tokenizer": "^2.1.0"
}
```

### 1.4 Shared Infrastructure

| Component | Technology | Used By |
|-----------|-----------|---------|
| **Crawl scheduling** | Vercel Cron | F05 crawlers |
| **LLM calls** | OpenAI (gpt-4o-mini) | F05 AI extraction |
| **Embeddings** | OpenAI `text-embedding-3-small` | F05 deduplication |
| **Token tracking** | `EXTRACTION_DAILY_MAX_TOKENS=300000` | F05 budget cap |
| **Content fetch** | cheerio + readability | F05 page scraping |

### 1.5 Environment Variables (New)

```env
# F01 — Live Prices
# EIA_API_KEY=*** (future: EIA API v2)

# F05 — Project Extraction
EXTRACTION_DAILY_MAX_TOKENS=300000
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### 1.6 Frontend Component Tree

```
src/
├── app/
│   ├── (site)/
│   │   ├── energy-prices/
│   │   │   └── page.tsx              ← NEW: Price dashboard
│   │   ├── energy-projects/
│   │   │   ├── page.tsx              ← NEW: Project listing + map
│   │   │   └── [slug]/
│   │   │       └── page.tsx          ← NEW: Project detail
│   │   └── intelligence/
│   │       └── [benchmark]/
│   │           └── page.tsx          ← NEW: Intelligence page per benchmark
│   ├── admin/
│   │   └── (auth)/
│   │       └── projects/
│   │           ├── review/
│   │           │   └── page.tsx      ← NEW: Review queue
│   │           └── page.tsx          ← NEW: Project list management
│   └── api/
│       ├── energy-prices/
│       │   └── route.ts             ← NEW: Prices API endpoint
│       ├── energy-projects/
│       │   ├── route.ts             ← NEW: Projects API
│       │   ├── crawl/
│       │   │   └── route.ts         ← NEW: Cron-triggered crawl
│       │   └── review/
│       │       └── route.ts         ← NEW: Review actions API
│       └── intelligence/
│           └── [benchmark]/
│               └── route.ts         ← NEW: Intelligence data API
├── components/
│   ├── prices/                       ← NEW: Price components
│   │   ├── PriceTicker.tsx
│   │   ├── PriceGrid.tsx
│   │   ├── PriceCard.tsx
│   │   ├── PriceChart.tsx
│   │   ├── BenchmarkIntelligence.tsx
│   │   ├── SourceAttribution.tsx
│   │   └── PriceMetadata.tsx
│   ├── projects/                     ← NEW: Project components
│   │   ├── ProjectGrid.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectMap.tsx
│   │   ├── ProjectDetail.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── ProjectStatusBadge.tsx
│   │   └── ReviewQueue.tsx
│   └── admin/
│       ├── ProjectReviewCard.tsx     ← NEW
│       └── ProjectReviewForm.tsx     ← NEW
└── lib/
    ├── prices/                       ← NEW: Prices logic
    │   ├── benchmark-registry.ts
    │   ├── providers/
    │   │   ├── types.ts
    │   │   ├── argus-platts.ts
    │   │   ├── opec.ts
    │   │   ├── eia.ts
    │   │   └── oilprice.ts
    │   ├── cache.ts
    │   ├── resolver.ts
    │   └── historical.ts
    └── projects/                     ← NEW: Projects logic
        ├── crawlers/
        │   ├── tier1-algerian.ts
        │   ├── tier2-international.ts
        │   ├── tier3-news.ts
        │   └── tier4-companies.ts
        ├── extractor.ts
        ├── deduplicator.ts
        ├── schema.ts
        └── sync-history.ts
```

---

## 2. Diagram Flow

### 2.1 Live Energy Prices — Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        ENERGY INTELLIGENCE DATA FLOW                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────┐                                                         │
│  │  PRIMARY SOURCE   │  Argus Media / S&P Global Platts (subscription API)   │
│  │  (Tier 1)         │  → Saharan Blend ★, Brent, WTI, Murban, TTF           │
│  └────────┬─────────┘                                                         │
│           │                                                                    │
│           ▼                                                                    │
│  ┌──────────────────┐                                                         │
│  │  VALIDATION       │  OPEC Basket Price (daily, opec.org)                   │
│  │  (Tier 2)         │  → Cross-check reference — NEVER primary display       │
│  └────────┬─────────┘                                                         │
│           │                                                                    │
│           ▼                                                                    │
│  ┌──────────────────┐                                                         │
│  │  FALLBACK         │  OilPrice.com (scraped)                                │
│  │  (Tier 3)         │  → Used only when Tier 1 + 2 fail — flagged            │
│  └────────┬─────────┘                                                         │
│           │                                                                    │
│           ▼                                                                    │
│  ┌──────────────────┐                                                         │
│  │  SUPPLEMENTAL     │  EIA (Henry Hub), ICE Endex (TTF delayed)              │
│  │  (Tier 4)         │  → Gas benchmarks, backup for crude                    │
│  └────────┬─────────┘                                                         │
│           │                                                                    │
│           ▼                                                                    │
│  ┌──────────────────┐                                                         │
│  │  RESOLVER         │  resolvePrimaryBenchmark(providers)                     │
│  │  (Display Logic)  │  → Saharan Blend → Brent → WTI fallback              │
│  └────────┬─────────┘                                                         │
│           │                                                                    │
│           ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐         │
│  │                        CACHE LAYER + DB                           │         │
│  │                                                                   │         │
│  │  ┌─────────────────┐     ┌──────────────────────────────────┐    │         │
│  │  │ In-Memory Cache  │     │ Supabase energy_prices table     │    │         │
│  │  │ TTL: 5 min       │────▶│ → Per-fetch (90d retention)     │    │         │
│  │  │ Per-tier expiry  │     │ → Hourly aggregate (2yr)        │    │         │
│  │  └─────────────────┘     │ → Daily aggregate (indefinite)   │    │         │
│  │                          └──────────────────────────────────┘    │         │
│  └──────────────────────────────────────────────────────────────────┘         │
│           │                                                                    │
│           ▼                                                                    │
│  ┌──────────────────────────────────────────────────────────────────┐         │
│  │                      API ENDPOINT                                 │         │
│  │  GET /api/energy-prices                                          │         │
│  │  → 7 benchmarks ordered: Saharan Blend → Brent → WTI → OPEC      │         │
│  │    Basket → Murban → TTF → Henry Hub                             │         │
│  │  → 4 metadata per price: provider, lastUpdatedUTC, delayStatus,  │         │
│  │    confidenceLevel                                                │         │
│  │  → sourceStatus map + activePrimaryBenchmark                      │         │
│  └────────────────────────────┬─────────────────────────────────────┘         │
│                               │                                                │
│                               ▼                                                │
│  ┌──────────────────────────────────────────────────────────────────┐         │
│  │                          FRONTEND                                 │         │
│  │                                                                   │         │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │         │
│  │  │ PriceTicker       │  │ /energy-prices   │  │ /intelligence/ │  │         │
│  │  │ (homepage banner) │  │ (full dashboard) │  │ [benchmark]    │  │         │
│  │  │ SWR 5min poll     │  │ PriceGrid + Cards│  │ Price+Trends+  │  │         │
│  │  │ → clickable       │  │ → clickable      │  │ AI+News+Sources│  │         │
│  │  └──────────────────┘  └──────────────────┘  └────────────────┘  │         │
│  └──────────────────────────────────────────────────────────────────┘         │
│                                                                               │
│  ═══════════════════════════════════════════════════════════════════════════  │
│  FALLBACK DISPLAY LOGIC:                                                       │
│  Saharan Blend available → ★ Saharan Blend is primary display                  │
│  Saharan Blend down    → Brent becomes primary display (NOT OPEC Basket)      │
│  OPEC Basket           → Always validation/reference — never promoted          │
│  ⚠️ OilPrice.com is NEVER the primary source for pricing                     │
│  ═══════════════════════════════════════════════════════════════════════════  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Live Energy Prices — Request Flow

```
CLIENT (Browser)
  │
  │  SWR: useSWR('/api/energy-prices', fetcher, { refreshInterval: 300000 })
  │
  ▼
GET /api/energy-prices
  │
  ├── Cache HIT? ──▶ Return cached response (5 min TTL)
  │
  └── Cache MISS:
        │
        ├── 1. RESOLVE: Which provider is available?
        │     ├── P1 Argus/Platts ──▶ fetch Saharan Blend, Brent, WTI, Murban, TTF
        │     ├── P2 OPEC ──▶ fetch OPEC Basket (concurrent)
        │     ├── P4 EIA ──▶ fetch Henry Hub (concurrent)
        │     └── Any P1 missing? ──▶ P3 OilPrice.com (fallback, flagged)
        │
        ├── 2. AGGREGATE: Merge all providers → ordered benchmark array
        │     └── Apply display fallback: Saharan Blend → Brent → WTI
        │
        ├── 3. PERSIST: Write all fetched prices to energy_prices table
        │     └── INSERT INTO energy_prices (benchmark, value, provider, ...)
        │
        ├── 4. CACHE: Store in server-side Map with 5-min TTL
        │
        └── 5. RESPOND: JSON with prices[], lastUpdated, sourceStatus, warning
```

### 2.3 Algeria Projects — Automated Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                    VERCEL CRON (every 6-12 hours)                              │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                                       ▼
┌─────────────────────┐             ┌─────────────────────────┐
│  TIER 1 CRAWLER      │             │  TIER 2-4 CRAWLER        │
│  Algerian Official    │             │  International + News +   │
│  (6 sources)          │             │  Companies (13 sources)   │
│  • Conservative rate  │             │  • Standard rate limits   │
│  • Gov site handling  │             │  • RSS where available    │
│  • energy.gov.dz      │             │  • iea.org, opec.org,     │
│  • sonatrach.com      │             │    eni.com, total.com...  │
│  • sonelgaz.dz        │             │                           │
│  • alnaft.dz          │             │                           │
│  • aapi.dz            │             │                           │
│  • joradp.dz          │             │                           │
└─────────┬─────────────┘             └──────────┬──────────────┘
          │                                       │
          └───────────────────┬───────────────────┘
                              ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    AI EXTRACTION PIPELINE                                      │
│                                                                               │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────────┐                  │
│  │ Content Fetch │──▶│ LLM Extraction│──▶│ Structure → 18    │                  │
│  │ (cheerio +    │   │ (gpt-4o-mini) │   │ fields (JSON)     │                  │
│  │  readability) │   │ FR/EN/AR      │   │ + confidence      │                  │
│  └──────────────┘   └──────────────┘   └──────────────────┘                  │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│              DEDUPLICATION + CHANGE DETECTION                                  │
│                                                                               │
│  Match incoming projects against existing DB:                                 │
│  • Name similarity (embedding cosine ≥0.85)                                   │
│  • Location proximity (GPS within 5 km)                                       │
│  • Source URL exact match                                                     │
│  • Partner + type + wilaya overlap                                            │
│                                                                               │
│  Outcomes: NEW │ UPDATED │ UNCHANGED │ CONFLICT                               │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                    REVIEW QUEUE (Admin CMS)                                    │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ NEW PROJECTS         │ CHANGES TO REVIEW    │ CONFLICTS                   ││
│  │ (approve/reject)     │ (approve/dismiss)    │ (resolve)                   ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                               │
│  Admin actions: Approve → Published | Edit → Published                        │
│                 Reject → Archived | Dismiss change → Keep prev                 │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                  LIVE DATABASE (Supabase — energy_projects)                    │
│                                                                               │
│  18-field schema + source_url + source_urls[] + sync_history JSONB             │
│  Audit trail: every create/update/dismiss tracked                             │
│  Stale flagging: >30 days without source update                               │
└────────────────────────────┬─────────────────────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND                                              │
│                                                                               │
│  /energy-projects                                                             │
│  ├── Hero: "Algeria Energy Projects Database — auto-updated from 19 sources"  │
│  ├── Filter bar: category pills + status dropdown + wilaya + search            │
│  ├── Project grid: cards with status/category badges, capacity, operators     │
│  ├── Interactive map: Leaflet + React-Leaflet with GPS markers + popups       │
│  └── Project detail: modal or dedicated page with all 18 fields               │
│                                                                               │
│  /admin/projects/review                                                       │
│  ├── Tabs: New | Changes | Conflicts                                          │
│  ├── Review cards: project summary, source, confidence                        │
│  └── Actions: Approve / Edit / Reject / Dismiss / Resolve                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Database Schema — New Tables

```
┌──────────────────────────────────────────────────────────────────┐
│                      energy_prices                                │
├──────────────────────────────────────────────────────────────────┤
│ id              BIGSERIAL PRIMARY KEY                            │
│ benchmark       VARCHAR(64) NOT NULL                             │
│ category        VARCHAR(32) NOT NULL   (crude, natural_gas, ...) │
│ value           DECIMAL(12,4) NOT NULL                            │
│ unit            VARCHAR(16) NOT NULL    (USD/bbl, EUR/MWh, ...)  │
│ change          DECIMAL(8,4)                                      │
│ change_pct      DECIMAL(6,2)                                      │
│ trend           VARCHAR(4)             (up, down, flat)          │
│ provider        VARCHAR(32) NOT NULL                              │
│ provider_tier   SMALLINT NOT NULL       (1, 2, 3, 4)             │
│ delay_status    VARCHAR(20) NOT NULL                              │
│ confidence      VARCHAR(8) NOT NULL     (high, medium, low)      │
│ availability    VARCHAR(24) NOT NULL    DEFAULT 'available'       │
│ source_url      TEXT                                               │
│ fetched_at      TIMESTAMPTZ NOT NULL    DEFAULT NOW()             │
│ is_active_primary BOOLEAN DEFAULT FALSE                           │
├──────────────────────────────────────────────────────────────────┤
│ INDEXES: idx_ep_benchmark_time, idx_ep_category_time,            │
│          idx_ep_fetched_at                                        │
│ MATERIALIZED VIEW: energy_prices_latest (last 2h, per benchmark)  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     energy_projects                               │
├──────────────────────────────────────────────────────────────────┤
│ id                  UUID PRIMARY KEY DEFAULT gen_random_uuid()   │
│ name                TEXT NOT NULL                                │
│ slug                TEXT NOT NULL UNIQUE                          │
│ energy_sector       TEXT NOT NULL  (oil, gas, lng, renewable...) │
│ project_type        TEXT           (pipeline, field, plant, ...) │
│ wilaya              TEXT                                          │
│ municipality        TEXT                                          │
│ gps_lat             DECIMAL(10,7)                                 │
│ gps_lng             DECIMAL(10,7)                                 │
│ operating_company   TEXT                                          │
│ project_partners    TEXT[] DEFAULT '{}'                           │
│ investment_value    TEXT                                          │
│ production_capacity TEXT                                          │
│ project_status      TEXT NOT NULL  (operational, construction...) │
│ completion_pct      DECIMAL(5,2)                                  │
│ start_date          DATE                                          │
│ expected_completion DATE                                          │
│ project_description TEXT                                          │
│ source_url          TEXT                                          │
│ source_name         TEXT                                          │
│ last_updated        TIMESTAMPTZ DEFAULT NOW()                     │
│ last_source_check   TIMESTAMPTZ DEFAULT NOW()                     │
│ source_urls         TEXT[] DEFAULT '{}'                           │
│ review_status       TEXT NOT NULL DEFAULT 'pending'               │
│ reviewed_by         TEXT                                          │
│ reviewed_at         TIMESTAMPTZ                                   │
│ featured            BOOLEAN DEFAULT false                         │
│ sort_order          INTEGER DEFAULT 0                             │
│ sync_history        JSONB DEFAULT '[]'                            │
│ created_at          TIMESTAMPTZ DEFAULT NOW()                     │
│ updated_at          TIMESTAMPTZ DEFAULT NOW()                     │
├──────────────────────────────────────────────────────────────────┤
│ INDEXES: idx_eproj_sector, idx_eproj_status, idx_eproj_wilaya,   │
│          idx_eproj_review, idx_eproj_source                       │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Design Layout

### 3.1 Design System — Existing Theme

| Token | Value | Usage |
|-------|-------|-------|
| `--navy` | `#0f172a` | Primary text, headers |
| `--green` | `#0d9488` | Accent, buttons, CTAs |
| `--line` | `#e2e8f0` | Borders, dividers |
| `--muted` | `#64748b` | Secondary text, metadata |
| `--bg` | `#f8fafc` | Page background |
| Font (heading) | Serif (Newsreader/Inter) | Headings, hero text |
| Font (body) | Sans (system) | Body text, cards, UI |

### 3.2 Feature 1 — Live Energy Prices UI

#### 3.2.1 Homepage Price Ticker

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Live Energy Markets  ─────────────────────────────────────────────────  │  │
│  │                                                                          │  │
│  │  ★ Saharan Blend     Brent       WTI        OPEC Basket                 │  │
│  │  $94.20 ▼0.9%        $93.68 ▼1.2% $89.45 ▲0.3% $92.10 ▼0.8%            │  │
│  │  Platts · RT · High  Platts·RT  EIA·15min  OPEC·Daily                   │  │
│  │                                                                          │  │
│  │  [Updated 2 min ago]  [View All Prices →]                                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘

Design specs:
• Horizontal scrolling ticker (smooth CSS scroll or manual)
• 4-5 benchmarks visible at once on desktop
• Each benchmark: name, price, change %, trend arrow, provider badge
• Green background section with white/light text
• Click any benchmark → /intelligence/[benchmark]
• Mobile: 2 visible, horizontal swipe
• Auto-scroll every 8 seconds, pause on hover
• Last updated timestamp bottom-left
```

#### 3.2.2 `/energy-prices` — Full Price Dashboard

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Energy Prices                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Energy Intelligence Platform                                                 │
│  Real-time energy commodity prices from authoritative sources.                │
│  Updated every 5 minutes. Last update: 2026-06-21 14:30 UTC                  │
│                                                                               │
│  ╔══════════════════════════════════════════════════════════════════════════╗ │
│  ║  ★ PRIMARY BENCHMARK                              Saharan Blend         ║ │
│  ║  ═══════════════════════════════════════════════════════════════════════ ║ │
│  ║                                                                          ║ │
│  ║  ┌──────────────────────────────────────────────────────────────────┐   ║ │
│  ║  │                                                                   │   ║ │
│  ║  │  Saharan Blend                           ★ Algerian Crude         │   ║ │
│  ║  │                                                                   │   ║ │
│  ║  │              $94.20                   ▼ 0.89%                     │   ║ │
│  ║  │                                        -$0.85                     │   ║ │
│  ║  │                                                                   │   ║ │
│  ║  │  Source: Platts  ·  Real-time  ·  High confidence                │   ║ │
│  ║  │  Last updated: 2026-06-21 14:30 UTC                              │   ║ │
│  ║  │                                                                   │   ║ │
│  ║  │  [View Intelligence →]                                            │   ║ │
│  ║  └──────────────────────────────────────────────────────────────────┘   ║ │
│  ╚══════════════════════════════════════════════════════════════════════════╝ │
│                                                                               │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────┐ │
│  │ 🛢️ Brent                │ │ 🛢️ WTI                  │ │ 📊 OPEC Basket  │ │
│  │                         │ │                         │ │                 │ │
│  │ $93.68                  │ │ $89.45                  │ │ $92.10          │ │
│  │ ▼1.2%  -$1.14           │ │ ▲0.3%  +$0.27           │ │ ▼0.8%  -$0.74   │ │
│  │                         │ │                         │ │                 │ │
│  │ Platts · RT · High      │ │ EIA · 15min · High      │ │ OPEC · Daily    │ │
│  │ [Intelligence →]        │ │ [Intelligence →]        │ │ · Med conf      │ │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────┘ │
│                                                                               │
│  ┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────┐ │
│  │ 🛢️ Murban               │ │ 🔥 TTF (Natural Gas)    │ │ 🔥 Henry Hub    │ │
│  │                         │ │                         │ │                 │ │
│  │ $91.55                  │ │ €28.40/MWh              │ │ $3.15/MMBtu     │ │
│  │ ▼0.5%  -$0.46           │ │ ▲1.8%  +€0.50           │ │ ▼0.7%  -$0.02   │ │
│  │                         │ │                         │ │                 │ │
│  │ Platts · RT · High      │ │ ICE · 30min · Med       │ │ EIA · Daily     │ │
│  │ [Intelligence →]        │ │ [Intelligence →]        │ │ · Med conf      │ │
│  └─────────────────────────┘ └─────────────────────────┘ └─────────────────┘ │
│                                                                               │
│  ─────────────────────────────────────────────────────────────────────────   │
│  Source Status: Platts ✅ | Argus ⚠️ | OPEC ✅ | EIA ✅ | OilPrice ✅         │
│  ⚠️ Saharan Blend temporarily unavailable — Brent shown as primary.          │
│     OPEC Basket shown for validation.                                         │
└──────────────────────────────────────────────────────────────────────────────┘

Design specs:
• Primary benchmark card: larger, highlighted border (teal/green accent)
• Standard cards: 2x3 grid on desktop, 1-column on mobile
• Each card: benchmark icon, name, price (large), change (colored), metadata
• Change: green ▲ for up, red ▼ for down
• Each card clickable → /intelligence/[benchmark]
• Source status bar at bottom
• Responsive: 3-col desktop → 2-col tablet → 1-col mobile
```

#### 3.2.3 `/intelligence/[benchmark]` — Intelligence Page

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Energy Prices > Saharan Blend Intelligence                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  ★ SAHARAN BLEND  $94.20 ▼0.9%  · Platts · Real-time · High confidence │ │
│  │  Algerian crude benchmark — last updated 14:30 UTC                       │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────────┐ │
│  │                                 │ │                                     │ │
│  │  HISTORICAL TREND               │ │  AI MARKET ANALYSIS                 │ │
│  │                                 │ │                                     │ │
│  │  7d · 30d · 90d · 1y  [tabs]   │ │  "Saharan Blend declined 0.9%      │ │
│  │                                 │ │  today, driven by..."              │ │
│  │  ┌───────────────────────────┐  │ │                                     │ │
│  │  │    /\     /\               │  │ │  Sources: OPEC MOMR (Jun 2026),    │ │
│  │  │   /  \   /  \    /\       │  │ │  Platts Crude Oil Marketwire,      │ │
│  │  │  /    \_/    \__/  \___   │  │ │  Sonatrach PR (Jun 15)             │ │
│  │  │                           │  │ │                                     │ │
│  │  │  [interactive line chart] │  │ │  [Expand Analysis →]               │ │
│  │  └───────────────────────────┘  │ │                                     │ │
│  │                                 │ └─────────────────────────────────────┘ │
│  └─────────────────────────────────┘                                         │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  RELATED NEWS & ANALYSIS                            [View All →]         │ │
│  │                                                                          │ │
│  │  • Sonatrach announces new production targets for Hassi Messaoud...     │ │
│  │    sonatrach.com · 2 days ago                                            │ │
│  │  • OPEC+ maintains output cuts through Q3 2026...                        │ │
│  │    reuters.com · 3 days ago                                              │ │
│  │  • Algerian crude exports to Europe rise 2.3% in May...                  │ │
│  │    energy.gov.dz · 5 days ago                                            │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  PRODUCTION & COUNTRY CONTEXT                                            │ │
│  │                                                                          │ │
│  │  Algeria crude production: ~960,000 bpd (OPEC MOMR Jun 2026)            │ │
│  │  Main export destinations: Italy, France, Spain, Netherlands             │ │
│  │  Key infrastructure: MEDGAZ Pipeline, TransMed Pipeline                  │ │
│  │  Saharan Blend API gravity: ~45°  |  Sulfur: ~0.10%                     │ │
│  │                                                                          │ │
│  │  [View Algeria Energy Projects →]                                        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  RELATED BENCHMARKS                                                      │ │
│  │                                                                          │ │
│  │  Brent $93.68 ▼1.2%  │  OPEC Basket $92.10 ▼0.8%  │  Murban $91.55     │ │
│  │                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  SOURCES & REFERENCES                                                    │ │
│  │                                                                          │ │
│  │  AI analysis used:                                                       │ │
│  │  • OPEC Monthly Oil Market Report (June 2026)                            │ │
│  │  • Platts Crude Oil Marketwire (June 21, 2026)                           │ │
│  │  • Sonatrach press release (June 15, 2026)                               │ │
│  │                                                                          │ │
│  │  Official reports & publications:                                        │ │
│  │  • IEA Oil Market Report — June 2026                                     │ │
│  │  • EIA Short-Term Energy Outlook — June 2026                             │ │
│  │  • Algeria Ministry of Energy — Production Statistics 2025               │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Feature 2 — Algeria Project Map Interactive UI

#### 3.3.1 `/energy-projects` — Main Page

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Breadcrumb: Home > Algeria Energy Projects                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  Algeria Energy Projects Database                                             │
│  Comprehensive, self-updating database of energy infrastructure projects     │
│  across Algeria. Sourced from 19 official channels. Last sync: 2 hours ago.  │
│  [How This Works ↓]                                                          │
│                                                                               │
│  ─────────────────────────────────────────────────────────────────────────   │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ Filter:                                                                  │ │
│  │                                                                          │ │
│  │ [All] [🛢️Oil & Gas] [☀️Renewable] [🔥LNG] [⚡Power] [💧Hydrogen]        │ │
│  │                                                                          │ │
│  │ Status: [All ▼]    Wilaya: [All ▼]    🔍 Search projects...              │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │                                    │ │                                  │ │
│  │  🟢 Operational  📦 Pipeline       │ │  🟡 Under Construction  ☀️ Solar │ │
│  │                                    │ │                                  │ │
│  │  Medgaz Gas Pipeline               │ │  Solar 15 GW Programme           │ │
│  │  Algeria → Spain (Almería)         │ │  National renewable rollout      │ │
│  │  10 bcm/year capacity              │ │  15 GW target capacity           │ │
│  │  Sonatrach · Naturgy               │ │  Sonelgaz · Sonatrach            │ │
│  │                                    │ │                                  │ │
│  │  📎 Source: sonatrach.com          │ │  📎 Source: energy.gov.dz        │ │
│  │  🕐 Updated: 2026-06-19            │ │  🕐 Updated: 2026-06-16           │ │
│  │                                    │ │                                  │ │
│  │  [View Details →]                  │ │  [View Details →]                │ │
│  └────────────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                               │
│  ┌────────────────────────────────────┐ ┌──────────────────────────────────┐ │
│  │  🔵 Planned  📦 Pipeline           │ │  🟢 Operational  🔥 LNG          │ │
│  │                                    │ │                                  │ │
│  │  Trans-Saharan Gas Pipeline        │ │  Skikda LNG Terminal             │ │
│  │  Nigeria → Algeria → Europe        │ │  Mediterranean export hub        │ │
│  │  30 bcm/year planned               │ │  Multiple trains                 │ │
│  │  Sonatrach · NNPC · Niger          │ │  Sonatrach                       │ │
│  │                                    │ │                                  │ │
│  │  📎 Source: energy.gov.dz          │ │  📎 Source: sonatrach.com        │ │
│  │  🕐 Updated: 2026-06-10            │ │  🕐 Updated: 2026-06-15           │ │
│  │                                    │ │                                  │ │
│  │  [View Details →]                  │ │  [View Details →]                │ │
│  └────────────────────────────────────┘ └──────────────────────────────────┘ │
│                                                                               │
│  ═══════════════════════════════════════════════════════════════════════════  │
│                                                                               │
│                        INTERACTIVE PROJECT MAP                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                          │ │
│  │                        🇩🇿   ALGERIA                                    │ │
│  │                                                                          │ │
│  │              🌊 Mediterranean Sea                                       │ │
│  │        🟢 Skikda    🟢 Arzew                                            │ │
│  │              🟡 ELMED                                                   │ │
│  │                                                                          │ │
│  │         🟢 Hassi R'Mel                                                  │ │
│  │              🟡 Solar 15 GW                                              │ │
│  │                                                                          │ │
│  │    🟡 Touat    🟢 Reggane Nord                                          │ │
│  │                                                                          │ │
│  │                     🟢 = Operational  🟡 = Under Construction            │ │
│  │                     🔵 = Planned      ⚪ = Proposed                      │ │
│  │                                                                          │ │
│  │  [Click marker → Show project popup with name, status, capacity]        │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

Design specs:
• Filter bar: category pills (rounded, active state with green fill), dropdowns, search input
• Project cards: 3-column grid on desktop, 2 on tablet, 1 on mobile
• Each card: status badge (colored), category icon, project name, route/capacity, operators, source
• Map: full-width, ~400px height, Leaflet with OpenStreetMap tiles
• Map markers: colored by status (green=operational, amber=construction, blue=planned, gray=proposed)
• Map popups: project name, status badge, capacity, click to view details
• Project detail: expand inline or modal overlay with all 18 fields
• Responsive: map collapses below filter on mobile
```

#### 3.3.2 Project Detail Card (Expanded/Modal)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│  Medgaz Gas Pipeline                                              [✕ Close]  │
│  ─────────────────────────────────────────────────────────────────────────   │
│                                                                               │
│  🟢 Operational    📦 Pipeline                                                │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                          │ │
│  │  Overview                                                                │ │
│  │  ────────                                                                │ │
│  │  Direct subsea natural gas pipeline connecting the Hassi R'Mel field     │ │
│  │  in Algeria to Almería, Spain. Operational since 2011, recently expanded │ │
│  │  from 8 bcm/year to 10 bcm/year capacity. Strategic infrastructure for   │ │
│  │  Algerian gas exports to Southern Europe.                                │ │
│  │                                                                          │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌───────────────────────┐  ┌───────────────────────┐                        │
│  │ Location              │  │ Capacity              │                        │
│  │ Beni Saf, Aïn Témouch │  │ 10 bcm/year           │                        │
│  │ → Almería, Spain      │  │ (expanded from 8)     │                        │
│  │ Wilaya: Aïn Témouchent│  │                       │                        │
│  └───────────────────────┘  └───────────────────────┘                        │
│                                                                               │
│  ┌───────────────────────┐  ┌───────────────────────┐                        │
│  │ Operator              │  │ Partners              │                        │
│  │ Sonatrach             │  │ • Naturgy (Spain)     │                        │
│  │                       │  │ • Sonatrach (Algeria) │                        │
│  └───────────────────────┘  └───────────────────────┘                        │
│                                                                               │
│  ┌───────────────────────┐  ┌───────────────────────┐                        │
│  │ Start Date            │  │ Investment            │                        │
│  │ 2008                  │  │ ~€900 million         │                        │
│  └───────────────────────┘  └───────────────────────┘                        │
│                                                                               │
│  ─────────────────────────────────────────────────────────────────────────   │
│  📎 Primary Source: sonatrach.com/press/medgaz-expansion-2026                 │
│  📎 Additional Sources: eni.com, reuters.com                                  │
│  🕐 Last updated: 2026-06-19 08:30 UTC (source check: 2026-06-20)            │
│                                                                               │
│  Sync History:                                                                │
│  • 2026-06-19 — Capacity updated: 8 → 10 bcm/year (source: sonatrach.com)   │
│  • 2026-06-15 — Status confirmed: Operational (source: eni.com)              │
│  • 2026-06-10 — Project created (source: sonatrach.com)                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

#### 3.3.3 Admin Review Queue — `/admin/projects/review`

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Projects — Review Queue                                        12 pending    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  [🟡 New (5)]  [🔵 Changes (4)]  [🔴 Conflicts (3)]                          │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ 🟡 NEW PROJECT                                      Sonatrach · 2h ago  │ │
│  │                                                                          │ │
│  │ Hassi R'Mel Solar Plant                                                 │ │
│  │ Sector: Renewable  │  Type: Solar  │  Wilaya: Laghouat                  │ │
│  │ Capacity: 150 MW   │  Status: Under Construction                        │ │
│  │ Operator: Sonelgaz  │  Partners: Sonatrach, Eni                         │ │
│  │                                                                          │ │
│  │ Description: New solar PV plant at Hassi R'Mel site, part of national   │ │
│  │ renewable energy programme. Expected completion 2028.                    │ │
│  │                                                                          │ │
│  │ 📎 Source: sonatrach.com/press/hassi-rmel-solar                         │ │
│  │ Confidence: High (8/18 fields high confidence)                           │ │
│  │                                                                          │ │
│  │ [Approve]  [Edit]  [Reject]                                              │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ 🔵 CHANGES DETECTED                                   Eni · 5h ago      │ │
│  │                                                                          │ │
│  │ Medgaz Pipeline Expansion                                               │ │
│  │ ─────────────────────────────────────────────────────────────────────  │ │
│  │ • Capacity: 8 bcm/year → 10 bcm/year                                    │ │
│  │ • Status: Operational → Operational (unchanged)                          │ │
│  │                                                                          │ │
│  │ 📎 Source: eni.com/media/press-release/medgaz-expansion                  │ │
│  │                                                                          │ │
│  │ [Approve Change]  [Dismiss]  [Edit]                                     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │ 🔴 CONFLICT                                           Reuters · 1d ago  │ │
│  │                                                                          │ │
│  │ TSGP Pipeline — Status Discrepancy                                       │ │
│  │ ─────────────────────────────────────────────────────────────────────  │ │
│  │ Sonatrach (Tier 1): Planned         Reuters (Tier 3): Under Discussion   │ │
│  │ JORADP (Tier 1): Proposed           Eni (Tier 4): Planned               │ │
│  │                                                                          │ │
│  │ [Keep Sonatrach (Planned)]  [Accept Reuters (Under Discussion)]         │ │
│  │ [Manual Resolve →]                                                      │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Status Badge System

| Status | Color | Badge | CSS Class |
|--------|-------|-------|-----------|
| Operational | Green | 🟢 Operational | `bg-green-100 text-green-800` |
| Under Construction | Amber | 🟡 Under Construction | `bg-amber-100 text-amber-800` |
| Planned | Blue | 🔵 Planned | `bg-blue-100 text-blue-800` |
| Proposed | Gray | ⚪ Proposed | `bg-gray-100 text-gray-600` |
| Completed | Dark Green | ✅ Completed | `bg-emerald-100 text-emerald-800` |
| Suspended | Red | 🔴 Suspended | `bg-red-100 text-red-800` |

### 3.5 Public-Facing Messaging Rules

| Internal Status | User-Facing Display |
|-----------------|---------------------|
| Premium API not subscribed | "Temporarily unavailable" |
| API timeout / fetch failed | "Updating — check back shortly" |
| All sources down | "Prices temporarily unavailable — last updated [timestamp]" |
| Benchmark not yet configured | "Coming soon" |

> ⚠️ Never expose internal licensing status or infrastructure details to end users.

### 3.6 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| **Desktop (≥1024px)** | 3-col price grid, 3-col project grid, side-by-side intelligence layout, full map width |
| **Tablet (≥640px)** | 2-col price grid, 2-col project grid, stacked intelligence layout, full map width |
| **Mobile (<640px)** | 1-col everything, map height 300px, filter bar scrollable, ticker shows 2 items, cards full-width |

### 3.7 Loading & Empty States

```
Loading states:
• Price cards: skeleton shimmer (pulse animation)
• Project cards: skeleton shimmer
• Charts: skeleton area with "Loading historical data..."
• Map: skeleton rectangle with "Loading map..."

Empty states:
• No projects match filters: "No projects match your criteria. Try adjusting filters."
• All prices unavailable: warning banner + last known values with stale timestamp
• Review queue empty: "All caught up! No projects pending review."
```

---

## 4. Timeline

### 4.1 Overview

| Phase | Feature | Days | Dependencies |
|-------|---------|------|-------------|
| Setup | Foundation + DB Schema | 2 | None |
| F01 | Live Energy Prices | 5 | Setup |
| F05 | Algeria Project Map | 18-22 | Setup |
| **Total** | **With overlap** | **~20-24 days** | |

> F01 and F05 can overlap significantly — they share no dependencies except the foundation setup.

### 4.2 Week-by-Week Breakdown

```
WEEK 1 — Foundation + F01 Start
┌──────────────────────────────────────────────────────────────────┐
│ Day 1-2: Foundation                                              │
│ ├── Database migrations (energy_prices, energy_projects tables) │
│ ├── Base types (BenchmarkPrice, ProjectSchema, PriceProvider)    │
│ ├── Install packages: swr, cheerio, recharts, leaflet, etc.     │
│ └── Benchmark registry config                                    │
│                                                                   │
│ Day 3-5: F01 — API + Data Layer                                  │
│ ├── PriceProvider interface + types                              │
│ ├── Provider implementations (OPEC, EIA, OilPrice fallback)      │
│ ├── Resolver logic (Saharan Blend → Brent fallback)              │
│ ├── In-memory cache with 5-min TTL                              │
│ ├── GET /api/energy-prices endpoint                              │
│ └── Historical DB write on every fetch                           │
└──────────────────────────────────────────────────────────────────┘

WEEK 2 — F01 Frontend + F05 Crawler
┌──────────────────────────────────────────────────────────────────┐
│ Day 6-7: F01 — Frontend                                          │
│ ├── PriceTicker component (homepage horizontal ticker)           │
│ ├── useSWR client hook with 5-min polling                        │
│ ├── PriceCard, PriceGrid components                              │
│ ├── /energy-prices page (full dashboard)                         │
│ ├── SourceAttribution + PriceMetadata components                 │
│ └── Responsive styling + loading/empty states                    │
│                                                                   │
│ Day 8-10: F05 — Crawler + Extraction Pipeline                    │
│ ├── Crawler framework (rate limiting, retry, backoff)            │
│ ├── Tier 1 crawler (6 Algerian official sources)                 │
│ ├── Tier 2-4 crawlers (13 international/news/company sources)    │
│ ├── AI extraction pipeline (cheerio → gpt-4o-mini → 18 fields)  │
│ ├── Extraction prompt tuning for FR/AR/EN content                │
│ └── Token tracking + daily budget (300K tokens)                  │
└──────────────────────────────────────────────────────────────────┘

WEEK 3 — F05 Deduplication + Database + Review CMS
┌──────────────────────────────────────────────────────────────────┐
│ Day 11-12: F05 — Deduplication + Change Detection               │
│ ├── Embedding-based name matching (cosine similarity ≥0.85)     │
│ ├── GPS proximity matching (5 km radius)                        │
│ ├── Multi-signal matching (partners + type + wilaya)            │
│ ├── Change detection: field-level diff                          │
│ └── Outcome classification: NEW / UPDATED / UNCHANGED / CONFLICT│
│                                                                   │
│ Day 13-14: F05 — Review CMS                                      │
│ ├── /admin/projects/review page (New | Changes | Conflicts tabs) │
│ ├── ProjectReviewCard component                                  │
│ ├── Review actions API (approve, edit, reject, dismiss, resolve) │
│ ├── Sync history tracking (JSONB audit trail)                   │
│ └── Stale project flagging (>30 days without update)            │
└──────────────────────────────────────────────────────────────────┘

WEEK 4 — F05 Frontend + F01 Intelligence Pages
┌──────────────────────────────────────────────────────────────────┐
│ Day 15-16: F05 — Frontend                                        │
│ ├── /energy-projects page (hero, description, last sync time)    │
│ ├── ProjectFilters component (category pills, status, wilaya)    │
│ ├── ProjectGrid + ProjectCard components                         │
│ ├── ProjectDetail (expandable/modal with all 18 fields)          │
│ └── Source attribution + last-updated display                    │
│                                                                   │
│ Day 17-19: F05 — Interactive Map                                 │
│ ├── Leaflet + React-Leaflet integration                          │
│ ├── GPS markers colored by project status                        │
│ ├── Marker clustering for dense areas                            │
│ ├── Popup cards (name, status, capacity, link to detail)         │
│ ├── Map/filter sync (filtering updates map markers)              │
│ └── Responsive map (full width desktop, 300px mobile)            │
│                                                                   │
│ Day 20-21: F01 — Intelligence Pages                              │
│ ├── /intelligence/[benchmark] route                              │
│ ├── Price header with full metadata                              │
│ ├── Historical chart integration (from energy_prices table)      │
│ ├── Related benchmarks section                                   │
│ ├── Sources & References section                                 │
│ └── Phase 2 shell (AI analysis + news + context = Phase 3)       │
└──────────────────────────────────────────────────────────────────┘

WEEK 5 — Integration, Testing, Polish
┌──────────────────────────────────────────────────────────────────┐
│ Day 22-24: Integration + Testing                                 │
│ ├── Homepage ticker integration                                  │
│ ├── Cross-linking: intelligence ↔ project details               │
│ ├── Seed 12 initial projects for validation                      │
│ ├── End-to-end crawl → extract → review → publish flow          │
│ ├── Mobile responsiveness testing                               │
│ ├── Loading states + error boundaries                           │
│ ├── i18n strings for new pages (EN/FR/AR)                       │
│ └── Performance check (LCP, CLS, bundle size)                   │
│                                                                   │
│ Day 25: Deployment                                               │
│ ├── Vercel cron job setup (every 6-12h for F05 crawlers)        │
│ ├── Environment variables (EIA key, OpenAI key, extraction cap)  │
│ ├── Staging deploy → test → production deploy                   │
│ └── Documentation handoff                                        │
└──────────────────────────────────────────────────────────────────┘
```

### 4.3 Detailed Task Breakdown

#### Foundation (2 days)

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| F-01 | Create `energy_prices` migration + indexes + materialized view | 0.5d | — |
| F-02 | Create `energy_projects` migration + indexes | 0.5d | — |
| F-03 | Install packages (swr, cheerio, recharts, leaflet, react-leaflet, readability) | 0.25d | — |
| F-04 | Define TypeScript types (BenchmarkPrice, ProjectSchema, PriceProvider, etc.) | 0.5d | F-01, F-02 |
| F-05 | Benchmark registry + provider interface scaffolding | 0.25d | F-04 |

#### Feature 1 — Live Energy Prices (5 days)

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| LP-01 | PriceProvider interface + base types | 0.25d | F-04 |
| LP-02 | OPEC provider implementation (opec.org scraping) | 0.5d | LP-01 |
| LP-03 | EIA provider implementation (API) | 0.5d | LP-01 |
| LP-04 | OilPrice provider implementation (fallback scraping) | 0.5d | LP-01 |
| LP-05 | Argus/Platts provider stub (ready for subscription) | 0.25d | LP-01 |
| LP-06 | Resolver logic (merge + Saharan Blend → Brent fallback) | 0.5d | LP-02-LP-05 |
| LP-07 | In-memory cache (5-min TTL, per-tier) | 0.25d | LP-06 |
| LP-08 | `GET /api/energy-prices` endpoint (aggregate + cache + DB write) | 1d | LP-06, LP-07 |
| LP-09 | Historical DB write (energy_prices INSERT on every fetch) | 0.25d | LP-08 |
| LP-10 | `GET /api/intelligence/[benchmark]` endpoint (stub for Phase 3) | 0.5d | LP-08 |
| LP-11 | PriceCard component (price, change%, trend, metadata) | 0.5d | LP-06 |
| LP-12 | PriceGrid component (responsive grid of cards) | 0.25d | LP-11 |
| LP-13 | PriceTicker component (horizontal scrolling homepage widget) | 0.5d | LP-11 |
| LP-14 | `/energy-prices` page (full dashboard) | 0.5d | LP-08, LP-12 |
| LP-15 | `/intelligence/[benchmark]` page (price + chart + sources) | 1d | LP-10, LP-11 |
| LP-16 | SWR client hook with 5-min polling | 0.25d | LP-08 |
| LP-17 | Public messaging rules implementation | 0.25d | LP-11 |
| LP-18 | Homepage ticker integration | 0.25d | LP-13 |

#### Feature 2 — Algeria Project Map Interactive (18-22 days)

**Crawler Pipeline (4 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| EP-01 | Crawler framework (rate limiter, retry, backoff, User-Agent) | 1d | — |
| EP-02 | Tier 1 crawler: 6 Algerian official sources (energy.gov.dz, sonatrach.com, sonelgaz.dz, alnaft.dz, aapi.dz, joradp.dz) | 1.5d | EP-01 |
| EP-03 | Tier 2 crawler: 5 international org sources (World Bank, IEA, OPEC, GEM, AfDB) | 1d | EP-01 |
| EP-04 | Tier 3-4 crawler: Reuters + 7 company sources (Eni, TotalEnergies, BP, Equinor, ExxonMobil, Chevron, Oxy) | 0.5d | EP-01 |

**AI Extraction Pipeline (3 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| EP-05 | Content fetcher (cheerio + @mozilla/readability → clean text) | 0.5d | EP-01 |
| EP-06 | LLM extraction prompt (18-field JSON, FR/AR/EN, confidence scores) | 1d | EP-05 |
| EP-07 | Extraction pipeline orchestration (fetch → extract → validate) | 1d | EP-05, EP-06 |
| EP-08 | Token tracking + daily budget enforcement (300K tokens) | 0.5d | EP-07 |

**Deduplication + Change Detection (2 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| EP-09 | Embedding generation (text-embedding-3-small) for project names | 0.5d | — |
| EP-10 | Name similarity matching (cosine ≥0.85) | 0.5d | EP-09 |
| EP-11 | GPS proximity matching (5 km radius) | 0.25d | — |
| EP-12 | Multi-signal matching (partners + type + wilaya overlap) | 0.25d | EP-10, EP-11 |
| EP-13 | Change detection: field-level diff + outcome classification | 0.5d | EP-12 |

**Review CMS (2 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| EP-14 | Review queue API endpoints (approve, edit, reject, dismiss, resolve) | 1d | EP-13 |
| EP-15 | `/admin/projects/review` page (New / Changes / Conflicts tabs) | 1d | EP-14 |
| EP-16 | ProjectReviewCard + ReviewQueue components | (in EP-15) | EP-14 |
| EP-17 | Sync history tracking (JSONB audit trail) | (in EP-14) | — |
| EP-18 | Stale project flagging (>30 days) | 0.25d | EP-13 |

**Frontend (3 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| EP-19 | `GET /api/energy-projects` endpoint (filtered, paginated) | 0.5d | F-02 |
| EP-20 | ProjectCard component (status badge, category, operators, source) | 0.5d | — |
| EP-21 | ProjectFilters component (category pills, status, wilaya, search) | 0.5d | — |
| EP-22 | ProjectGrid component (responsive grid of cards) | 0.25d | EP-20 |
| EP-23 | ProjectDetail component (modal/expand with all 18 fields) | 0.5d | EP-20 |
| EP-24 | `/energy-projects` page (hero + filters + grid + map) | 0.75d | EP-19-EP-23 |

**Interactive Map (3 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| EP-25 | Leaflet + React-Leaflet setup with OpenStreetMap tiles | 0.5d | — |
| EP-26 | GPS markers colored by project status | 0.5d | EP-25 |
| EP-27 | Marker clustering (Leaflet.markercluster) | 0.5d | EP-26 |
| EP-28 | Popup cards (name, status, capacity, detail link) | 0.5d | EP-26 |
| EP-29 | Map/filter sync (filter bar updates map markers) | 0.5d | EP-26, EP-21 |
| EP-30 | Responsive map behavior (mobile collapse, full desktop) | 0.5d | EP-25 |

**Integration & Testing (3 days)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| INT-01 | Seed 12 initial projects for validation | 0.5d | EP-19 |
| INT-02 | End-to-end test: crawl → extract → dedupe → review → publish → display | 1d | All |
| INT-03 | Cross-linking: intelligence pages ↔ project details | 0.25d | LP-15, EP-23 |
| INT-04 | Mobile responsiveness QA | 0.25d | All UI |
| INT-05 | i18n strings for new pages (EN/FR/AR) | 0.5d | All UI |
| INT-06 | Loading states + error boundaries | 0.25d | All UI |
| INT-07 | Performance audit (LCP, CLS, bundle size) | 0.25d | All |

**Deployment (1 day)**

| # | Task | Est. | Dependencies |
|---|------|------|-------------|
| DEP-01 | Vercel cron job: F05 crawlers (every 6-12h) | 0.25d | EP-02-EP-04 |
| DEP-02 | Environment variables (EIA key, OpenAI key, extraction cap) | 0.25d | — |
| DEP-03 | Staging deploy → smoke test → production deploy | 0.5d | All |

### 4.4 Milestones

| Milestone | When | Deliverable |
|-----------|------|-------------|
| **M1 — Foundation Ready** | Day 2 | DB tables, types, registry, packages installed |
| **M2 — Prices API Live** | Day 5 | `/api/energy-prices` returns 7 benchmarks with metadata |
| **M3 — Price UI Complete** | Day 7 | Ticker on homepage, `/energy-prices` dashboard, intelligence pages |
| **M4 — Crawlers Running** | Day 10 | All 19 sources crawled, data flowing to extraction pipeline |
| **M5 — Review CMS Working** | Day 14 | Admin can approve, edit, reject, resolve conflicts |
| **M6 — Map Interactive** | Day 19 | Leaflet map with GPS markers, clustering, filter sync |
| **M7 — Integration Done** | Day 22 | Cross-linking, responsiveness, i18n, loading states |
| **M8 — Deployed to Prod** | Day 24-25 | Staging tested → production live, cron running |

### 4.5 Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Argus/Platts subscription not acquired | Medium | Medium | All providers built as pluggable; deploy with OPEC+EIA+OilPrice fallback. Swap in Argus/Platts when subscribed. No code changes needed. |
| Algerian gov sites slow/unavailable | Medium | High | Conservative crawl rate with exponential backoff; cache last known data; flag in review queue |
| AI extraction hallucinates project data | High | Medium | Confidence scoring per field; human review queue; cross-source verification; never auto-publish |
| Leaflet map performance with 50+ markers | Low | Low | Marker clustering; only render visible markers |
| Crawl costs exceed budget (OpenAI tokens) | Medium | Low | Daily token cap (300K); conservative crawl frequency (6-12h); gpt-4o-mini is cheap |
| Vercel cron 300s timeout on full crawl | Medium | Medium | Split crawl across multiple cron jobs (Tier 1 separate from Tier 2-4); use Pro plan if needed |
| Chart library bundle size bloats page | Low | Low | Use recharts (tree-shakeable); lazy load intelligence page charts |
| Stale data displayed as current | Medium | Medium | "Last updated" timestamp always visible; stale flagging at 30 days; "Temporarily unavailable" for failed fetches |

### 4.6 Key Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Provider-agnostic API facade | Swap Argus ↔ Platts ↔ any future source without frontend changes |
| In-memory cache before API response | Avoids DB round-trip for every client poll (every 5 min) |
| DB persist on every fetch anyway | Builds historical dataset for future analytics + AI |
| Crawl every 6-12h, not real-time | Gov sites are slow; project data changes weekly/monthly |
| AI extraction via LLM, not deterministic scraping | Pages are unstructured, mixed-language (FR/AR/EN), diverse formats |
| Review queue, not auto-publish | Credibility demands human oversight — CMS is for review, not data entry |
| Intelligence pages as Phase 2 shell | Price + chart + sources now; AI analysis + news = Phase 3 when RAG mature |
| Public messaging: "Temporarily unavailable" | Never expose internal licensing/infrastructure details |
| 19 sources locked for v1 | Scope control; new sources = future phase |

---

## Appendices

### A. New Database Migrations

**Migration 1: `energy_prices` table**
```sql
-- supabase/migrations/xxxxx_create_energy_prices.sql
CREATE TABLE energy_prices (
  id            BIGSERIAL PRIMARY KEY,
  benchmark     VARCHAR(64)   NOT NULL,
  category      VARCHAR(32)   NOT NULL,
  value         DECIMAL(12,4) NOT NULL,
  unit          VARCHAR(16)   NOT NULL,
  change        DECIMAL(8,4),
  change_pct    DECIMAL(6,2),
  trend         VARCHAR(4),
  provider      VARCHAR(32)   NOT NULL,
  provider_tier SMALLINT      NOT NULL,
  delay_status  VARCHAR(20)   NOT NULL,
  confidence    VARCHAR(8)    NOT NULL,
  availability  VARCHAR(24)   NOT NULL DEFAULT 'available',
  source_url    TEXT,
  fetched_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  is_active_primary BOOLEAN   DEFAULT FALSE
);

CREATE INDEX idx_ep_benchmark_time ON energy_prices (benchmark, fetched_at DESC);
CREATE INDEX idx_ep_category_time ON energy_prices (category, fetched_at DESC);
CREATE INDEX idx_ep_fetched_at ON energy_prices (fetched_at DESC);

CREATE MATERIALIZED VIEW energy_prices_latest AS
SELECT DISTINCT ON (benchmark)
  benchmark, value, unit, change, change_pct, trend,
  provider, provider_tier, delay_status, confidence, fetched_at
FROM energy_prices
WHERE fetched_at > NOW() - INTERVAL '2 hours'
ORDER BY benchmark, fetched_at DESC;
```

**Migration 2: `energy_projects` table**
```sql
-- supabase/migrations/xxxxx_create_energy_projects.sql
CREATE TABLE energy_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  energy_sector TEXT NOT NULL CHECK (energy_sector IN ('oil','gas','lng','renewable','hydrogen','power','petrochemical','other')),
  project_type TEXT CHECK (project_type IN ('pipeline','field','plant','terminal','grid','solar','wind','exploration','other')),
  wilaya TEXT,
  municipality TEXT,
  gps_lat DECIMAL(10,7),
  gps_lng DECIMAL(10,7),
  operating_company TEXT,
  project_partners TEXT[] DEFAULT '{}',
  investment_value TEXT,
  production_capacity TEXT,
  project_status TEXT NOT NULL CHECK (project_status IN ('operational','under_construction','planned','proposed','completed','suspended')),
  completion_percentage DECIMAL(5,2),
  start_date DATE,
  expected_completion_date DATE,
  project_description TEXT,
  source_url TEXT,
  source_name TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  last_source_check TIMESTAMPTZ DEFAULT NOW(),
  source_urls TEXT[] DEFAULT '{}',
  review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected','changes_pending')),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  sync_history JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_energy_projects_sector ON energy_projects(energy_sector);
CREATE INDEX idx_energy_projects_status ON energy_projects(project_status);
CREATE INDEX idx_energy_projects_wilaya ON energy_projects(wilaya);
CREATE INDEX idx_energy_projects_review ON energy_projects(review_status);
CREATE INDEX idx_energy_projects_source ON energy_projects(source_name);
```

### B. New Environment Variables

```env
# F01 — Live Prices
# EIA_API_KEY=***          (future: EIA API v2)

# F05 — Project Extraction
EXTRACTION_DAILY_MAX_TOKENS=300000
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
```

### C. New Packages

```json
{
  "swr": "^2.2.0",
  "cheerio": "^1.0.0",
  "recharts": "^2.12.0",
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.2.0",
  "@types/leaflet": "^1.9.0",
  "@mozilla/readability": "^0.5.0",
  "gpt-tokenizer": "^2.1.0"
}
```

### D. PRD References

- [PRD-01: Live Energy Price — Full Specification](./prd/01_LIVE_ENERGY_PRICE.md)
- [PRD-05: Algeria Energy Projects Database — Full Specification](./prd/05_ENERGY_PROJECTS_ALGERIA.md)
- [PRD Index — All Phase 2 Features](./prd/00_INDEX.md)

---

**Document prepared by:** OpenClaw AI Assistant
**Next step:** Review with developer (Junaedi) + client (Mr. Ramdane) before starting development.
