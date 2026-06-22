# PRD-01: Energy Intelligence Platform — Live Price & Market Intelligence

**Feature ID:** F01
**Version:** 2.3
**Date:** 2026-06-18
**Status:** Final — Trusted Reference Pages. Every intelligence page combines live data + AI analysis + original sources for researchers, policymakers, and investors.
**Estimated Effort:** ~15-17 days (increased — source transparency + official references integration)
**Depends On:** Argus/Platts subscription (not yet acquired — see §1.11)
**Priority:** P0 — Client priority #1
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---

## 1. Energy Intelligence Platform — Price & Market Intelligence

### 1.1 Vision

RamBelEnergy is not building a price ticker. It is building an **Energy Intelligence Platform**.

Every benchmark price is **not an endpoint — it is an entry point.** A displayed price should invite the user to dive deeper: AI-generated market analysis, historical trends, related news, production data, country-specific insights. The price is the door; the intelligence is the room behind it.

**Every intelligence page must be a trusted reference page** — not merely AI-generated. It should serve researchers, policymakers, companies, and investors who need **transparent and verifiable information.** Every insight must be traceable to its original source. Every AI analysis must cite what it used. Every page should link to official reports and publications.

This makes RamBelEnergy fundamentally different from every energy news website that shows prices as dead numbers — and equally different from AI-only platforms that generate analysis without source accountability. Here, every number is alive, every insight is sourced, every page is citable.

### 1.2 Problem Statement

Most energy news websites display only Brent and WTI prices as static numbers. RamBelEnergy must be more professional — serving energy professionals, analysts, and policymakers who need the full benchmark suite. Currently, users get energy prices only as text inside ask-energy responses with no dedicated, real-time price dashboard. The platform needs a differentiated price display that prioritizes Algerian-relevant benchmarks (Saharan Blend) while covering the complete global energy pricing landscape.

Beyond the price, users need context: Why did this price move? What does it mean for Algeria? What's the historical pattern? What news is driving it? Each benchmark should connect to a full intelligence experience.

### 1.3 Current Build State (as of 2026-06-18)

| Component | Status |
|-----------|--------|
| `fetch-live-prices.ts` — scraper (EIA, OilPrice, Trading Economics) | ✅ Built (legacy — will be restructured) |
| Multi-source comparison in ask-energy responses | ✅ Built |
| `GET /api/energy-prices` standalone endpoint | ❌ Not yet |
| Dedicated `/energy-prices` page | ❌ Not yet |
| `/intelligence/[benchmark]` pages | ❌ Not yet |
| `PriceCard` + `PriceGrid` + `PriceTicker` components | ❌ Not yet |
| Homepage `PriceTicker` widget | ❌ Not yet |
| SWR auto-refresh polling (5 min) | ❌ Not yet |
| Server-side in-memory cache (5 min TTL) | ❌ Not yet |
| Argus/Platts API integration | ❌ Not yet (requires subscription — not yet acquired) |
| OPEC API/data integration | ❌ Not yet |
| Historical price database (`energy_prices` table) | ❌ Not yet |
| Future benchmark extensibility layer | ❌ Not yet (LNG, electricity, carbon, hydrogen — designed, not built) |

### 1.4 Goals

- Provide a **professional, differentiated energy intelligence platform** that goes beyond Brent/WTI — the benchmark suite that most energy news websites don't offer
- **Primary benchmark: Saharan Blend** — the actual benchmark price for Algerian crude oil, sourced from Argus or S&P Global Platts
- **Full benchmark suite ordered by priority:**
  1. **Saharan Blend** (Argus/Platts) — Algerian crude benchmark ★
  2. **Brent** — global crude benchmark
  3. **WTI** — US crude benchmark
  4. **OPEC Basket** — OPEC reference price (validation/cross-check source)
  5. **Murban** — UAE/MENA benchmark
  6. **Natural Gas: TTF + Henry Hub** — European and US gas benchmarks
- **Source priority architecture:**
  - **Primary:** Argus Media or S&P Global Commodity Insights (Platts) — enterprise API
  - **Validation/Cross-check:** OPEC Basket price
  - **Fallback only:** OilPrice.com (secondary reference, not primary)
- **Display fallback logic:**
  - Saharan Blend available → Saharan Blend is primary display benchmark ★
  - Saharan Blend unavailable → **Brent becomes the primary displayed benchmark** (NOT OPEC Basket)
  - OPEC Basket always remains a validation/reference benchmark — never promoted to primary display
