# PRD Index - RamBelEnergy.com Phase 2

**Version:** 1.1
**Date:** 2026-06-17
**Status:** Updated — F01 and F05 revised per client direction (automation-first philosophy)

---

## Document Map

| # | Document | File | Days | Priority |
|---|----------|------|------|----------|
| 1 | Live Energy Price | [`01_LIVE_ENERGY_PRICE.md`](./01_LIVE_ENERGY_PRICE.md) | ~5 | **P0** ← Client priority #1 |
| 2 | RAG + Cron Automated Ingestion | [`02_RAG.md`](./02_RAG.md) | ~16.5 | P1 |
| 3 | Ask-Energy Optimization with RAG | [`03_ASK_ENERGY_RAG.md`](./03_ASK_ENERGY_RAG.md) | ~4.5 | P1 |
| 4 | User Register & Dashboard | [`04_USER_REGISTER_DASHBOARD.md`](./04_USER_REGISTER_DASHBOARD.md) | ~8.5 | P2 |
| 5 | Algeria Energy Projects Database | [`05_ENERGY_PROJECTS_ALGERIA.md`](./05_ENERGY_PROJECTS_ALGERIA.md) | ~18-22 | **P0** ← Client priority #2 |
| 6 | SEO | [`06_SEO.md`](./06_SEO.md) | ~7 | P2 |
| 7 | Rate Limiting & Auth Gate | [`07_RATE_LIMIT_ASK_ENERGY.md`](./07_RATE_LIMIT_ASK_ENERGY.md) | ~3.5 | P2 |
| 8 | Subscription System | [`08_SUBSCRIPTION.md`](./08_SUBSCRIPTION.md) | ~10.5 | P3 |
| 9 | Premium Articles | [`09_PREMIUM_ARTICLES.md`](./09_PREMIUM_ARTICLES.md) | ~3 | P3 |

---

## Executive Summary

Phase 2 transforms RamBelEnergy.com from a content platform with basic AI into a comprehensive, monetizable energy intelligence hub. Nine features:

1. **Live Energy Price** - Real-time multi-source energy commodity price dashboard (scraper already built, ~5 days remaining)
2. **RAG + Cron** - Vector database + embedding pipeline + automated document ingestion
3. **RAG-powered Ask-Energy** - Hybrid search+RAG for deeper, sourced answers
4. **User Registration** - Public accounts, bookmarks, saved queries, dashboard
5. **Algeria Energy Projects Database** - Automated collection from 19 official sources, AI extraction into 18-field schema, review CMS, interactive map. Self-updating, not manually maintained.
6. **SEO** - Sitemap, structured data, Core Web Vitals
7. **Rate Limit + Auth Gate** - Login-gated AI, quota per user
8. **Subscription System** - 3-tier plans, Stripe payment, dynamic quota
9. **Premium Articles** - Content gating with preview + blur, plan-aware access

### Key Philosophy (per Client Direction, 2026-06-17)

> **"Automate as much as possible, rely on trusted data sources and AI, and avoid manual content management whenever possible."**

This philosophy drives F01 (automated multi-source price scraping with AI comparison) and F05 (automated project database with AI extraction — CMS is for review only, not data entry).

### Subscription Tiers

| Tier | Price | Ask-Energy | Premium Articles |
|------|-------|------------|------------------|
| Free | $0 | 5 / day | Preview only |
| Basic | $9/mo | 20 / day | Preview only |
| Premium | $29/mo | Unlimited | Full access |

### State of Phase 1

| Area | Phase 1 State |
|------|---------------|
| AI Search | Brave + LangSearch → OpenAI SSE with priority reranking |
| Live Prices | `fetch-live-prices.ts` utility + ask-energy injection (no dedicated UI yet) |
| Auth | Admin-only Supabase auth |
| Content | Articles, publications, energy-focus CMS |
| Database | Supabase PostgreSQL |
| Vector DB | None |
| SEO | Basic metadata only |
| Monetization | None |

