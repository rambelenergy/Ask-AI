# PRD-01: Live Energy Price

**Feature ID:** F01
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~5 days
**Depends On:** None (independent)
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---


## 1. Live Energy Price

### 1.1 Problem Statement

Users currently get energy prices only as text inside ask-energy responses. There is no dedicated, real-time energy price dashboard. The site serves an audience of energy professionals, analysts, and policymakers who need quick access to benchmark prices without digging through search results.

The `fetch-live-prices.ts` utility already fetches live price data from dynamic pages (EIA, oilprice.com) — but this data is only injected into ask-energy prompts. It's invisible to users as a standalone feature.

### 1.2 Goals

- Provide a **dedicated Live Energy Price page** (`/energy-prices`) with real-time price cards
- Display key benchmarks: WTI, Brent, Louisiana Light (LLS), Henry Hub Natural Gas, TTF, LNG spot
- Auto-refresh prices periodically (every 5-15 minutes)
- Show price change (% and absolute), trend direction, and last-updated timestamp
- Provide a **homepage widget** showing top 3-4 benchmark prices
- Support manual refresh and last-updated indicator

### 1.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| LP-01 | Energy analyst | See current crude oil prices (Brent, WTI) at a glance | I can quickly reference benchmarks in my work |
| LP-02 | Policy advisor | Track natural gas spot prices (Henry Hub, TTF) | I can understand market conditions for Algeria-Europe gas flows |
| LP-03 | General visitor | See energy prices on the homepage | I understand the site covers real market data |
| LP-04 | Researcher | Know when prices were last updated | I can assess data freshness |
| LP-05 | Mobile user | View price cards on my phone | I can check prices on the go |

### 1.4 Technical Design

#### Data Sources (Multi-Source Comparison)

Live prices are fetched from three independent sources for cross-verification. All three run in parallel on every price query.

| Priority | Source | Commodities | Method |
|----------|--------|-------------|--------|
| P1 | `eia.gov/todayinenergy/prices.php` | WTI, Brent, Henry Hub, LLS | Web scrape |
| P1 | `oilprice.com` | WTI, Brent, crude benchmarks | Web scrape |
| P1 | `tradingeconomics.com/commodity/crude-oil` | WTI, Brent | Web scrape |
| P2 | EIA API v2 (free registration) | All benchmarks | REST API (future) |

**Comparison strategy:**
- All three sources are fetched in parallel on every ask-energy price query
- Prices are displayed side-by-side for key benchmarks (WTI, Brent)
- Discrepancies between sources are shown transparently (e.g., "EIA: $93.68 | OilPrice: $93.72 | TradingEcon: $93.65")
- A weighted average or the most recently updated source is used as the primary display value
- Source freshness is displayed ("EIA: updated 10:30 AM | OilPrice: updated 10:32 AM")
- If one source fails, the other two still serve as comparison

**Recommendation:** Keep the free web-scrape approach for all three. Add EIA API v2 (free) later for more structured data.

#### API Endpoint

**`GET /api/energy-prices`**

```typescript
// Response
{
  "prices": [
    {
      "label": "WTI Crude",
      "unit": "USD/bbl",
      "primary": { "value": 93.68, "source": "EIA", "lastUpdated": "..." },
      "comparison": [
        { "value": 93.72, "source": "OilPrice", "lastUpdated": "..." },
        { "value": 93.65, "source": "TradingEconomics", "lastUpdated": "..." }
      ],
      "change": -1.2,
      "changePercent": -1.27,
      "trend": "down"
    },
    {
      "label": "Brent Crude",
      "unit": "USD/bbl",
      "primary": { "value": 97.45, "source": "EIA", "lastUpdated": "..." },
      "comparison": [
        { "value": 97.50, "source": "OilPrice", "lastUpdated": "..." },
        { "value": 97.42, "source": "TradingEconomics", "lastUpdated": "..." }
      ],
      "change": 0.8,
      "changePercent": 0.83,
      "trend": "up"
    },
    // ... Henry Hub, TTF, LLS, LNG spot
  ],
  "lastUpdated": "2026-06-14T10:30:00Z",
  "sources": ["EIA", "OilPrice.com", "Trading Economics"]
}
```

#### Caching Strategy

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Client      │────▶│  /api/energy-│────▶│  In-memory   │
│  (5min poll) │     │  prices      │     │  cache (TTL: │
│              │◀────│              │◀────│  5 min)      │
└─────────────┘     └──────────────┘     └──────┬────────┘
                                                 │ cache miss
                                          ┌──────▼────────┐
                                          │  Live scrape   │
                                          │  (EIA, oilprice)│
                                          └────────────────┘