- **Historical price database:** Every price fetch is persisted from day one — enables analytics, forecasting, and AI features
- **Future-proof extensibility:** Architecture supports adding LNG, electricity prices, carbon prices, hydrogen indexes, and other energy indicators without restructuring
- **Intelligence-linked benchmarks:** Every price is clickable — leads to a dedicated intelligence page with AI analysis, historical trends, related news, production data, and country-specific context
- **Trusted reference pages:** Every intelligence page includes original sources, references used by the AI, and links to official reports — serving researchers, policymakers, and investors who need transparent, verifiable, and citable information
- **Every price carries 4 metadata fields:** last update time (UTC), data provider, delay status (real-time/delayed), source confidence level
- **Professional public messaging:** "Temporarily unavailable" — never expose internal licensing or infrastructure details
- Dedicated `/energy-prices` page with real-time, clickable price cards
- Dedicated `/intelligence/[benchmark]` pages for each benchmark
- Homepage horizontal ticker widget with clickable benchmarks
- Auto-refresh every 5 minutes via SWR polling
- Price change (% and absolute), trend direction

### 1.5 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| LP-01 | Algerian energy analyst | See the Saharan Blend price as the primary benchmark | I get the actual price relevant to Algerian crude, not just generic Brent/WTI |
| LP-02 | Energy trader/analyst | See a full professional benchmark suite (Saharan Blend → Brent → WTI → OPEC Basket → Murban → TTF/Henry Hub) | I can compare Algerian crude against global benchmarks in one view |
| LP-03 | Policy advisor | Track natural gas spot prices (TTF for Europe, Henry Hub for US) | I understand gas market conditions affecting Algeria-Europe flows |
| LP-04 | General visitor | See energy prices on the homepage ticker | I immediately recognize this as a professional energy platform |
| LP-05 | Researcher | Know the exact source of each price (Argus, Platts, OPEC) and when it was last updated | I can assess data credibility and freshness |
| LP-06 | Mobile user | View the full price ticker on my phone | I can check prices on the go |
| LP-07 | Data analyst / researcher | Access historical price data via the platform | I can analyze trends, build forecasts, and back-test assumptions |
| LP-08 | Platform admin | Add new energy benchmarks (LNG, carbon, electricity) in the future | The platform evolves with market needs without restructuring |
| LP-09 | Energy analyst | Click a price and access AI analysis, historical trends, news, and production data for that benchmark | I understand not just the number, but the full story behind it |
| LP-10 | Researcher | Navigate from Saharan Blend price → Algeria production context → related Sonatrach news | I get country-specific intelligence connected to the benchmark |
| LP-11 | Policymaker / investor | See original sources, official reports, and references behind every AI-generated insight | I can verify the information and cite it in my own work |
| LP-12 | Academic researcher | Access links to official publications (OPEC MOMR, IEA reports, government data) from the intelligence page | I can trace every claim back to primary sources |

### 1.6 Technical Design

#### Pricing Architecture — Tiered Source Priority

