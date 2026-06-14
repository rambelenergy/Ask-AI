# PRD-08: Subscription System

**Feature ID:** F08
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft - awaiting review
**Estimated Effort:** ~10.5 days
**Depends On:** F04 (User Registration), F07 (Rate Limiting)
**Related:** F09 (Premium Articles) — premium article gating split into a separate feature
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---

## 8. Subscription System

### 8.1 Problem Statement

F07 limits all users to 5 requests/day — but there is no mechanism for users who need more access. The platform also cannot yet monetize its services.

Power users (analysts, researchers, institutions) need higher quotas. They are willing to pay for extended access. Without a subscription system:

- No monetization path
- Cannot differentiate free vs power users
- All users are treated equally

This feature builds a tiered subscription system that controls the ask-energy quota and opens up a revenue stream.

### 8.2 Goals

- **Subscription plans**: Free, Basic, Premium — configurable by admin
- **Quota per plan**: dynamic based on the plan's `daily_quota` (-1 = unlimited)
- **Payment integration**: Stripe Checkout (hosted) + Customer Portal + Webhook sync
- **User lifecycle**: trial → subscribe → renew/cancel → expire → fallback to Free
- **Admin management**: manage plans, view subscribers, assign manually (bypass Stripe)
- **Pricing page**: `/pricing` with feature comparison
- **Dashboard**: user can view subscription status + upgrade/cancel

### 8.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| SUB-01 | Free user | Know my remaining quota and my tier | I can upgrade if I need more |
| SUB-02 | Power user | Subscribe to Basic (20 req/day) via Stripe | I can do more intensive research |
| SUB-03 | Institution | Subscribe to Premium (unlimited) | My team gets full access |
| SUB-04 | Subscriber | View my subscription status | I know when renewal is due |
| SUB-05 | Subscriber | Cancel subscription via Customer Portal | I am not locked in |
| SUB-06 | Admin | Create/edit subscription plans | I can set prices and features |
| SUB-07 | Admin | Manually assign a subscription to a user | I can give free access to partners |
| SUB-08 | Admin | View subscriber list + stats | I can track MRR and growth |

### 8.4 Technical Design

#### 8.4.1 Database Schema

```sql
-- Subscription plans (configurable by admin)
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- "Free", "Basic", "Premium"
  slug TEXT NOT NULL UNIQUE,                   -- "free", "basic", "premium"
  description TEXT,
  price_monthly_usd INTEGER NOT NULL DEFAULT 0, -- 0 = free
  price_yearly_usd INTEGER,                     -- nullable = no yearly option
  daily_quota INTEGER NOT NULL,                 -- ask-energy requests/day (-1 = unlimited)
  features JSONB NOT NULL DEFAULT '[]',        -- ["Premium articles", "Priority support", ...]
  is_public BOOLEAN DEFAULT true,              -- visible on pricing page
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions (links user to plan)
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'expired')),
  stripe_subscription_id TEXT,                 -- Stripe subscription reference
  stripe_customer_id TEXT,                     -- Stripe customer reference
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  assigned_by UUID REFERENCES auth.users(id),  -- admin who manually assigned
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_subscriptions_user ON user_subscriptions (user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions (status);
```

#### 8.4.2 Default Plans

```sql
INSERT INTO subscription_plans (name, slug, description, price_monthly_usd, daily_quota, features, sort_order)
VALUES
  (
    'Free',
    'free',
    'Basic access to energy intelligence. 5 questions per day.',
    0,
    5,
    '["5 AI questions/day", "All public articles", "Energy prices dashboard", "Energy projects browser"]',
    1
  ),
  (
    'Basic',
    'basic',
    'For analysts and researchers. Extended AI access.',
    9,
    20,
    '["20 AI questions/day", "Priority AI responses", "All public articles", "Save unlimited bookmarks", "Email support"]',
    2
  ),
  (
    'Premium',
    'premium',
    'Full access. Unlimited AI + premium analysis.',
    29,
    -1,  -- unlimited
    '["Unlimited AI questions", "All premium articles", "Priority AI responses", "Download reports (PDF)", "Early access to new analysis", "Priority support"]',
    3
  );
```

#### 8.4.3 Dynamic Quota System (extends F07)

F07 hard-coded 5 req/day. F08 makes it dynamic based on the user's plan:

```typescript
// src/lib/rate-limit.ts - updated

export async function getUserQuota(
  userId: string,
  supabase: SupabaseClient
): Promise<QuotaResult> {
  // 1. Admin bypass (unchanged)
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (profile?.role === "admin") {
    return { allowed: true, remaining: Infinity, limit: Infinity, plan: "admin" };
  }

  // 2. Get user's active subscription plan
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("plan_id, status, subscription_plans(daily_quota, name)")
    .eq("user_id", userId)
    .in("status", ["trial", "active"])
    .single();

  // 3. Fallback to Free plan if no subscription
  const dailyLimit = sub?.subscription_plans?.daily_quota ?? 5;
  const planName = sub?.subscription_plans?.name ?? "Free";

  // 4. Unlimited check
  if (dailyLimit === -1) {
    return { allowed: true, remaining: Infinity, limit: Infinity, plan: planName };
  }

  // 5. Check today's usage (atomic via F07's increment_daily_usage function)
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase
    .from("daily_usage")
    .select("request_count")
    .eq("user_id", userId)
    .eq("usage_date", today)
    .single();

  const count = usage?.request_count ?? 0;
  const remaining = Math.max(0, dailyLimit - count);

  return {
    allowed: count < dailyLimit,
    remaining,
    limit: dailyLimit,
    plan: planName,
  };
}
```

#### 8.4.4 Payment Flow (Stripe)

```
User clicks "Upgrade" on /pricing
    │
    ▼
┌──────────────────────────┐
│  POST /api/stripe/checkout│
│  { plan: "basic" }        │
│  → Create Checkout Session│
│  → Return { url }         │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Stripe Checkout Page     │
│  (hosted by Stripe)       │
│  Card, email, etc.        │
└────────┬─────────────────┘
         │
    ┌────▼────────────┐
    │ Payment Success? │── NO ──→ Redirect to /pricing?canceled=true
    └────┬────────────┘
         │ YES
         ▼
┌──────────────────────────┐
│  Stripe Webhook           │
│  POST /api/stripe/webhook │
│  Signature verified       │
│  event: checkout.session  │
│         .completed        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Upsert user_subscriptions│
│  status = 'active'        │
│  Link stripe_customer_id  │
└──────────────────────────┘
```

**Stripe integration scope:**
- Stripe Checkout (hosted page) — no custom card form, no PCI burden
- Stripe Customer Portal — user manages subscription (cancel, update payment method)
- Stripe Webhooks — sync subscription lifecycle
- **No custom billing UI** — all payment-related UI is handled by Stripe

#### 8.4.5 API Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/subscription/plans` | Public | List available subscription plans |
| `GET /api/subscription/me` | User | Current user's subscription status + plan + quota |
| `POST /api/stripe/checkout` | User | Create Stripe Checkout session → return URL |
| `GET /api/stripe/portal` | User | Redirect to Stripe Customer Portal |
| `POST /api/stripe/webhook` | Stripe sig | Stripe webhook handler (signature verified) |
| `GET /api/admin/subscriptions` | Admin | List all subscriptions with filters (plan, status) |
| `POST /api/admin/subscriptions/assign` | Admin | Manually assign subscription to user (bypass Stripe) |
| `PATCH /api/admin/subscriptions/[id]` | Admin | Update subscription (cancel, extend period) |
| `GET /api/admin/subscriptions/stats` | Admin | MRR, active subscribers, churn rate |

#### 8.4.6 Subscription Lifecycle

```
Register ──→ Free Plan (default, no subscription row needed)
    │
    │ Upgrade via Stripe
    ▼
Active (Basic/Premium) ──→ quota according to plan
    │
    ├── Payment fails ──→ Past Due ──→ retry / Expired ──→ Fallback to Free
    │
    ├── User cancels ──→ Canceled (access until period_end) ──→ Expired ──→ Free
    │
    └── Renewal success ──→ Active (period extended)
```

#### 8.4.7 Quota UI per Tier

The quota counter in the chat UI adjusts per plan:

```
Free:     [3/5 used today]    ████████░░   • Upgrade →
Basic:    [12/20 used today]  ██████░░░░   • Basic Plan
Premium:  [∞ unlimited]       ██████████   • Premium
```

Tapping/clicking "Upgrade" → redirects to `/pricing`.

### 8.5 Pages

| Route | Auth | Purpose |
|-------|------|---------|
| `/pricing` | Public | Pricing page with 3 tiers + feature comparison |
| `/dashboard/subscription` | Required | User: subscription status, plan details, upgrade/cancel |
| `/admin/subscriptions` | Admin | Subscriber list with filters (plan, status, date) |
| `/admin/subscriptions/plans` | Admin | CRUD subscription plans |
| `/admin/subscriptions/stats` | Admin | Dashboard: MRR, active subs, churn rate |

#### Pricing Page Design

