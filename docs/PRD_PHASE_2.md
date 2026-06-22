# PRD Master - RamBelEnergy.com Phase 2

**Version:** 1.3
**Date:** 2026-06-18
**Status:** F01 v2.3 Final — Trusted Reference Pages: live data + AI analysis + original sources & official reports, serving researchers, policymakers, and investors
**Key Philosophy:** Automate as much as possible, rely on trusted data sources and AI, avoid manual content management whenever possible.

> 📄 **Per-feature details:** [docs/prd/](./prd/) — 9 separate documents for per-feature document control.

---

## Phase 2 Summary

Phase 2 transforms RamBelEnergy.com from a content platform with basic AI into a monetizable energy intelligence hub. Nine features:

| ID | Feature | Document | Estimate | Priority | Dependencies |
|----|---------|----------|----------|----------|--------------|
| F01 | Energy Intelligence Platform | [`prd/01_LIVE_ENERGY_PRICE.md`](./prd/01_LIVE_ENERGY_PRICE.md) | ~15-17 days | **P0** | Argus/Platts subscription (not yet acquired — §1.10) |
| F02 | RAG + Cron Ingestion | [`prd/02_RAG.md`](./prd/02_RAG.md) | ~16.5 days | P1 | pgvector |
| F03 | Optimize Ask-Energy + RAG | [`prd/03_ASK_ENERGY_RAG.md`](./prd/03_ASK_ENERGY_RAG.md) | ~4.5 days | P1 | F02 |
| F04 | User Register & Dashboard | [`prd/04_USER_REGISTER_DASHBOARD.md`](./prd/04_USER_REGISTER_DASHBOARD.md) | ~8.5 days | P2 | — |
| F05 | Algeria Energy Projects DB | [`prd/05_ENERGY_PROJECTS_ALGERIA.md`](./prd/05_ENERGY_PROJECTS_ALGERIA.md) | ~18-22 days | **P0** | — (shares crawl with F02) |
| F06 | SEO | [`prd/06_SEO.md`](./prd/06_SEO.md) | ~7 days | P2 | All pages |
| F07 | Rate Limiting & Auth Gate | [`prd/07_RATE_LIMIT_ASK_ENERGY.md`](./prd/07_RATE_LIMIT_ASK_ENERGY.md) | ~3.5 days | P2 | F04 |
| F08 | Subscription System | [`prd/08_SUBSCRIPTION.md`](./prd/08_SUBSCRIPTION.md) | ~10.5 days | P3 | F04, F07 |
| F09 | Premium Articles | [`prd/09_PREMIUM_ARTICLES.md`](./prd/09_PREMIUM_ARTICLES.md) | ~3 days | P3 | F04, F08 |
| **Total** | | | **~77-81 days** | |

**With parallelization: ~12-13 weeks.**

---

## Client Priorities (Confirmed 2026-06-17)

### P0 — Building Now
1. **F01 — Live Energy Price** (~5 days): Dedicated `/energy-prices` page with multi-source comparison, homepage ticker widget. Scraper already built.
2. **F05 — Algeria Energy Projects Database** (~18-22 days): Automated pipeline ingesting from 19 official sources (Tier 1: Algerian Official, Tier 2: International Organizations, Tier 3: News, Tier 4: International Operating Companies). AI extraction into 18-field schema. Review CMS (not manual entry). Interactive map.

### P1 — Next
3. **F02 — RAG + Cron** (shares crawl infrastructure with F05)
4. **F03 — RAG-powered Ask-Energy**

### P2 — Then
5. **F04 — User Registration + Dashboard**
6. **F07 — Rate Limiting + Auth Gate**
7. **F06 — SEO**

### P3 — Monetization
8. **F08 — Subscription System**
9. **F09 — Premium Articles**

---

## Key Architecture Decisions (per Client Philosophy)

> *"Automate as much as possible, rely on trusted data sources and AI, and avoid manual content management whenever possible."*

| Principle | Applied In |
|-----------|------------|
| **CMS is for review, not data entry** | F05: AI extracts project data; admin only approves/corrects |
| **Trusted reference pages** | F01: Every intelligence page combines live prices + AI analysis + sources & references + official reports. Every insight traceable, every page citable. |
| **Source attribution mandatory** | F05: Every project links to official source URL + last_updated |
| **AI handles unstructured → structured** | F05: LLM parses FR/AR/EN pages into 18-field JSON |
| **Human in the loop for oversight only** | F01 + F05: Review queue, approve/reject, not manual creation |