RamBelEnergy's platform uses a **tiered architecture** where premium subscription APIs are the authoritative source, OPEC is the cross-check, and free sources are fallbacks only.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ENERGY INTELLIGENCE DATA FLOW                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐                                                    │
│  │  PRIMARY SOURCE   │  Argus Media / S&P Global Platts                  │
│  │  (Subscription)   │  → Saharan Blend ★, Brent, WTI, Murban, TTF       │
│  └────────┬─────────┘                                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌──────────────────┐                                                    │
│  │  VALIDATION       │  OPEC Basket Price (daily, opec.org)              │
│  │  (Cross-check)    │  → Reference benchmark — NEVER primary display    │
│  └────────┬─────────┘                                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌──────────────────┐                                                    │
│  │  FALLBACK ONLY    │  OilPrice.com                                     │
│  │  (Secondary)      │  → Used only when primary + validation fail       │
│  └────────┬─────────┘                                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌──────────────────┐                                                    │
│  │  SUPPLEMENTAL     │  EIA (Henry Hub), ICE Endex (TTF delayed)         │
│  │  (Free APIs)      │  → Gas benchmarks, backup for crude               │
│  └────────┬─────────┘                                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌──────────────────┐                                                    │
│  │  HISTORICAL DB    │  energy_prices table (Supabase)                    │
│  │  (Every fetch)    │  → Powers trends, AI, analytics, intelligence      │
│  └────────┬─────────┘                                                    │
│           │                                                              │
│           ▼                                                              │
│  ┌──────────────────┐                                                    │
│  │  INTELLIGENCE     │  /intelligence/[benchmark]                         │
│  │  (Per benchmark)  │  → Price + trends + AI analysis + news + context   │
│  └──────────────────┘                                                    │
│                                                                          │
│  ═══════════════════════════════════════════════════════════════════════ │
│  FALLBACK DISPLAY LOGIC:                                                  │
│  Saharan Blend available → ★ Saharan Blend is primary display             │
│  Saharan Blend down    → Brent becomes primary display (NOT OPEC Basket)  │
│  OPEC Basket           → Always validation/reference — never promoted     │
│  ⚠️ OilPrice.com is NEVER the primary source for pricing.                 │
│  ═══════════════════════════════════════════════════════════════════════ │
└─────────────────────────────────────────────────────────────────────────┘
```

| Tier | Source | Access | Commodities Covered | Role |
|------|--------|--------|---------------------|------|
| **P1 — Primary** | **Argus Media** or **S&P Global Platts** | Enterprise subscription (API) | Saharan Blend, Brent, WTI, Murban, TTF | Authoritative pricing |
| **P2 — Validation** | **OPEC** (`opec.org`) | Free/public | OPEC Basket, Saharan Blend (occasional) | Cross-check & validation |
| **P3 — Fallback** | **OilPrice.com** | Free/scrape | Brent, WTI | Secondary reference only — used when primary is unavailable |
| **P4 — Supplemental** | **EIA** (`eia.gov`) | Free API | Henry Hub, WTI | US natural gas benchmark |
| **P4 — Supplemental** | **ICE Endex** | Free/delayed | TTF | European gas benchmark (when not from Platts) |

**Architecture rules:**
1. **Argus/Platts is authoritative.** When available, its prices are the displayed primary value.
2. **Display fallback: Saharan Blend → Brent.** If Saharan Blend is unavailable, **Brent becomes the primary displayed benchmark** — NOT the OPEC Basket. OPEC Basket is always a validation/reference only.
3. **OPEC Basket is validation, not primary.** It serves as a cross-check and is labeled accordingly ("Reference · OPEC"). It is never promoted to the primary display position.
4. **OilPrice.com is NEVER the primary source.** It is a fallback — clearly labeled as such when displayed.
5. **Source attribution is always visible.** Every displayed price shows: provider name, last update time (UTC), delay status, and confidence level.
6. **Graceful degradation:**
   - P1 (Platts/Argus) down → P2 (OPEC) supplies validation benchmarks; Brent from best available source becomes primary display
   - P2 also down → P3 (OilPrice.com) as last resort, clearly flagged
   - All tiers down → cached data with red warning banner + timestamp of last successful fetch

#### Intelligence-Linked Benchmarks (New — v2.2)

Every benchmark price is **clickable** — it leads to `/intelligence/[benchmark]` where users access a complete intelligence experience.

**Every intelligence page must be a trusted reference page** — serving casual users and professionals equally. The page combines seven elements:

1. **Live price** — real-time or delayed with full metadata (provider, delay status, confidence, last updated UTC)
2. **Historical trends** — interactive charts powered by the `energy_prices` database (7d / 30d / 90d / 1y)
3. **AI market analysis** — generated analysis with explicit source attribution for every claim
4. **Related news** — auto-surfaced from RAG search, with publication dates and source names
5. **Country & project context** — production data, export destinations, key infrastructure, linked projects from F05
6. **Sources & references** — every AI insight lists the original sources it used; every statistic is traceable
7. **Official reports & publications** — links to OPEC MOMR, IEA reports, government data, EIA STEO, academic papers

**Per-benchmark intelligence page structure:**

```
┌──────────────────────────────────────────────────────────────────────┐
│  /intelligence/saharan-blend                                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  ★ Saharan Blend  $94.20 ▼0.9%  ·Platts ●RT ●●●high        │     │
│  │  Algerian crude benchmark — last updated 10:30 UTC           │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌─────────────────────┐  ┌─────────────────────┐                    │
│  │  HISTORICAL TREND    │  │  AI MARKET ANALYSIS  │                    │
│  │  (7d / 30d / 90d / 1y)│  │  "Saharan Blend has  │                    │
│  │  [sparkline chart]   │  │  declined 0.9% today  │                    │
│  │                      │  │  driven by..."        │                    │
│  └─────────────────────┘  └─────────────────────┘                    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  RELATED NEWS & ANALYSIS                                      │     │
│  │  • Sonatrach announces new production targets...              │     │
│  │  • OPEC+ maintains output cuts through Q3...                  │     │
│  │  • Algerian crude exports to Europe rise 2.3%...              │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  PRODUCTION & COUNTRY CONTEXT                                  │     │
│  │  Algeria crude production: ~960,000 bpd (OPEC MOMR)           │     │
│  │  Main export destinations: Italy, France, Spain, Netherlands  │     │
│  │  Key infrastructure: MEDGAZ, TransMed pipelines               │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  RELATED BENCHMARKS                                            │     │
│  │  Brent $93.68 ▼1.2%  │  OPEC Basket $92.10 ▼0.8%  │  Murban │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │  SOURCES & REFERENCES — transparent & verifiable              │     │
│  │                                                               │     │
│  │  AI analysis used:                                            │     │
│  │  • OPEC Monthly Oil Market Report (June 2026)                 │     │
│  │  • Platts Crude Oil Marketwire (June 18, 2026)                │     │
│  │  • Sonatrach press release (June 15, 2026)                    │     │
│  │                                                               │     │
│  │  Official reports & publications:                             │     │
│  │  • IEA Oil Market Report — June 2026                          │     │
│  │  • EIA Short-Term Energy Outlook — June 2026                  │     │
│  │  • Algeria Ministry of Energy — Production Statistics 2025    │     │
│  │  • Platts Crude Oil Marketwire — daily                        │     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

