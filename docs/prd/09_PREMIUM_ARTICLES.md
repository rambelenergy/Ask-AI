# PRD-09: Premium Articles

**Feature ID:** F09
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft - awaiting review
**Estimated Effort:** ~3 days
**Depends On:** F04 (User Registration), F08 (Subscription) — plans + user subscriptions must exist
**Related:** F08 — subscription determines whether user can access premium articles
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---

## 9. Premium Articles

### 9.1 Problem Statement

The platform produces high-value, in-depth energy analysis — but currently all content is free. There is no mechanism to:

1. **Lock premium content** behind a paywall
2. **Provide a preview** to entice free users to subscribe
3. **Differentiate** regular articles from exclusive analysis

F08 provides the subscription system. F09 leverages it for content gating: admins can mark articles as premium, free users see a preview + blur, and Premium subscribers get full access.

### 9.2 Goals

- **Premium flag**: admins can mark articles as premium via CMS
- **Preview content**: free users see a preview (first N characters or a custom excerpt)
- **Blur gate**: content is blurred after the preview, with a subscribe CTA
- **Access control**: full access only for subscribers on plans that allow premium articles
- **Plan-aware**: each plan has a premium access flag (Free=❌, Basic=❌, Premium=✅)
- **SEO-safe**: premium content remains indexable (present in HTML, not client-side rendered)

### 9.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| PRM-01 | Free user | See a preview of premium articles | I know what's inside and am enticed to subscribe |
| PRM-02 | Free user | See a clear CTA to unlock the full article | I can subscribe right away |
| PRM-03 | Premium subscriber | Read full premium articles without barriers | I get value from my subscription |
| PRM-04 | Admin | Mark articles as premium | I can manage exclusive content |
| PRM-05 | Admin | Write custom preview text | I control what free users see |
| PRM-06 | SEO | Premium content remains indexed by Google | We don't lose organic traffic |

### 9.4 Technical Design

#### 9.4.1 Database Schema

```sql
-- Extend articles table for premium content
ALTER TABLE articles
  ADD COLUMN is_premium BOOLEAN DEFAULT false,
  ADD COLUMN preview_content TEXT,             -- Custom preview (nullable = auto-generate first 300 words)
  ADD COLUMN premium_only_from TIMESTAMPTZ;    -- Optional: free for X days after publish, then premium
```

#### 9.4.2 Article Page Gating Logic

```
User opens /analysis/[slug]
    │
    ▼
┌─────────────────────────┐
│  article.is_premium?    │
└────────┬────────────────┘
         │
    ┌────▼────┐
    │ NO      │──→ Show full article (existing behavior, unchanged)
    └────┬────┘
         │ YES
         ▼
┌─────────────────────────┐
│  premium_only_from?     │── YES & date not reached ──→ Show full article (still in free period)
│  (free window check)    │
└────────┬────────────────┘
         │ date reached or null
         ▼
┌─────────────────────────┐
│  User logged in?        │
└────────┬────────────────┘
         │
    ┌────▼────┐
    │ NO      │──→ Show preview + blur + "Sign in to read" CTA
    └────┬────┘
         │ YES
         ▼
┌─────────────────────────┐
│  Has active subscription│
│  with premium access?   │
└────────┬────────────────┘
         │
    ┌────▼────────────┐
    │ NO (Free/Basic) │──→ Show preview + blur + "Upgrade to Premium" CTA
    └────┬────────────┘
         │
    ┌────▼────────────┐
    │ YES (Premium)   │──→ Show full article (same as non-premium)
    └─────────────────┘
```

#### 9.4.3 Premium Access Check

```typescript
// src/lib/premium.ts

export async function canAccessPremiumArticle(
  userId: string | null,
  article: Article,
  supabase: SupabaseClient
): Promise<{ canAccess: boolean; reason?: string }> {
  // 1. Not premium → everyone can access
  if (!article.is_premium) return { canAccess: true };

  // 2. Premium but still in free window
  if (article.premium_only_from && new Date() < new Date(article.premium_only_from)) {
    return { canAccess: true };
  }

  // 3. Not logged in
  if (!userId) return { canAccess: false, reason: "not_logged_in" };

  // 4. Admin bypass
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (profile?.role === "admin") return { canAccess: true };

  // 5. Check subscription + plan premium access
  const { data: sub } = await supabase
    .from("user_subscriptions")
    .select("plan_id, status, subscription_plans(features)")
    .eq("user_id", userId)
    .in("status", ["trial", "active"])
    .single();

  if (!sub) return { canAccess: false, reason: "no_subscription" };

  // 6. Check if plan includes premium articles
  const features: string[] = sub.subscription_plans?.features ?? [];
  if (features.includes("All premium articles") || features.some(f => f.toLowerCase().includes("premium"))) {
    return { canAccess: true };
  }

  return { canAccess: false, reason: "plan_restricted" };
}
```