---

## Phase 2 Target Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     RamBelEnergy.com                          │
├───────────────┬───────────────┬───────────────┬──────────────┤
│  Public Pages  │  AI / Data     │  User System  │  Admin CMS   │
├───────────────┼───────────────┼───────────────┼──────────────┤
│  Homepage      │  Ask-Energy   │  Register     │  Articles    │
│  Analysis      │  RAG Search   │  Login        │  Publications│
│  Research      │  Web Search   │  Dashboard    │  Review Queue│
│  Energy-Prices │  Live Prices  │  Bookmarks    │  Crawl Logs  │
│  Energy-Proj.  │  Cron Crawler │  Saved Query  │  Subscribers │
│  About         │  AI Extract   │  Quota Track  │  Plans       │
│  Contact       │  Dedup Engine │  Subscription │  Sync Audit  │
│  Pricing       │  Rate Limit   │  Stripe       │              │
├───────────────┴───────────────┴───────────────┴──────────────┤
│  Supabase PostgreSQL + pgvector + Auth + Storage             │
│  Vercel Cron (19-source crawl every 6-12h, doc ingest 6h)    │
│  Stripe (payment + subscription management)                  │
│  Leaflet (interactive Algeria project map)                   │
└──────────────────────────────────────────────────────────────┘
```

---

## Dependency Graph

```
F02 (RAG + Cron) ← Shares crawl infra with F05
    │
    ├──→ F03 (RAG + Ask-Energy)
    │
F01 (Live Prices) -- P0 independent
    │
F04 (Users + Dashboard) -- independent
    │
    ├──→ F07 (Rate Limit + Auth Gate)
    │     │
    │     └──→ F08 (Subscription)
    │           │
    │           └──→ F09 (Premium Articles)
    │
F05 (Energy Projects DB) -- P0 independent, shares crawl with F02
    │