**Phase 2 deliverables (now):**
- Clickable price cards + ticker items that navigate to `/intelligence/[benchmark]`
- Intelligence page shell with: price header, historical chart placeholder, related benchmarks, **sources & references section**
- Sources & references list sourced from the Ask-Energy pipeline (source URLs from search results)

**Phase 3 (future — when RAG + AI + Projects DB are mature):**
- AI-generated market analysis per benchmark with explicit source attribution for every claim
- Historical trend charts (from `energy_prices` table)
- Auto-surfaced related news (from RAG search)
- Production/country context (from Algeria Energy Projects DB — F05)
- Official reports & publications links (from trusted-source crawl)

**Click-through behavior:**
- Homepage ticker: click any benchmark → `/intelligence/[benchmark]`
- `/energy-prices` page: click any PriceCard → `/intelligence/[benchmark]`
- Ask-Energy responses: benchmark names become links to intelligence pages

#### Public-Facing Messaging (New — v2.2)

**Unavailable benchmarks:** Display "Temporarily unavailable" — never expose internal licensing status or infrastructure details.

| Internal Status | User-Facing Display |
|-----------------|---------------------|
| Premium API not subscribed | "Temporarily unavailable" |
| API timeout / fetch failed | "Updating — check back shortly" |
| All sources down | "Prices temporarily unavailable — last updated [timestamp]" |
| Benchmark not yet configured | "Coming soon" |

This keeps the platform professional and doesn't reveal internal infrastructure to end users.

#### Prices API Endpoint (Provider-Agnostic)

The API is designed as a **provider-agnostic facade** so the underlying source can be swapped without changing the frontend:

```typescript
// lib/prices/providers/types.ts
interface PriceProvider {
  name: string;           // "Platts", "Argus", "OPEC", "OilPrice"
  tier: 1 | 2 | 3 | 4;   // Priority tier
  fetchPrices(): Promise<BenchmarkPrice[]>;
  isAvailable(): Promise<boolean>;
}

interface BenchmarkPrice {
  benchmark: string;         // "Saharan Blend", "Brent", "WTI", "OPEC Basket", "Murban", "TTF", "Henry Hub"
  category: string;          // "crude" | "natural_gas" | "lng" | "electricity" | "carbon" | "hydrogen" — extensible
  value: number;
  unit: string;              // "USD/bbl" | "EUR/MWh" | "USD/MMBtu" | "EUR/tonne CO2"
  change: number | null;
  changePercent: number | null;
  trend: "up" | "down" | "flat";
  // ─── 4 required metadata fields ───
  lastUpdatedUTC: string;    // ISO 8601, always UTC
  provider: string;          // "Platts", "Argus", "OPEC", "EIA", "OilPrice"
  delayStatus: "real-time" | "delayed-15min" | "delayed-30min" | "delayed-1day" | "delayed";
  confidenceLevel: "high" | "medium" | "low";  // high=premium API, medium=official free, low=scraped/fallback
  // ─── intelligence linking ───
  intelligenceUrl: string;   // "/intelligence/saharan-blend"
  // ─── optional ───
  sourceUrl?: string;
}
```

**Provider resolution logic (with display fallback: Saharan Blend → Brent):**
```typescript
function resolvePrimaryBenchmark(providers: PriceProvider[]): {
  primary: BenchmarkPrice;
  isSaharanBlendAvailable: boolean;
} {
  // Try to get Saharan Blend from P1
  const saharan = resolvePrice("Saharan Blend", providers);
  if (saharan) {
    return { primary: saharan, isSaharanBlendAvailable: true };
  }
  // Saharan Blend unavailable → Brent becomes primary display
  const brent = resolvePrice("Brent", providers);
  if (brent) {
    return { primary: brent, isSaharanBlendAvailable: false };
  }
  // Last resort: WTI
  const wti = resolvePrice("WTI", providers);
  return { primary: wti, isSaharanBlendAvailable: false };
}
```

#### API Endpoint

**`GET /api/energy-prices`**