```

- Server-side in-memory cache with 5-minute TTL
- Client polls every 5 minutes (setInterval or SWR with `refreshInterval`)
- Fallback: show last cached prices with "Updated X min ago" indicator
- Error state: show stale prices with warning banner

#### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `PriceCard` | `src/components/prices/PriceCard.tsx` | Individual commodity card (label, primary value + comparison sources, change, trend arrow) |
| `PriceGrid` | `src/components/prices/PriceGrid.tsx` | Grid layout for price cards |
| `PriceTicker` | `src/components/prices/PriceTicker.tsx` | Compact horizontal ticker for homepage widget |
| `PriceComparison` | `src/components/prices/PriceComparison.tsx` | Side-by-side source comparison row (EIA | OilPrice | TradingEcon) |
| `EnergyPricesPage` | `src/app/(site)/energy-prices/page.tsx` | Full prices page with comparison view |

#### Frontend States

| State | Visual |
|-------|--------|
| Loading | Skeleton cards (pulsing gray blocks) |
| Success (single source) | Live price cards with colored trend indicators (green↑ / red↓) |
| Success (multi-source) | Price card with expandable comparison row showing all 3 sources |
| Partial (1-2 sources failed) | Primary value from successful source + "X source(s) unavailable" note |
| Error (all sources failed) | Stale data + warning banner "Prices may be delayed" |
| Empty | "No price data available" with retry button |

#### Homepage Widget

Compact horizontal ticker strip between hero and first content section:

```
┌──────────────────────────────────────────────────────────────┐
│  Live Energy Markets  ● WTI $93.68 ▼1.2%  │  Brent $97.45 ▲0.8%  │  Henry Hub $3.27 ▼0.5%  │  TTF €32.40 ▲1.1%  │  View All →  │
└──────────────────────────────────────────────────────────────┘
```

### 1.5 Ask-Energy Price Comparison Display

When a user asks about energy prices via ask-energy, the response includes a comparison across all three sources:

```
┌──────────────────────────────────────────────────────────┐
│  📊 Current Crude Oil Prices                              │
│                                                           │
│  WTI Crude (USD/bbl)                                      │
│  ┌──────────────┬──────────────┬──────────────────────┐  │
│  │    EIA.gov   │ OilPrice.com │ Trading Economics    │  │
│  │ $93.68 ▼1.2% │ $93.72 ▼1.1% │ $93.65 ▼1.3%         │  │
│  │  10:30 AM    │  10:32 AM    │  10:28 AM             │  │
│  └──────────────┴──────────────┴──────────────────────┘  │
│                                                           │
│  Brent Crude (USD/bbl)                                    │
│  ┌──────────────┬──────────────┬──────────────────────┐  │
│  │    EIA.gov   │ OilPrice.com │ Trading Economics    │  │
│  │ $97.45 ▲0.8% │ $97.50 ▲0.9% │ $97.42 ▲0.7%         │  │
│  └──────────────┴──────────────┴──────────────────────┘  │
│                                                           │
│  Sources: eia.gov · oilprice.com · tradingeconomics.com   │
│  All times GMT+7                                          │
└──────────────────────────────────────────────────────────┘
```

### 1.6 Acceptance Criteria

- [ ] `/energy-prices` page renders with >=6 commodity price cards
- [ ] Each price card shows primary value from EIA + comparison from OilPrice.com and Trading Economics
- [ ] Three sources fetched in parallel (EIA, oilprice.com, tradingeconomics.com/crude-oil)
- [ ] Ask-energy price responses include multi-source comparison table
- [ ] Prices auto-refresh every 5 minutes without full page reload
- [ ] Each card shows: label, value with unit, change %, trend arrow, source timestamp
- [ ] Last-updated timestamp is visible per source
- [ ] Homepage ticker shows top 4 benchmarks with trend indicators
- [ ] Loading state (skeleton), partial-failure state (1-2 sources down), error state all handled
- [ ] Mobile: price cards stack vertically, ticker scrolls horizontally
- [ ] Cache prevents excessive upstream scraping (max 1 request/5min per source)
- [ ] Graceful degradation: if one source is down, show available sources with "unavailable" note

### 1.7 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| Build `GET /api/energy-prices` endpoint with parallel multi-source fetch | 1.5 days | — |
| Build extraction logic for EIA + oilprice.com + tradingeconomics.com/crude-oil | 1.5 days | — |
| `PriceCard` + `PriceGrid` + `PriceComparison` components | 1.5 days | — |
| `/energy-prices` page | 0.5 day | Components |
| Homepage `PriceTicker` widget | 0.5 day | Components |
| SWR polling + cache integration | 0.5 day | API |
| Responsive polish + states | 0.5 day | All UI |
| **Total** | **~6.5 days** | |

---

