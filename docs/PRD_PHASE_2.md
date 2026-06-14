# PRD Master - RamBelEnergy.com Phase 2

**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft - awaiting review

> 📄 **Per-feature details:** [docs/prd/](./prd/) - 9 separate documents for per-feature document control.

---

## Phase 2 Summary

Phase 2 transforms RamBelEnergy.com from a content platform with basic AI into a monetizable energy intelligence hub. Nine features:

| ID | Feature | Document | Estimate | Dependencies |
|----|---------|----------|----------|--------------|
| F01 | Live Energy Price | [`prd/01_LIVE_ENERGY_PRICE.md`](./prd/01_LIVE_ENERGY_PRICE.md) | ~6.5 days | - |
| F02 | RAG + Cron Ingestion | [`prd/02_RAG.md`](./prd/02_RAG.md) | ~16.5 days | pgvector |
| F03 | Optimize Ask-Energy + RAG | [`prd/03_ASK_ENERGY_RAG.md`](./prd/03_ASK_ENERGY_RAG.md) | ~4.5 days | F02 |
| F04 | User Register & Dashboard | [`prd/04_USER_REGISTER_DASHBOARD.md`](./prd/04_USER_REGISTER_DASHBOARD.md) | ~8.5 days | - |
| F05 | Energy Projects in Algeria | [`prd/05_ENERGY_PROJECTS_ALGERIA.md`](./prd/05_ENERGY_PROJECTS_ALGERIA.md) | ~7.5 days | - |
| F06 | SEO | [`prd/06_SEO.md`](./prd/06_SEO.md) | ~7 days | All pages |
| F07 | Rate Limiting & Auth Gate | [`prd/07_RATE_LIMIT_ASK_ENERGY.md`](./prd/07_RATE_LIMIT_ASK_ENERGY.md) | ~3.5 days | F04 |
| F08 | Subscription System | [`prd/08_SUBSCRIPTION.md`](./prd/08_SUBSCRIPTION.md) | ~10.5 days | F04, F07 |
| F09 | Premium Articles | [`prd/09_PREMIUM_ARTICLES.md`](./prd/09_PREMIUM_ARTICLES.md) | ~3 days | F04, F08 |
| **Total** | | | **~67.5 days (~13.5 weeks)** |

**With parallelization: ~10-11 weeks.**

---

## Phase 2 Target Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     RamBelEnergy.com                          │
├───────────────┬───────────────┬───────────────┬──────────────┤
│  Public Pages  │  AI / RAG     │  User System  │  Admin CMS   │
├───────────────┼───────────────┼───────────────┼──────────────┤
│  Homepage      │  Ask-Energy   │  Register     │  Articles    │
│  Analysis      │  RAG Search   │  Login        │  Publications│
│  Research      │  Web Search   │  Dashboard    │  Projects     │
│  Energy-Prices │  Live Prices  │  Bookmarks    │  Documents    │
│  Energy-Proj.  │  Cron Ingest  │  Saved Query  │  Trusted Feeds│
│  About         │  Rate Limit   │  Quota Track  │  Crawl Logs   │
│  Contact       │               │  Subscription │  Subscribers  │
│  Pricing       │               │  Stripe       │  Plans        │
├───────────────┴───────────────┴───────────────┴──────────────┤
│  Supabase PostgreSQL + pgvector + Auth + Storage             │
│  Vercel Cron (trusted source ingestion every 6 hours)        │
│  Stripe (payment + subscription management)                  │
└──────────────────────────────────────────────────────────────┘
```

---

## Dependency Graph

```
F02 (RAG + Cron)
    │
    ├──→ F03 (RAG + Ask-Energy)
    │
F01 (Live Prices) -- independent
    │
F04 (Users + Dashboard) -- independent
    │
    ├──→ F07 (Rate Limit + Auth Gate)
    │     │
    │     └──→ F08 (Subscription)
    │           │
    │           └──→ F09 (Premium Articles)
    │
F05 (Energy Projects) -- independent
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

## Phasing

### Phase 2a — Weeks 1-4: Foundation + Quick Wins
| Week | Features |
|------|----------|
| 1 | F01 (Live Energy Price) |
| 1-2 | F05 (Energy Projects) |
| 2-4 | F02 (RAG + Cron) — longest pole |

### Phase 2b — Weeks 5-8: Integration + Users
| Week | Features |
|------|----------|
| 5 | F03 (Ask-Energy + RAG) |
| 5-6 | F04 (User Registration + Dashboard) |
| 6-7 | F07 (Rate Limit + Auth Gate) |
| 7-8 | F06 (SEO) — started earlier |

### Phase 2c — Weeks 9-11: Monetization
| Week | Features |
|------|----------|
| 9-10 | F08 (Subscription System) |
| 10-11 | F09 (Premium Articles) |

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| pgvector unavailable on Supabase | High | Low | Verify; upgrade to Pro if needed |
| Embedding API costs spike | Medium | Medium | Batch + daily token cap |
| Cron job fails silently | Medium | Low | Failure alert; crawl_logs monitoring |
| Trusted source blocks scraper | Medium | Medium | Exponential backoff; auto-pause |
| Live price scraping breaks | Medium | High | EIA API fallback; cache stale prices |
| Anonymous abuse of ask-energy | Medium | High | F07 auth gate + F08 quota per tier |
| Race condition in quota counter | Low | Medium | PostgreSQL atomic increment |
| Stripe integration complexity | Medium | Medium | Stripe Checkout (hosted), not custom UI |
| Low subscription adoption | Medium | Medium | Free tier remains fully functional |
| SEO: premium content not indexed | Medium | Low | CSS blur, not hide; content in HTML server-side |
| Feature scope creep | Medium | Medium | Acceptance criteria defined per feature |
| SEO changes break existing URLs | High | Low | Add redirects; don't change slugs |

---

## Success Criteria (Summary)

| Feature | Key Metric |
|-------|------------|
| F01 | >=6 commodity prices, multi-source comparison (EIA + OilPrice + TradingEcon), auto-refresh <200ms |
| F02 | >=50 chunks indexed, cron >=10 sources, dedup cross-source |
| F03 | RAG parallel to web search, P0 priority for platform content |
| F04 | Registration end-to-end, bookmarks + saved queries, RLS strict |
| F05 | >=12 projects, category + status filter, admin CMS |
| F06 | Lighthouse SEO >=90, sitemap, robots.txt, JSON-LD valid |
| F07 | Auth gate + 5 req/day default + admin bypass + quota UI |
| F08 | 3 tier plans, Stripe Checkout, dynamic quota, admin subscriber mgmt |
| F09 | Premium flag CMS, preview + blur gate, plan-aware access, SEO-safe |

---

## Exclusions (Not in Phase 2)

- ❌ Real-time websocket price streaming
- ❌ Newsletter/email automation
- ❌ Social media auto-posting
- ❌ Mobile app
- ❌ Multi-tenant architecture
- ❌ Algerian local payment methods (CCP, BaridiMob)
- ❌ Team/Enterprise multi-seat plans
- ❌ Pay-per-article (single purchase)
- ❌ A/B testing framework

---

## Appendix: Environment Variables (New)

```env
# F01 - Live Prices
# EIA_API_KEY=***

# F02 - RAG + Cron
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
CRON_SECRET=***
EMBEDDING_DAILY_MAX_TOKENS=500000

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
  "@stripe/stripe-js": "^4.0.0"
}
```

---

**Next step:** Review and approve scope → sprint planning.