```typescript
// Response — benchmarks ordered by priority:
// Saharan Blend → Brent → WTI → OPEC Basket → Murban → TTF → Henry Hub
{
  "prices": [
    {
      "benchmark": "Saharan Blend",
      "category": "crude",
      "label": "Saharan Blend",
      "unit": "USD/bbl",
      "value": 94.20,
      "provider": "Platts",
      "providerTier": 1,
      "lastUpdatedUTC": "2026-06-18T10:30:00Z",
      "delayStatus": "real-time",
      "confidenceLevel": "high",
      "change": -0.85,
      "changePercent": -0.89,
      "trend": "down",
      "isPrimaryBenchmark": true,
      "isActivePrimary": true,
      "intelligenceUrl": "/intelligence/saharan-blend",
      "availability": "available"     // "available" | "temporarily_unavailable" | "coming_soon"
    },
    // ... (all 7 benchmarks with same structure)
  ],
  "lastUpdated": "2026-06-18T10:30:00Z",
  "sourceStatus": {
    "Platts": "ok",
    "Argus": "unavailable",
    "OPEC": "ok",
    "EIA": "ok",
    "OilPrice": "ok"
  },
  "activePrimaryBenchmark": "Saharan Blend",
  "highestAvailableTier": 1,
  "warning": null
}
```

**Fallback response (Saharan Blend unavailable — Brent promoted to primary):**
```json
{
  "activePrimaryBenchmark": "Brent",
  "highestAvailableTier": 2,
  "warning": "Saharan Blend temporarily unavailable — Brent shown as primary benchmark. OPEC Basket shown for validation.",
  "missingBenchmarks": ["Saharan Blend", "Murban"]
}
```

#### Historical Price Database

Every price fetch is persisted to Supabase from day one, building a historical dataset for future analytics, AI forecasting, and research.

**Database schema:**

```sql
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

**Retention policy:**

| Resolution | Retention | Purpose |
|------------|-----------|---------|
| Per-fetch (every 5 min) | 90 days | Recent trend analysis |
| Hourly aggregate | 2 years | Medium-term analytics |
| Daily aggregate | Indefinite | Long-term research & AI training |

**Integration points:**
- API endpoint writes to `energy_prices` on every successful fetch
- Intelligence pages query historical data for trend charts
- Future analytics dashboard queries historical data directly
- AI forecasting module trains on historical price series
- Ask-Energy can reference price history when users ask about trends

#### Future Benchmark Extensibility

The architecture is designed so **new benchmarks can be added without restructuring the system.**

```typescript
// lib/prices/benchmark-registry.ts
const BENCHMARK_REGISTRY: BenchmarkDefinition[] = [
  // Phase 2 (current)
  { key: "saharan_blend",     category: "crude",       priority: 1,  unit: "USD/bbl" },
  { key: "brent",              category: "crude",       priority: 2,  unit: "USD/bbl" },
  { key: "wti",                category: "crude",       priority: 3,  unit: "USD/bbl" },
  { key: "opec_basket",        category: "crude",       priority: 4,  unit: "USD/bbl", role: "validation" },
  { key: "murban",             category: "crude",       priority: 5,  unit: "USD/bbl" },
  { key: "ttf",                category: "natural_gas", priority: 6,  unit: "EUR/MWh" },
  { key: "henry_hub",          category: "natural_gas", priority: 7,  unit: "USD/MMBtu" },
  
  // Future — add here, flows to API + DB + UI + intelligence pages automatically:
  // { key: "lng_jkm",         category: "lng",         priority: 8,  unit: "USD/MMBtu" },
  // { key: "eu_ets_carbon",    category: "carbon",      priority: 9,  unit: "EUR/tonne CO2" },
  // { key: "eu_hydrogen",      category: "hydrogen",    priority: 10, unit: "EUR/kg" },
  // { key: "eu_electricity",   category: "electricity", priority: 11, unit: "EUR/MWh" },
];

