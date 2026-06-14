# PRD-07: Ask-Energy Rate Limiting & Auth Gate

**Feature ID:** F07
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~3 days
**Depends On:** F04 (User Registration) — users must exist before we can gate
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---

## 7. Ask-Energy Rate Limiting & Auth Gate

### 7.1 Problem Statement

Currently, ask-energy is open to all visitors without any restrictions. This causes several issues:

1. **API cost uncontrolled** — anyone can hit the endpoint repeatedly without limit, causing Brave Search + OpenAI costs to rise continuously
2. **No user incentive to register** — all AI features can be used without login, giving no reason to register
3. **Abuse risk** — bots or scrapers can spam the endpoint without any barriers
4. **No premium path** — there is no mechanism to differentiate free vs power users, making future monetization difficult

By combining an auth gate + daily quota, we control costs, encourage registration, and pave the way for a premium tier later.

### 7.2 Goals

- **Auth gate**: ask-energy can only be used by logged-in users
- **Daily quota**: maximum 5 requests per user per day (resets at midnight server time)
- **Quota UI**: display remaining quota in the chat interface
- **Admin bypass**: admin users are unlimited
- **Graceful messaging**: clear and friendly error messages when not logged in / quota exhausted
- **Smooth redirect**: if not logged in, redirect to the login page with a return URL
- **Quota persistence**: quota survives server restart, stored in the database

### 7.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| RL-01 | Visitor | Try ask-energy | I am directed to register/login first |
| RL-02 | Registered user | Know my remaining daily quota | I can manage my questions wisely |
| RL-03 | Registered user | Get a clear message when quota runs out | I know when I can ask again |
| RL-04 | Admin | Not be restricted by quota | I can test without barriers |
| RL-05 | Platform owner | API costs are controlled | There is no abuse from anonymous users |

### 7.4 Technical Design

#### 7.4.1 Rate Limit Table

```sql
-- Daily request tracking per user
CREATE TABLE daily_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, usage_date)
);

CREATE INDEX idx_daily_usage_user_date ON daily_usage (user_id, usage_date);
```

#### 7.4.2 Quota Rules

| Role | Daily Limit | Bypass? |
|------|-------------|---------|
| Anonymous (no session) | 0 | ❌ Rejected immediately |
| Authenticated user | 5 | ❌ Checked per request |
| Admin (`user_metadata.role = 'admin'`) | Unlimited | ✅ Bypass all checks |

#### 7.4.3 Updated Ask-Energy Flow

```
POST /api/ask-energy
    │
    ▼
┌─────────────────────────┐
│ 1. Auth Check           │
│    Parse Supabase       │
│    session cookie       │
└────────┬────────────────┘
         │
    ┌────▼────┐
    │ Session? │─── NO ──→ 401 { error: "auth_required", message: "..." }
    └────┬────┘
         │ YES
         ▼
┌─────────────────────────┐
│ 2. Admin Bypass Check   │
│    user_metadata.role   │
│    === 'admin' ?        │
└────────┬────────────────┘
         │
    ┌────▼────┐
    │ Admin?  │─── YES ──→ Skip quota, proceed to search
    └────┬────┘
         │ NO
         ▼
┌─────────────────────────┐
│ 3. Quota Check          │
│    SELECT request_count │
│    FROM daily_usage     │
│    WHERE user_id = ?    │
│    AND usage_date = ?   │
└────────┬────────────────┘
         │
    ┌────▼────────────────┐
    │ count >= 5 ?        │─── YES ──→ 429 { error: "quota_exceeded", ... }
    └────┬────────────────┘
         │ NO
         ▼
┌─────────────────────────┐
│ 4. Increment Counter    │
│    INSERT ... ON        │
│    CONFLICT UPDATE      │
│    request_count + 1    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 5. Proceed to Search    │
│    (existing flow)      │
│    Include in response: │
│    { remaining: 4,      │
│      limit: 5 }         │
└─────────────────────────┘
```

#### 7.4.4 API Response Specs

**401 — Auth Required (not logged in)**
```json
{
  "error": "auth_required",
  "message": "Please sign in to use Ask Energy. Registration is free.",
  "action": "login",
  "loginUrl": "/login?returnTo=/ai-assistant"
}
```

**429 — Quota Exceeded (quota exhausted)**
```json
{
  "error": "quota_exceeded",
  "message": "You've used all 5 questions for today. Your quota resets at midnight (GMT+7).",
  "limit": 5,
  "used": 5,
  "remaining": 0,
  "resetsAt": "2026-06-15T00:00:00+07:00"
}
```

**200 — Success (response includes quota info)**
```json
{
  "c": "... answer chunk ...",
  "remaining": 4,
  "limit": 5
}
```
Quota info is sent via the first SSE event (`p: "quota"`) so the UI can immediately update the counter.

#### 7.4.5 Server-Side Implementation

```typescript
// src/lib/rate-limit.ts

const DAILY_LIMIT = 5;

export interface QuotaResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetsAt: string; // ISO timestamp
}

export async function checkAskEnergyQuota(
  userId: string,
  supabase: SupabaseClient
): Promise<QuotaResult> {
  const today = new Date().toISOString().slice(0, 10); // "2026-06-14"
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const resetsAt = `${tomorrow}T00:00:00+07:00`;

  // Upsert + increment in one atomic operation
  const { data, error } = await supabase
    .from("daily_usage")
    .upsert(
      { user_id: userId, usage_date: today, request_count: 1 },
      { onConflict: "user_id,usage_date" }
    )
    .select("request_count")
    .single();

  // Actually, upsert with increment needs a different approach
  // Use raw SQL for atomic increment:
  const { data: result } = await supabase.rpc("increment_daily_usage", {
    p_user_id: userId,
    p_limit: DAILY_LIMIT,
  });

  // result: { allowed: boolean, count: number }
  return {
    allowed: result.allowed,
    remaining: Math.max(0, DAILY_LIMIT - result.count),
    limit: DAILY_LIMIT,
    resetsAt,
  };
}
```

