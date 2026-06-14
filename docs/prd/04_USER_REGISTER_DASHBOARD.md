# PRD-04: User Registration & Dashboard

**Feature ID:** F04
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~8.5 days
**Depends On:** Supabase Auth email provider configured
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---


## 4. Register User & Dashboard

### 4.1 Problem Statement

The site currently has no public user accounts. Visitors cannot save queries, bookmark articles, or personalize their experience. There is also no mechanism for building an audience/email list for future newsletters or premium features.

Adding user registration creates a pathway to future premium features and user engagement.

### 4.2 Goals

- Public user registration via Supabase Auth (email/password)
- User profile page with basic settings (name, language preference, email)
- User dashboard with:
  - Saved queries history
  - Bookmarked articles
  - Recent AI conversations
- Minimal friction: optional registration, most features work without login
- Admin can view user counts (not individual data)

### 4.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Visitor | Register with email + password | I can save my preferences |
| US-02 | Registered user | Save interesting articles | I can find them later |
| US-03 | Registered user | See my past ask-energy questions | I can revisit topics |
| US-04 | Registered user | Set language preference (EN/FR) | The site remembers my choice |
| US-05 | Registered user | Delete my account | I control my data |
| US-06 | Visitor | Use most features without registering | I'm not forced to sign up |
| US-07 | Admin | See total registered user count | I can track platform growth |

### 4.4 Technical Design

#### Database Schema

```sql
-- User profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks: articles saved by users
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, article_id)
);

-- Saved ask-energy queries
CREATE TABLE saved_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer_preview TEXT,          -- first 300 chars of answer
  sources JSONB DEFAULT '[]',   -- simplified source list
  language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### RLS Policies

```sql
-- Users can only read/write their own data
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Own queries" ON saved_queries
  FOR ALL USING (auth.uid() = user_id);
```

#### Auth Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Register Page   │────▶│  Supabase Auth    │────▶│  Email Confirm  │
│  Email/Password  │     │  .signUp()        │     │  (if enabled)    │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
┌─────────────────┐     ┌──────────────────┐              │
│  Login Page      │────▶│  Supabase Auth    │◀─────────────┘
│  Email/Password  │     │  .signInWithPw()  │
└─────────────────┘     └────────┬─────────┘
                                 │
                    ┌────────────▼─────────┐
                    │  Auth Context         │
                    │  (SessionProvider)    │
                    └────────────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
        ┌──────────┐     ┌──────────┐     ┌──────────────┐
        │ Header    │     │ Dashboard│     │ Save Query    │
        │ (Login/   │     │ /profile │     │ Bookmark      │
        │  Avatar)  │     │          │     │               │
        └──────────┘     └──────────┘     └──────────────┘
```

#### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `AuthProvider` | `src/components/auth/AuthProvider.tsx` | Supabase session context |
| `LoginForm` | `src/components/auth/LoginForm.tsx` | Email/password login |
| `RegisterForm` | `src/components/auth/RegisterForm.tsx` | Email/password registration |
| `UserMenu` | `src/components/auth/UserMenu.tsx` | Header avatar + dropdown (profile, dashboard, logout) |
| `BookmarkButton` | `src/components/content/BookmarkButton.tsx` | Toggle bookmark on article cards |
| `DashboardPage` | `src/app/(site)/dashboard/page.tsx` | Protected dashboard |

#### Pages

| Route | Auth | Purpose |
|-------|------|---------|
| `/register` | Public | Registration form |
| `/login` | Public | Login form |
| `/dashboard` | Required | User dashboard (bookmarks, queries, settings) |
| `/dashboard/settings` | Required | Profile settings (name, language, delete account) |

#### User Menu (Header)

When logged in:
```
┌──────────────┐         ┌─────────────────────┐
│ 👤 Hi, Ahmed  │  click  │ 📊 Dashboard         │
│        ▼      │────────▶│ ⭐ My Bookmarks      │
└──────────────┘         │ 📝 Saved Queries     │
                         │ ⚙️  Settings          │
                         │ ─────────────────    │
                         │ 🚪 Sign Out          │
                         └─────────────────────┘
```

When not logged in:
```
┌──────────┐      ┌──────────┐
│ Register │      │  Sign In │
└──────────┘      └──────────┘
```

### 4.5 Acceptance Criteria

- [ ] User can register with email + password
- [ ] Email confirmation works (Supabase default flow)
- [ ] User can log in / log out
- [ ] Header shows Login/Register buttons when signed out
- [ ] Header shows avatar + user menu when signed in
- [ ] Bookmark button appears on article cards (signed-in only)
- [ ] Dashboard shows saved bookmarks and query history
- [ ] Dashboard is protected (redirects to login if unauthenticated)
- [ ] Settings page allows editing display name and language preference
- [ ] Delete account works (cascades to all user data)
- [ ] All site features work without login (bookmark button hidden)
- [ ] RLS policies prevent cross-user data access
- [ ] No PII leakage in logs or error messages

### 4.6 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| `user_profiles` + `bookmarks` + `saved_queries` migration | 0.5 day | — |
| Supabase Auth email provider config | 0.5 day | — |
| `AuthProvider` + session management | 1 day | Auth config |
| Login + Register pages + forms | 1 day | AuthProvider |
| Header `UserMenu` component | 0.5 day | AuthProvider |
| `BookmarkButton` + bookmark toggle API | 1 day | user_profiles |
| Dashboard page (bookmarks + queries tabs) | 1.5 days | Bookmarks API |
| Settings page (profile edit, delete account) | 1 day | user_profiles |
| `GET/POST /api/user/queries` for saved queries | 0.5 day | saved_queries |
| RLS policies + security review | 0.5 day | All tables |
| Error states: duplicate email, weak password, etc. | 0.5 day | Forms |
| **Total** | **~8.5 days** | |

---