---

## Timeline & Dependencies

### Dependency Graph

```
F02 (RAG + Cron) ← Shares crawl infra with F05
    │
    ├──→ F03 (RAG + Ask-Energy)
    │
F01 (Live Prices) -- independent P0
    │
F04 (Users + Dashboard) -- independent
    │
    ├──→ F07 (Rate Limit + Auth Gate)
    │     │
    │     └──→ F08 (Subscription System)
    │           │
    │           └──→ F09 (Premium Articles)
    │
F05 (Energy Projects DB) -- independent P0, shares crawl with F02
    │
F06 (SEO) -- depends on all pages, can start earlier
```

### Recommended Phasing (Revised)

**Phase 2a (Weeks 1-5): P0 Priorities + Foundation**

| Week | Features |
|------|----------|
| 1 | F01 (Live Energy Price) — ~5 days |
| 1-4 | F05 (Algeria Energy Projects DB) — ~18-22 days |
| 3-5 | F02 (RAG + Cron) — shares crawl infrastructure with F05 |

**Phase 2b (Weeks 6-9): Integration + Users**

| Week | Features |
|------|----------|
| 6 | F03 (Ask-Energy + RAG) |
| 6-7 | F04 (User Registration + Dashboard) |
| 7-8 | F07 (Rate Limit + Auth Gate) |
| 8-9 | F06 (SEO) — started earlier, completed here |

**Phase 2c (Weeks 10-12): Monetization**

| Week | Features |
|------|----------|
| 10-11 | F08 (Subscription System) |
| 11-12 | F09 (Premium Articles) |

### Total Estimates (Revised)

| Feature | Days |
|---------|------|
| 1. Live Energy Price | ~5 |
| 2. RAG (with cron ingestion) | ~16.5 |
| 3. RAG + Ask-Energy | ~4.5 |
| 4. Users + Dashboard | ~8.5 |
| 5. Algeria Energy Projects DB | ~18-22 |
| 6. SEO | ~7 |
| 7. Rate Limiting & Auth Gate | ~3.5 |
| 8. Subscription System | ~10.5 |
| 9. Premium Articles | ~3 |
| **Total** | **~77-81 days (~15.5-16 weeks)** |

With parallel work (F01 + F05 + F02 overlap, F04+F07 parallel): **~12-13 weeks**

---

## Key Changes from v1.0 (2026-06-17)

| Change | Previous | Revised | Reason |
|--------|----------|---------|--------|
| F01 estimate | ~6.5 days | ~5 days | Scraper already built; scope reduced to UI + endpoint |
| F05 estimate | ~7.5 days | ~18-22 days | Scope expanded: manual CMS → automated 19-source pipeline + AI extraction + map |
| F05 approach | Manual CMS entry | Automated collection with AI extraction, CMS for review only | Client direction: "automate as much as possible" |
| F05 sources | None specified | 19 official sources across 4 tiers | Client specification |
| F05 schema | 12 fields | 18 fields + GPS + source tracking + audit trail | Client specification |
| F05 map | Optional Phase 2b | Included in scope | Client request |
| P0 priorities | None | F01 + F05 | Client priority confirmation |

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| pgvector unavailable on Supabase | High | Low | Verify; upgrade Pro if needed |
| Embedding API costs spike | Medium | Medium | Batch + daily token cap |
| Cron job fails silently | Medium | Low | Failure alert; crawl_logs monitoring |
| Trusted source blocks scraper | Medium | Medium | Exponential backoff; auto-pause |
| Live price scraping breaks | Medium | High | EIA API fallback; cache stale |
| AI extraction hallucinates project data | High | Medium | Confidence scoring; human review queue; cross-source verification |
| Algerian gov sites slow/unavailable | Medium | High | Retry with backoff; cache last known good; flag in review queue |
| Anonymous abuse of ask-energy | Medium | High | F07 auth gate + F08 quota per tier |
| Race condition quota counter | Low | Medium | PostgreSQL atomic increment |
| Stripe integration complexity | Medium | Medium | Stripe Checkout (hosted) |
| Subscription adoption low | Medium | Medium | Free tier remains fully functional |
| SEO: premium content not indexed | Medium | Low | CSS blur, not hide; content in HTML |
| SEO changes break existing URLs | High | Low | Redirects; don't change slugs |
| F05 scope creep from additional sources | Medium | Medium | 19 sources locked for v1; new sources = future phase |