```
┌──────────────────────────────────────────────────────────────┐
│                  Choose Your Plan                             │
│          Unlock the full power of energy intelligence         │
├──────────────────┬──────────────────┬────────────────────────┤
│     Free         │     Basic        │      Premium           │
│     $0/month     │     $9/month     │      $29/month         │
├──────────────────┼──────────────────┼────────────────────────┤
│ ✓ 5 AI questions │ ✓ 20 AI questions│ ✓ Unlimited AI         │
│   per day        │   per day        │   questions            │
│ ✓ All public     │ ✓ Priority AI    │ ✓ All premium          │
│   articles       │   responses      │   articles             │
│ ✓ Energy prices  │ ✓ Unlimited      │ ✓ Download reports     │
│ ✓ Project browser│   bookmarks      │   (PDF)                │
│                  │ ✓ Email support  │ ✓ Early access         │
│                  │                  │ ✓ Priority support     │
├──────────────────┼──────────────────┼────────────────────────┤
│  [Current Plan]  │  [Subscribe]     │  [Subscribe]           │
└──────────────────┴──────────────────┴────────────────────────┘
```

### 8.6 Acceptance Criteria

- [ ] Three subscription plans defined (Free/Basic/Premium) with different daily quotas
- [ ] Ask-energy quota dynamically follows the user's plan (Free=5, Basic=20, Premium=unlimited)
- [ ] Admin can create/edit subscription plans via CMS
- [ ] User can view available plans at `/pricing`
- [ ] User can subscribe via Stripe Checkout (Basic/Premium)
- [ ] Stripe webhook syncs subscription lifecycle (active → past_due → canceled → expired)
- [ ] User can manage subscription via Stripe Customer Portal (cancel, update payment)
- [ ] User can view subscription status at `/dashboard/subscription`
- [ ] Admin can manually assign a subscription to a user (bypass Stripe)
- [ ] Admin can view subscriber list + filters + stats (MRR, active, churn)
- [ ] Subscription expired → quota automatically falls back to Free tier
- [ ] Quota UI in chat displays plan name + remaining quota + upgrade link
- [ ] Stripe secret keys are never exposed to the frontend
- [ ] Webhook handler verifies Stripe signature before processing

### 8.7 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| `subscription_plans` + `user_subscriptions` migration | 0.5 day | — |
| `getUserQuota()` — dynamic plan-based quota | 0.5 day | F07, migration |
| `GET /api/subscription/plans` + `/me` endpoints | 0.5 day | migration |
| Stripe SDK setup + env vars + product config | 0.5 day | Stripe account |
| `POST /api/stripe/checkout` — create session | 1 day | Stripe SDK |
| `POST /api/stripe/webhook` — handle lifecycle events | 1 day | Checkout |
| `GET /api/stripe/portal` — customer portal redirect | 0.5 day | Stripe SDK |
| Admin: subscription plans CRUD UI | 1 day | migration |
| Admin: subscriber list + manual assignment | 1 day | user_subscriptions |
| Admin: subscription stats dashboard (MRR, counts) | 0.5 day | subscriber list |
| `/pricing` public page | 1 day | plans API |
| Quota UI: plan-aware counter in chat | 0.5 day | quota update |
| Dashboard: subscription status page | 1 day | /me API |
| Stripe webhook testing + full lifecycle QA | 1 day | All Stripe |
| i18n: pricing page + quota UI (EN/FR) | 0.25 day | — |
| **Total** | **~10.5 days** | |

---

### 8.8 Future Considerations (Phase 3+)

- **Trial auto-start**: 7-day free Premium trial on registration
- **Annual billing**: 20% discount for yearly plan
- **Team/Enterprise plan**: multiple seats, consolidated billing
- **Algerian payment methods**: CCP, BaridiMob, mobile money
- **Coupon/discount codes**: partnerships and promotions
- **Email notifications**: renewal reminder, payment failed, trial ending

---

### 8.9 Stripe Setup Notes

**Environment variables:**
```env
# F08 — Subscription
STRIPE_SECRET_KEY=sk_live_***
STRIPE_WEBHOOK_SECRET=whsec_***
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_***
STRIPE_BASIC_PRICE_ID=price_***          # Stripe Product Price IDs
STRIPE_PREMIUM_PRICE_ID=price_***
```

**Webhook events to handle:**
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/activate subscription |
| `customer.subscription.updated` | Sync status (active, past_due) |
| `customer.subscription.deleted` | Set status = canceled/expired |
| `invoice.payment_failed` | Set status = past_due |

**Development**: Use Stripe test keys + test card `4242 4242 4242 4242`.
