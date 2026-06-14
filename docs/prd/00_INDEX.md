# PRD Index - RamBelEnergy.com Phase 2

**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft - awaiting review

---

## Document Map

| # | Document | File | Days |
|---|----------|------|------|
| 1 | Live Energy Price | [`01_LIVE_ENERGY_PRICE.md`](./01_LIVE_ENERGY_PRICE.md) | ~6.5 |
| 2 | RAG + Cron Automated Ingestion | [`02_RAG.md`](./02_RAG.md) | ~16.5 |
| 3 | Ask-Energy Optimization with RAG | [`03_ASK_ENERGY_RAG.md`](./03_ASK_ENERGY_RAG.md) | ~4.5 |
| 4 | User Register & Dashboard | [`04_USER_REGISTER_DASHBOARD.md`](./04_USER_REGISTER_DASHBOARD.md) | ~8.5 |
| 5 | Energy Projects in Algeria | [`05_ENERGY_PROJECTS_ALGERIA.md`](./05_ENERGY_PROJECTS_ALGERIA.md) | ~7.5 |
| 6 | SEO | [`06_SEO.md`](./06_SEO.md) | ~7 |
| 7 | Rate Limiting & Auth Gate | [`07_RATE_LIMIT_ASK_ENERGY.md`](./07_RATE_LIMIT_ASK_ENERGY.md) | ~3.5 |
| 8 | Subscription System | [`08_SUBSCRIPTION.md`](./08_SUBSCRIPTION.md) | ~10.5 |
| 9 | Premium Articles | [`09_PREMIUM_ARTICLES.md`](./09_PREMIUM_ARTICLES.md) | ~3 |

---

## Executive Summary

Phase 2 transforms RamBelEnergy.com from a content platform with basic AI into a comprehensive, monetizable energy intelligence hub. Nine features:

1. **Live Energy Price** - Real-time energy commodity price dashboard
2. **RAG + Cron** - Vector database + embedding pipeline + automated ingestion
3. **RAG-powered Ask-Energy** - Hybrid search+RAG for deeper answers
4. **User Registration** - Public accounts, bookmarks, saved queries
5. **Energy Projects** - Curated Algeria project showcase
6. **SEO** - Sitemap, structured data, Core Web Vitals
7. **Rate Limit + Auth Gate** - Login-gated AI, quota per user
8. **Subscription System** - 3-tier plans, Stripe payment, dynamic quota
9. **Premium Articles** - Content gating with preview + blur, plan-aware access

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
| Live Prices | `fetch-live-prices.ts` utility (no dedicated UI) |
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
    │     └──→ F08 (Subscription System)
    │           │
    │           └──→ F09 (Premium Articles)
    │
F05 (Energy Projects) -- independent
    │
F06 (SEO) -- depends on all pages, can start earlier
```

### Recommended Phasing

**Phase 2a (Weeks 1-4): Foundation + Quick Wins**
| Week | Features |
|------|----------|
| 1 | F01 (Live Energy Price) |
| 1-2 | F05 (Energy Projects) |
| 2-4 | F02 (RAG + Cron) - longest pole |

**Phase 2b (Weeks 5-8): Integration + Users**
| Week | Features |
|------|----------|
| 5 | F03 (Ask-Energy + RAG) |
| 5-6 | F04 (User Registration) |
| 6-7 | F07 (Rate Limit + Auth Gate) |
| 7-8 | F06 (SEO) - start early |

**Phase 2c (Weeks 9-11): Monetization**
| Week | Features |
|------|----------|
| 9-10 | F08 (Subscription System) |
| 10-11 | F09 (Premium Articles) |

### Total Estimates

| Feature | Days |
|---------|------|
| 1. Live Energy Price | ~6.5 |
| 2. RAG (with cron ingestion) | ~16.5 |
| 3. RAG + Ask-Energy | ~4.5 |
| 4. Users + Dashboard | ~8.5 |
| 5. Energy Projects | ~7.5 |
| 6. SEO | ~7 |
| 7. Rate Limiting & Auth Gate | ~3.5 |
| 8. Subscription System | ~10.5 |
| 9. Premium Articles | ~3 |
| **Total** | **~67.5 days (~13.5 weeks)** |

With parallel work: **~10-11 weeks**

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| pgvector unavailable on Supabase | High | Low | Verify; upgrade Pro if needed |
| Embedding API costs spike | Medium | Medium | Batch + daily token cap |
| Cron job fails silently | Medium | Low | Failure alert; crawl_logs monitoring |
| Trusted source blocks scraper | Medium | Medium | Exponential backoff; auto-pause |
| Live price scraping breaks | Medium | High | EIA API fallback; cache stale |
| Anonymous abuse of ask-energy | Medium | High | F07 auth gate + F08 quota per tier |
| Race condition quota counter | Low | Medium | PostgreSQL atomic increment |
| Stripe integration complexity | Medium | Medium | Stripe Checkout (hosted) |
| Subscription adoption low | Medium | Medium | Free tier remains functional |
| SEO: premium content not indexed | Medium | Low | CSS blur, not hide; content in HTML |
| SEO changes break existing URLs | High | Low | Redirects; don't change slugs |

---

## Success Criteria (All Features)

### Feature 1 - Live Energy Price
- [ ] `/energy-prices` page with >=6 commodities, multi-source comparison (EIA + OilPrice + TradingEcon), auto-refresh <200ms
- [ ] Homepage ticker widget

### Feature 2 - RAG
- [ ] >=50 chunks indexed, cron >=10 sources, dedup cross-source
- [ ] RAG search <200ms, auto-pause on 5 failures

### Feature 3 - RAG + Ask-Energy
- [ ] RAG parallel web search, P0 platform content priority
- [ ] No latency regression

### Feature 4 - Users + Dashboard
- [ ] Registration end-to-end, bookmarks + saved queries, RLS strict

### Feature 5 - Energy Projects
- [ ] >=12 projects, filter category + status, admin CMS

### Feature 6 - SEO
- [ ] Lighthouse >=90, sitemap, robots.txt, JSON-LD valid

### Feature 7 - Rate Limiting & Auth Gate
- [ ] Auth gate + 5 req/day default + admin bypass + quota UI
- [ ] Atomic PostgreSQL increment

### Feature 8 - Subscription System
- [ ] 3 tier plans, Stripe Checkout + webhook sync, dynamic quota
- [ ] Admin: plan CRUD, subscriber list, stats (MRR)
- [ ] User: `/pricing`, `/dashboard/subscription`

### Feature 9 - Premium Articles
- [ ] Premium flag CMS, preview + blur gate, plan-aware access
- [ ] SEO-safe (CSS blur, content in HTML, JSON-LD paywall markup)

---

## Exclusions (Not in Phase 2)

- ❌ Real-time websocket price streaming
- ❌ Newsletter/email automation
- ❌ Social media auto-posting
- ❌ Mobile app
- ❌ Multi-tenant architecture
- ❌ Algerian local payment methods
- ❌ Team/Enterprise plans
- ❌ Pay-per-article
- ❌ A/B testing

---

## Appendix A: Environment Variables (New)

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
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_***
STRIPE_BASIC_PRICE_ID=price_***
STRIPE_PREMIUM_PRICE_ID=price_***
```

## Appendix B: New Packages

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

## Appendix C: Supabase Plan Requirements

| Requirement | Plan |
|-------------|------|
| pgvector | Free tier ✅ |
| Storage >=1 GB | Free tier: 1 GB ✅ |
| Auth >=1000 users | Free tier: 50k MAU ✅ |
| Database size (vectors + subs) | Monitor; 90d retention news |
| Cron execution | Pro recommended (300s timeout) |