#### 9.4.4 Premium Article UI States

**Preview + Blur (free user):**

```
┌──────────────────────────────────────────┐
│  🔒 Premium Analysis                     │
│                                          │
│  Algeria's Solar Export Strategy:        │
│  A Critical Assessment                   │
│                                          │
│  By Ramdane Belamri · June 10, 2026     │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ PREVIEW                            │ │
│  │                                    │ │
│  │ Algeria's ambitious 15 GW solar    │ │
│  │ program represents a fundamental   │ │
│  │ shift in the country's energy      │ │
│  │ export strategy. However, the      │ │
│  │ financing mechanisms remain        │ │
│  │ dependent on European investment   │ │
│  │ vehicles that have yet to...       │ │
│  │                                    │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │ ░░░░░  Content locked  ░░░░░░░░░░░ │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  🔓 Unlock Full Analysis           │ │
│  │                                    │ │
│  │  Subscribe to Premium to read      │ │
│  │  in-depth analysis and access      │ │
│  │  all premium content.              │ │
│  │                                    │ │
│  │  [View Plans →]   [Sign In]        │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

**Full access (premium subscriber / non-premium article):**

No change from existing behavior. Article renders normally without blur/gate.

#### 9.4.5 SEO Consideration

Premium content must remain indexable by Google. Strategy:

1. **Server-side render**: full content remains in the HTML (not fetched via AJAX)
2. **Structured data**: `isAccessibleForFree: false` + `hasPart` for paywalled content
3. **CSS blur, not hide**: content is visually hidden (CSS blur + max-height), not `display: none`
4. **Paywall markup**: use `@type: NewsArticle` + `hasPart: { "@type": "WebPageElement", "isAccessibleForFree": false }` so Google knows this is a paywall

```html
<!-- SEO-safe premium content structure -->
<div class="premium-content" data-nosnippet>
  <!-- Preview: always visible, indexable -->
  <section class="preview">
    Algeria's ambitious 15 GW solar program...
  </section>

  <!-- Premium: blurred but present in HTML -->
  <section class="premium-locked" aria-hidden="true">
    <div class="blur-overlay">
      The financing structure involves...
    </div>
  </section>
</div>
```

#### 9.4.6 Admin CMS Extension

Add to `ArticleForm.tsx` (existing CMS):

| Field | Type | Default |
|-------|------|---------|
| Premium Article | Toggle | Off |
| Custom Preview | Textarea | Auto (first 300 words) |
| Premium From Date | Date picker | Immediately |

Preview field only appears when Premium toggle = On.

### 9.5 API Endpoints

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/articles/[slug]/access` | Optional | Check if current user can access full article |
| Server-side check | — | `canAccessPremiumArticle()` called during SSR — no extra API call needed |

Access check is performed server-side during article page rendering. No separate API endpoint is needed to check access — SSR already determines which state to render.

### 9.6 Acceptance Criteria

- [ ] Admin can mark articles as premium via CMS (toggle + custom preview + date)
- [ ] Free user (not logged in) sees preview + blur + "Sign in / View Plans" CTA
- [ ] Basic subscriber sees preview + blur + "Upgrade to Premium" CTA
- [ ] Premium subscriber sees full article without barriers
- [ ] Admin can always access full premium articles
- [ ] `premium_only_from` works: article is freely accessible before that date
- [ ] Premium content remains in HTML source (SEO-safe, CSS blur not hide, `@type: NewsArticle` with `isAccessibleForFree: false`)
- [ ] Preview: auto-generates first 300 words if admin does not provide custom preview
- [ ] No flash of unlocked content (access check is server-side)
- [ ] Non-premium articles are unaffected (no behavior change)

### 9.7 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| Extend `articles` table (`is_premium`, `preview_content`, `premium_only_from`) | 0.25 day | — |
| Admin: premium toggle + fields in ArticleForm CMS | 0.5 day | migration |
| `canAccessPremiumArticle()` server utility | 0.5 day | F08, migration |
| Article page SSR: premium gating logic integration | 0.5 day | utility |
| Premium preview UI + blur overlay component | 0.5 day | gating logic |
| Premium CTA component (sign in / upgrade) | 0.5 day | preview UI |
| JSON-LD paywall structured data (`isAccessibleForFree`) | 0.25 day | article page |
| i18n: premium UI strings (EN/FR) | 0.25 day | — |
| **Total** | **~3.25 days (~3 days)** | |

---

### 9.8 Future Considerations (Phase 3+)

- **Pay-per-article**: purchase access to a single article without a full subscription
- **Preview length config**: admin can configure how many preview words per plan
- **Premium article series**: bundled collection of premium articles sold together
- **Gated data visualizations**: interactive charts exclusive to premium
- **Expiring content**: premium articles that automatically become free after X months