type BenchmarkCategory = "crude" | "natural_gas" | "lng" | "electricity" | "carbon" | "hydrogen";
```

**How extensibility works:**
1. Add entry to `BENCHMARK_REGISTRY` → auto-appears in API + DB + UI + intelligence pages
2. If provider supports it → prices flow automatically
3. If new provider needed → implement `PriceProvider` interface, no other code changes
4. New categories auto-render with correct unit formatting
5. Intelligence pages auto-generated for new benchmarks

**Reserved future benchmarks:**

| Category | Benchmarks | Likely Source |
|----------|-----------|---------------|
| **LNG** | JKM (Japan/Korea Marker), NEA (Northeast Asia), NBP (UK) | Platts, ICE, EIA |
| **Carbon** | EU ETS, UK ETS | ICE, EEX, World Bank |
| **Electricity** | European Baseload, German Day-Ahead | EEX, Platts |
| **Hydrogen** | European Hydrogen Index, Hydex | EEX, S&P Global |

#### Caching Strategy

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────────┐
│  Client      │────▶│  /api/energy-│────▶│  In-memory cache    │
│  (5min poll) │     │  prices      │     │  (TTL: 5 min)       │
│              │◀────│              │◀────│  Per-tier expiry    │
└─────────────┘     └──────────────┘     └──────┬──────────────┘
                                                 │ cache miss
                                          ┌──────▼──────────────┐
                                          │  Tiered Resolution   │
                                          │  P1(Argus/Platts) →  │
                                          │  P2(OPEC)        →   │
                                          │  P3(OilPrice.com)    │
                                          │  All run in parallel  │
                                          │  ↓ Write to DB        │
                                          └──────────────────────┘
```

- Server-side in-memory cache with 5-minute TTL
- **Per-tier caching:** Premium API results cached separately from fallback data
- Client polls every 5 minutes (SWR with `refreshInterval`)
- Fallback: show last cached premium prices with "Updated X min ago" indicator
- **Error state by tier:**
  - Tier 1 down → Show warning banner + fail over to Tier 2/3 automatically
  - All tiers down → Show stale premium prices (if cached) with timestamp + red warning
  - No cache available → "Prices temporarily unavailable" with retry button

#### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `PriceCard` | `src/components/prices/PriceCard.tsx` | **Clickable** benchmark card: label ★, value, unit, change, trend arrow, provider badge, delay status, confidence indicator, last updated (UTC). Click navigates to `/intelligence/[benchmark]`. Saharan Blend highlighted as primary. |
| `PriceGrid` | `src/components/prices/PriceGrid.tsx` | Grid layout for clickable price cards, ordered by benchmark priority |
| `PriceTicker` | `src/components/prices/PriceTicker.tsx` | Compact horizontal scrolling ticker for homepage — all 7 benchmarks, each clickable → intelligence page. Provider tags + delay indicators. |
| `SourceBadge` | `src/components/prices/SourceBadge.tsx` | Source attribution badge with tier color: Platts/Argus=green(P1), OPEC=blue(P2 validation), OilPrice=amber(P3 fallback), EIA=gray(P4 supp) |
| `DelayIndicator` | `src/components/prices/DelayIndicator.tsx` | Delay status dot: ● green="real-time", ◐ yellow="delayed-15/30min", ○ gray="delayed-1day" |
| `ConfidenceBadge` | `src/components/prices/ConfidenceBadge.tsx` | Confidence level: ●●● high, ●●○ medium, ●○○ low |
| `EnergyPricesPage` | `src/app/(site)/energy-prices/page.tsx` | Full prices page with clickable benchmark cards, source health panel, and metadata legend |
| `IntelligencePage` | `src/app/(site)/intelligence/[benchmark]/page.tsx` | **Trusted reference page** with 7 elements: price header, historical chart, AI analysis, related news, country/project context, sources & references, official reports links |
| `IntelligencePriceHeader` | `src/components/prices/IntelligencePriceHeader.tsx` | Full-size price display with all 4 metadata fields for intelligence page hero |
| `SourcesReferences` | `src/components/prices/SourcesReferences.tsx` | Lists sources used by AI analysis + links to official reports and publications — makes every insight traceable |
| `TierStatusBanner` | `src/components/prices/TierStatusBanner.tsx` | Warning banner when on fallback tier — uses public-facing messaging ("Temporarily unavailable") |

#### Frontend States

| State | Visual |
|-------|--------|
| Loading | Skeleton cards with pulsing gray blocks |
| Success (P1 available) | Live price cards with provider badge (green P1), real-time indicator, high confidence. Saharan Blend ★ highlighted. All cards clickable → intelligence pages. |
| Saharan Blend unavailable | Warning: "Saharan Blend temporarily unavailable — Brent shown as primary." Brent card gets ★ marker. OPEC Basket stays as validation (blue P2 badge). Saharan Blend card shows "Temporarily unavailable" with link to Brent intelligence page. |
| Partial (P1 down, P2 active) | Amber warning banner. Brent from P2 shown with "delayed" indicator + medium confidence. |
| Full fallback (P3 only) | Warning: "Prices temporarily unavailable — showing last known values." All cards show amber P3 badges + low confidence. |
| Error (all sources failed) | Stale data from cache + red warning banner with timestamp of last successful fetch + "Temporarily unavailable" on each card |
| Empty | "No price data available" with retry button |
| Premium benchmark not configured | "Temporarily unavailable" — never reveals licensing or infrastructure details |