---

## Success Criteria (Key — F01 + F05)

### Feature 1 — Live Energy Price
- [ ] `/energy-prices` page with >=6 commodities, multi-source comparison (EIA + OilPrice + TradingEcon), auto-refresh <200ms
- [ ] Homepage ticker widget with top 4 benchmarks
- [ ] Per-source freshness timestamps
- [ ] Graceful degradation when individual sources fail

### Feature 5 — Algeria Energy Projects Database
- [ ] Automated crawl against all 19 sources on schedule
- [ ] AI extraction produces 18-field JSON with confidence scores
- [ ] Deduplication matches same project across different sources
- [ ] Review queue: new projects, changes, conflicts — approve/edit/reject workflow
- [ ] `/energy-projects` with category, status, wilaya filters
- [ ] Interactive map with GPS markers and popup cards
- [ ] Every project has source URL and last-updated timestamp
- [ ] Stale project flagging (>30 days without source update)
- [ ] Audit trail (`sync_history`) per project

---

## Exclusions (Not in Phase 2)

- ❌ Real-time websocket price streaming
- ❌ Non-Algerian energy projects (MENA expansion = future phase)
- ❌ Newsletter/email automation
- ❌ Social media auto-posting
- ❌ Mobile app
- ❌ Multi-tenant architecture
- ❌ Algerian local payment methods
- ❌ Team/Enterprise plans
- ❌ Pay-per-article
- ❌ A/B testing
- ❌ Public API for third-party access
- ❌ User-submitted project data

---

## Appendix A: Environment Variables (New/Updated)

```env
# F01 - Live Prices
# EIA_API_KEY=***  (future: EIA API v2)

# F02 + F05 - Shared Crawl Infrastructure
CRON_SECRET=***
OPENAI_API_KEY=***  (already in use, extended for project extraction)
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
EMBEDDING_DAILY_MAX_TOKENS=500000
EXTRACTION_DAILY_MAX_TOKENS=300000  # F05: LLM extraction budget

# F04 - Users
NEXT_PUBLIC_SITE_URL=https://rambelenergy.com

# F08 - Subscription
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_***
STRIPE_BASIC_PRICE_ID=price_***
STRIPE_PREMIUM_PRICE_ID=price_***
```

## Appendix B: New Packages (Updated)

```json
{
  "pdf-parse": "^1.1.1",
  "mammoth": "^1.8.0",
  "gpt-tokenizer": "^2.1.0",
  "cheerio": "^1.0.0",
  "@mozilla/readability": "^0.5.0",
  "rss-parser": "^3.13.0",
  "swr": "^2.2.0",
  "stripe": "^16.0.0",
  "@stripe/stripe-js": "^4.0.0",
  "leaflet": "^1.9.0",
  "react-leaflet": "^4.2.0",
  "@types/leaflet": "^1.9.0"
}
```

## Appendix C: Supabase Plan Requirements

| Requirement | Plan |
|-------------|------|
| pgvector | Free tier ✅ |
| Storage >=1 GB (project images + documents) | Free tier: 1 GB — may need upgrade for F05 |
| Auth >=1000 users | Free tier: 50k MAU ✅ |
| Database size (vectors + subs + project data) | Monitor; 90d retention news |
| Cron execution | Pro recommended (300s timeout, especially for F05 multi-source crawl) |