**PostgreSQL Function (atomic increment + check)**

```sql
CREATE OR REPLACE FUNCTION increment_daily_usage(
  p_user_id UUID,
  p_limit INTEGER
) RETURNS JSONB AS $$
DECLARE
  v_count INTEGER;
  v_allowed BOOLEAN;
BEGIN
  INSERT INTO daily_usage (user_id, usage_date, request_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET
    request_count = daily_usage.request_count + 1,
    updated_at = NOW()
  RETURNING request_count INTO v_count;

  v_allowed := v_count <= p_limit;

  RETURN jsonb_build_object(
    'allowed', v_allowed,
    'count', v_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### 7.4.6 Integration into `ask-energy/route.ts`

```typescript
// At the top of the POST handler, after parsing input:

// 1. Auth check
const { data: { session }, error: authError } = await supabase.auth.getSession();
if (!session) {
  return Response.json({
    error: "auth_required",
    message: getAuthRequiredMessage(language),
    action: "login",
    loginUrl: "/login?returnTo=/ai-assistant",
  }, { status: 401 });
}

// 2. Admin bypass
const isAdmin = session.user.user_metadata?.role === 'admin';
if (!isAdmin) {
  const quota = await checkAskEnergyQuota(session.user.id, supabase);
  if (!quota.allowed) {
    return Response.json({
      error: "quota_exceeded",
      message: getQuotaExceededMessage(language),
      limit: quota.limit,
      remaining: quota.remaining,
      resetsAt: quota.resetsAt,
    }, { status: 429 });
  }
  // Send quota info to frontend
  enqueue({ p: "quota", remaining: quota.remaining, limit: quota.limit });
}

// ... continue to existing search flow
```

#### 7.4.7 Frontend Changes

**`AskEnergyChat.tsx` — Auth Gate**

```
┌──────────────────────────────────────────┐
│  🔒 Ask Energy                           │
│                                          │
│  Sign in to ask questions about          │
│  Algeria-Europe energy.                  │
│                                          │
│  Free registration — 5 questions/day.   │
│                                          │
│  [Sign In]  [Create Free Account]       │
└──────────────────────────────────────────┘
```

**When logged in:**

```
┌──────────────────────────────────────────┐
│  💬 Ask about Algeria-Europe energy...   │
│                              [3/5 left]  │
└──────────────────────────────────────────┘
```

**Quota Counter** — displayed above/below the chat input:
```
┌──────────────────────────────────────────────┐
│  3 of 5 daily questions used                │
│  ████████████░░░░░░░░░░  3/5                 │
│  Resets at midnight (GMT+7)                  │
└──────────────────────────────────────────────┘
```

**When quota is exhausted:**

```
┌──────────────────────────────────────────┐
│  ⏰ Daily limit reached                  │
│                                          │
│  You've used all 5 questions for today. │
│  Come back tomorrow or consider premium  │
│  for unlimited access (coming soon).     │
│                                          │
│  Resets in: 8h 23m                       │
└──────────────────────────────────────────┘
```

### 7.5 Acceptance Criteria

- [ ] Visitor without session receives a 401 response with a friendly message (EN/FR)
- [ ] Logged-in user can use ask-energy as usual
- [ ] User is limited to 5 requests/day; the 6th+ request is rejected with 429
- [ ] Admin user is unlimited (bypass quota)
- [ ] Quota counter is displayed in the chat UI (remaining quota)
- [ ] Quota resets automatically at midnight server time (GMT+7)
- [ ] Atomic increment via PostgreSQL function (no race condition)
- [ ] Return URL: after logging in from the ask-energy page, redirect back to `/ai-assistant`
- [ ] SSE response includes quota info in the first event
- [ ] Auth gate does not affect other endpoints (`/api/ai/summarize`, `/api/search`)
- [ ] Daily usage is recorded for analytics (optional: displayed in admin dashboard)

### 7.6 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| `daily_usage` table migration | 0.25 day | — |
| `increment_daily_usage` PostgreSQL function | 0.25 day | Migration |
| `checkAskEnergyQuota()` server utility | 0.5 day | DB function |
| Auth check + quota integration in `ask-energy/route.ts` | 0.5 day | Utility |
| Auth-gate UI: login prompt state in `AskEnergyChat` | 0.5 day | API changes |
| Quota counter UI + progress bar | 0.5 day | API quota event |
| Quota exhausted state UI + countdown timer | 0.5 day | — |
| i18n: auth-required + quota-exceeded messages (EN/FR) | 0.25 day | — |
| Testing: auth gate, quota increment, admin bypass, race condition | 0.5 day | All above |
| **Total** | **~3.5 days** | |

---

### 7.7 Future Considerations (Phase 3+)

- **Premium tier**: daily limit raised to 50/unlimited for subscribed users
- **Usage analytics dashboard**: admin can view usage graphs per day, top users, etc.
- **Sliding window rate limit**: in addition to daily quota, add a per-minute limit (e.g. 3 requests/minute) to prevent bursts
- **IP-based rate limiting**: for anonymous users who haven't registered, restrict based on IP fingerprint (more aggressive)
- **Quota notification**: email users when their quota is nearly exhausted (requires newsletter infra)