#### Homepage Widget

Compact horizontal ticker strip between hero and first content section. Saharan Blend leads with full metadata. Every benchmark is clickable:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Live Markets ● ★ Saharan Blend $94.20 ▼0.9% ·Platts ●RT │ Brent $93.68 ▼1.2% ·Platts ●RT │ WTI $89.45 ▼1.1% ·Platts ●RT │ OPEC Basket $92.10 ▼0.8% ·OPEC ◐D1 │ Murban $92.85 ▼1.0% ·Platts ●RT │ TTF €32.40 ▲1.1% ·Platts ●RT │ Henry Hub $3.27 ▼1.5% ·EIA ◐D1 │ View All → │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

- Saharan Blend always first (leftmost) with ★ marker and distinct styling
- **Every benchmark clickable** → `/intelligence/[benchmark]`
- Provider tag (·Platts, ·OPEC, ·EIA) after each price
- Delay indicator: ●RT = real-time, ◐D1 = delayed 1 day
- Trend arrows: ▲ green up, ▼ red down, ◆ gray flat
- Auto-scrolls on mobile

### 1.7 Ask-Energy Price Comparison

When a user asks about energy prices via ask-energy, the response includes the full benchmark suite with source tier indicators. Benchmark names are linked to intelligence pages:

```
┌────────────────────────────────────────────────────────────────┐
│  📊 Current Energy Prices                                       │
│                                                                 │
│  Crude Oil Benchmarks:                                          │
│  ┌────────────────┬────────┬────────┬──────────────────────┐  │
│  │  Benchmark      │ Price  │ Change │ Source               │  │
│  ├────────────────┼────────┼────────┼──────────────────────┤  │
│  │★ Saharan Blend  │ $94.20 │ ▼0.9%  │ Platts (P1)          │  │
│  │  Brent          │ $93.68 │ ▼1.2%  │ Platts (P1)          │  │
│  │  WTI            │ $89.45 │ ▼1.1%  │ Platts (P1)          │  │
│  │  OPEC Basket    │ $92.10 │ ▼0.8%  │ OPEC (P2 · validate)  │  │
│  │  Murban         │ $92.85 │ ▼1.0%  │ Platts (P1)          │  │
│  └────────────────┴────────┴────────┴──────────────────────┘  │
│                                                                 │
│  Natural Gas:                                                   │
│  ┌────────────────┬────────┬────────┬──────────────────────┐  │
│  │  TTF            │ €32.40 │ ▲1.1%  │ Platts (P1)          │  │
│  │  Henry Hub      │ $3.27  │ ▼1.5%  │ EIA (P4 · supp)      │  │
│  └────────────────┴────────┴────────┴──────────────────────┘  │
│                                                                 │
│  ★ Primary benchmark for Algerian crude                          │
│  Click any benchmark for full market intelligence →              │
│  Sources: platts.com · opec.org                                 │
└────────────────────────────────────────────────────────────────┘
```

### 1.8 Acceptance Criteria

- [ ] `/energy-prices` page renders 7 benchmark price cards in priority order: Saharan Blend → Brent → WTI → OPEC Basket → Murban → TTF → Henry Hub
- [ ] Saharan Blend visually highlighted as primary Algerian benchmark ★
- [ ] **Every price card is clickable** — navigates to `/intelligence/[benchmark]`
- [ ] `/intelligence/[benchmark]` page exists for all 7 benchmarks with **7 elements:** price header, historical chart placeholder, AI analysis placeholder, related news placeholder, country/project context, **sources & references used by AI**, **links to official reports**
- [ ] **Fallback logic: Saharan Blend unavailable → Brent becomes primary display** (NOT OPEC Basket)
- [ ] OPEC Basket always shown as validation/reference with blue badge — never promoted to primary
- [ ] OilPrice.com used only as fallback — amber badge with "Fallback" label when active
- [ ] **Every price card shows 4 metadata fields:** provider, last updated (UTC), delay status, confidence level
- [ ] Delay status indicators: ● real-time, ◐ delayed-15/30min, ○ delayed-1day
- [ ] Confidence indicators: ●●● high, ●●○ medium, ●○○ low
- [ ] **Public-facing messaging:** "Temporarily unavailable" (never "Premium data required" or "Subscription needed")
- [ ] Prices auto-refresh every 5 minutes without full page reload
- [ ] Homepage ticker: all 7 benchmarks clickable → intelligence pages, with provider tags + delay indicators
- [ ] **Historical database:** every price fetch persisted to `energy_prices` table
- [ ] Tiered fallback with correct display logic and professional warning messages
- [ ] Loading (skeleton), partial-failure, full-fallback, and error states handled per tier
- [ ] Mobile: price cards stack vertically, ticker scrolls horizontally, intelligence pages responsive
- [ ] Cache: P1 max 1 req/5min, P2 max 1 req/15min, P3 only on-demand
- [ ] **Provider-agnostic:** switching Platts↔Argus = config change only
- [ ] **Extensible:** adding a new benchmark = 1 line in `BENCHMARK_REGISTRY` → auto-generates price card + intelligence page