F06 (SEO) -- depends on all pages
```

---

## Subscription Tiers (F08)

| Tier | Price | Ask-Energy Quota | Premium Articles (F09) | Stripe |
|------|-------|------------------|------------------------|--------|
| **Free** | $0 | 5 / day | Preview only | No |
| **Basic** | $9/mo | 20 / day | Preview only | Yes |
| **Premium** | $29/mo | Unlimited | Full access | Yes |

---

## Phasing (Revised 2026-06-17)

### Phase 2a — Weeks 1-5: P0 Priorities + Foundation
| Week | Features |
|------|----------|
| 1 | F01 (Live Energy Price) |
| 1-4 | F05 (Algeria Energy Projects DB — automated pipeline) |
| 3-5 | F02 (RAG + Cron) — shares crawl infrastructure with F05 |

### Phase 2b — Weeks 6-9: Integration + Users
| Week | Features |
|------|----------|
| 6 | F03 (Ask-Energy + RAG) |
| 6-7 | F04 (User Registration + Dashboard) |
| 7-8 | F07 (Rate Limit + Auth Gate) |
| 8-9 | F06 (SEO) — started earlier |

### Phase 2c — Weeks 10-12: Monetization
| Week | Features |
|------|----------|
| 10-11 | F08 (Subscription System) |
| 11-12 | F09 (Premium Articles) |

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| pgvector unavailable on Supabase | High | Low | Verify; upgrade to Pro if needed |
| Embedding API costs spike | Medium | Medium | Batch + daily token cap |
| AI extraction hallucinates project data | High | Medium | Confidence scoring per field; human review queue; cross-source verification |
| Algerian gov sites slow/unavailable | Medium | High | Retry with exponential backoff; cache last known good; flag in review |
| Source site structure changes break scrapers | Medium | Medium | Monitoring alert; fallback to broader page fetch |
| Cron job fails silently | Medium | Low | Failure alert; crawl_logs monitoring |
| Primary price API (Platts/Argus) unavailable | Medium | Medium | Tiered fallback to OPEC (P2) → OilPrice.com (P3); Saharan Blend may show "unavailable" on fallback |
| Anonymous abuse of ask-energy | Medium | High | F07 auth gate + F08 quota per tier |
| Race condition in quota counter | Low | Medium | PostgreSQL atomic increment |
| Stripe integration complexity | Medium | Medium | Stripe Checkout (hosted), not custom UI |
| Low subscription adoption | Medium | Medium | Free tier remains fully functional |
| SEO: premium content not indexed | Medium | Low | CSS blur, not hide; content in HTML server-side |
| Feature scope creep (F05 sources) | Medium | Medium | 19 sources locked for v1; additional sources = future phase |
| SEO changes break existing URLs | High | Low | Add redirects; don't change slugs |

---

## Success Criteria (Summary — Updated)

| Feature | Key Metric |
|-------|------------|
| F01 | 7 benchmarks, tiered source priority, clickable → trusted reference pages with 7 elements (price + trends + AI analysis + news + country context + sources & references + official reports), 4-field metadata, historical DB, "Temporarily unavailable" messaging |
| F02 | >=50 chunks indexed, cron >=10 sources, dedup cross-source |
| F03 | RAG parallel to web search, P0 priority for platform content |
| F04 | Registration end-to-end, bookmarks + saved queries, RLS strict |
| F05 | Automated crawl against 19 sources, AI extraction into 18 fields, review queue + approve/reject, interactive map, source attribution per project, stale data flagging |
| F06 | Lighthouse SEO >=90, sitemap, robots.txt, JSON-LD valid |
| F07 | Auth gate + 5 req/day default + admin bypass + quota UI |
| F08 | 3 tier plans, Stripe Checkout, dynamic quota, admin subscriber mgmt |
| F09 | Premium flag CMS, preview + blur gate, plan-aware access, SEO-safe |

---

## Exclusions (Not in Phase 2)

- ❌ Real-time websocket price streaming
- ❌ Non-Algerian energy projects (MENA/global expansion)
- ❌ Newsletter/email automation
- ❌ Social media auto-posting
- ❌ Mobile app
- ❌ Multi-tenant architecture
- ❌ Algerian local payment methods (CCP, BaridiMob)
- ❌ Team/Enterprise multi-seat plans
- ❌ Pay-per-article (single purchase)
- ❌ A/B testing framework
- ❌ Public API for third-party data access
- ❌ User-submitted project data

---

## Key Changes from v1.0 (2026-06-17)

| Change | Previous | Revised | Reason |
|--------|----------|---------|--------|
| F01 estimate | ~8-10 days | ~15-17 days | v2.3: trusted reference pages + sources & references + official reports integration |
| F05 estimate | ~7.5 days | ~18-22 days | Manual CMS → automated 19-source pipeline + map |
| F05 approach | Manual CMS entry | Auto-collection + AI extraction, CMS for review only | Client direction |
| F05 sources | Unspecified | 19 official sources (4 tiers) | Client specification |
| F05 schema | 12 fields | 18 fields + GPS + source tracking + audit trail | Client specification |
| F05 map | "Optional Phase 2b" | Included in scope | Client request |
| P0 priorities | None designated | F01 + F05 | Client confirms |
| Combined estimate | ~67.5 days | ~77-81 days | F05 scope expansion |

---

## Appendix: Environment Variables (New)

```env
# F01 - Live Prices (v2.0 — Tiered Architecture)
# Primary Source (choose one)
PLATTS_API_KEY=***
PLATTS_API_SECRET=***
# ARGUS_API_KEY=***
# ARGUS_API_SECRET=***
# Validation + Supplemental
OPEC_BASKET_URL=https://www.opec.org/opec_web/en/data_graphs/40.htm
EIA_API_KEY=***

# F02 + F05 - Shared Crawl Infrastructure
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CRON_SECRET=***
EMBEDDING_DAILY_MAX_TOKENS=500000
EXTRACTION_DAILY_MAX_TOKENS=300000

# F04 - Users
NEXT_PUBLIC_SITE_URL=https://rambelenergy.com

# F08 - Subscription
STRIPE_SECRET_KEY=***
STRIPE_WEBHOOK_SECRET=***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=***
STRIPE_BASIC_PRICE_ID=price_***
STRIPE_PREMIUM_PRICE_ID=price_***
```

## Appendix: New Packages

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

---

**Next step:** Client approval → sprint planning → start F01 (Live Energy Price) Week 1.