### 1.9 Scope & Estimates (Revised — v2.2)

| Task | Estimate | Status |
|------|----------|--------|
| Design provider-agnostic `PriceProvider` interface + `BenchmarkRegistry` extensibility layer | 0.5 day | ❌ |
| Create `energy_prices` table + materialized view + indexes (Supabase migration) | 0.5 day | ❌ |
| Build `PlattsProvider` / `ArgusProvider` (requires subscription credentials) | 1.5 days | ❌ |
| Build `OPECProvider` (scrape opec.org daily basket) | 1 day | ❌ |
| Build `OilPriceProvider` as tier-3 fallback (adapt existing scraper) | 0.5 day | ❌ |
| Build `EIAProvider` for Henry Hub (free API) | 0.5 day | ❌ |
| Tiered resolution + display fallback logic (Saharan Blend→Brent→WTI) + public messaging | 1 day | ❌ |
| Historical DB writer (persist every fetch to `energy_prices`) | 0.5 day | ❌ |
| In-memory cache with per-tier TTL | 0.5 day | ❌ |
| Build `GET /api/energy-prices` endpoint (with 4 metadata + intelligenceUrl fields) | 0.5 day | ❌ |
| `PriceCard` + `PriceGrid` + `SourceBadge` + `DelayIndicator` + `ConfidenceBadge` + `TierStatusBanner` (all cards clickable) | 2 days | ❌ |
| `/energy-prices` dedicated page | 0.5 day | ❌ |
| Homepage `PriceTicker` widget (7 benchmarks, clickable, metadata inline) | 0.5 day | ❌ |
| `/intelligence/[benchmark]` page shell (price header + chart placeholder + related benchmarks + sources & references section) | 2 days | ❌ |
| `IntelligencePriceHeader` + `SourcesReferences` components | 0.5 day | ❌ |
| SWR polling + all UI states (loading/partial/fallback/error) + public messaging | 0.5 day | ❌ |
| Responsive polish | 0.5 day | ❌ |
| **Total remaining** | **~15-17 days** | |

### 1.10 Path Without Argus/Platts Subscription

**Current status:** No Argus or Platts subscription is active.

**Impact:** Tier 1 (premium API) is empty. The architecture fully supports plugging it in later, but initial deployment will operate on Tier 2+ sources.

**What works without subscription:**

| Benchmark | Available Source | Tier | Delay | Confidence |
|-----------|-----------------|------|-------|------------|
| Brent | OPEC Basket page, OilPrice.com | P2/P3 | delayed-1day | medium/low |
| WTI | OPEC Basket page, OilPrice.com, EIA | P2/P3/P4 | delayed-1day | medium/low |
| OPEC Basket | OPEC Basket page (`opec.org`) | P2 | delayed-1day | medium |
| Henry Hub | EIA API (free) | P4 | delayed-1day | medium |
| TTF | ICE Endex (free/delayed), OilPrice.com | P4/P3 | delayed | medium/low |
| **Saharan Blend** | ❌ Not available without subscription | — | — | — |
| **Murban** | ❌ Not available without subscription | — | — | — |

**Public display for unavailable benchmarks:** "Temporarily unavailable" (never reveals licensing status).

**Recommendation to client:**

1. **Short-term (now):** Deploy platform with available benchmarks. Saharan Blend card shows "Temporarily unavailable." Brent serves as primary display. The intelligence page architecture is built and ready. This immediately makes the platform more professional than sites showing only Brent/WTI, and establishes the intelligence platform foundation.

2. **Medium-term (1-3 months):** Contact Argus Media (`argusmedia.com`) and S&P Global Platts (`spglobal.com/commodityinsights`) for pricing. Request quotes specifically for:
   - Saharan Blend (Algerian crude) daily spot price
   - Brent, WTI, Murban daily prices
   - TTF daily price
   - Ask about "data redistribution rights" — critical for displaying on a public website

3. **Long-term (3-6 months):** Integrate subscription API → Saharan Blend + Murban go live → platform achieves full professional benchmark coverage with premium sourcing. Intelligence pages populate with real AI analysis and historical trends.

**Architecture note:** The system is already designed for this. When subscription credentials are obtained, enable `PlattsProvider` in config and Saharan Blend flows automatically through the entire pipeline — price cards, ticker, intelligence page, database. Zero frontend changes needed.

---

