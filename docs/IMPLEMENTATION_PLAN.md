# Implementation Plan — RamBelEnergy.com Phase 1

**Date:** 2026-05-29
**Status:** Greenfield — full build required
**Timeline:** 4 weeks (adapted from original plan)

---

## Overview

This plan breaks Phase 1 into four weekly milestones, with tasks, dependencies, and validation steps. The plan accounts for the greenfield start (no existing code) and the updated AI requirements.

**Principles:**
- Build reusable components early
- Secure backend first, then wire UI
- Database schema must be stable before feature work
- Commit after every milestone
- No RAG/vector/document-indexing code in Phase 1

---

## Week 1 — Audit, Requirements, Setup, and Foundation

### Goal
Establish project, repository, database, auth foundation, and design system. Create stable base for feature work.

### Tasks

#### Day 1-2: Project Initialization
- [ ] **1.1** Initialize Next.js 14+ with App Router, TypeScript, Tailwind CSS
  - `npx create-next-app@latest rambelenergy --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*"`
  - Install shadcn/ui: `npx shadcn@latest init`
- [ ] **1.2** Initialize git repository
  - `git init`
  - Create `.gitignore` (node_modules, .env, .next, etc.)
  - Initial commit: `chore: initialize next.js project with typescript and tailwind`
  - Create and switch to `development` branch
- [ ] **1.3** Set up project directory structure
  ```
  src/
    app/              — App Router pages
      (public)/       — Public-facing routes
      admin/          — Admin CMS routes
      api/            — API routes
    components/       — Reusable UI components
    components/ui/    — shadcn/ui components
    lib/              — Utilities, Supabase client
    types/            — TypeScript types
    hooks/            — Custom React hooks
  public/             — Static assets
  supabase/           — Migrations and seed data
  docs/               — Documentation
  ```
- [ ] **1.4** Configure Tailwind theme
  - Custom colors: navy (`#0f172a`), teal (`#0d9488`), slate neutrals
  - Typography: serif for headings (inter/newsreader), sans for body
  - Spacing and breakpoints aligned with wireframe

#### Day 2-3: Supabase Foundation
- [ ] **1.5** Set up Supabase local development
  - Install Supabase CLI if needed
  - Initialize Supabase project locally
  - Configure `supabase/config.toml`
- [ ] **1.6** Create database migrations
  - `migrations/00001_create_articles.sql`
  - `migrations/00002_create_publications.sql`
  - `migrations/00003_create_admin_policies.sql`
- [ ] **1.7** Define TypeScript types
  - `types/database.ts` — Database schema types
  - `types/article.ts` — Article entity
  - `types/publication.ts` — Publication entity
- [ ] **1.8** Seed sample data (development only)
  - 2-3 sample articles
  - 2-3 sample publications
  - Run `supabase db reset` to verify migrations

#### Day 3-4: Global Layout & Components
- [ ] **1.9** Create base layout
  - `src/app/layout.tsx` — Root layout with fonts, metadata
  - `src/components/Header.tsx` — Navigation header from wireframe
  - `src/components/Footer.tsx` — Site footer
  - `src/components/Container.tsx` — Max-width wrapper
- [ ] **1.10** Build reusable UI components
  - `src/components/SectionHeading.tsx`
  - `src/components/ArticleCard.tsx`
  - `src/components/PublicationCard.tsx`
  - `src/components/Button.tsx` (primary, secondary variants)
- [ ] **1.11** Create placeholder content strategy
  - Label all placeholder text clearly: `[Placeholder — replace with client content]`
  - Prepare sample article content about Algeria-Europe energy

#### Day 4-5: Environment & Auth Setup
- [ ] **1.12** Create `.env.example`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (server-only)
  - `OPENROUTER_API_KEY` (server-only)
  - `ADMIN_EMAIL` (for initial admin setup)
- [ ] **1.13** Set up Supabase client
  - `src/lib/supabase/client.ts` — Browser client
  - `src/lib/supabase/server.ts` — Server-side client
- [ ] **1.14** Configure Supabase Auth
  - Enable email/password auth in Supabase
  - Create initial admin user (documented, not automated for security)
  - Set up auth middleware for protected routes
- [ ] **1.15** Admin login page skeleton
  - `src/app/admin/login/page.tsx`
  - Basic form with email/password
  - Supabase auth integration

### Week 1 Validation
- [ ] `npm run dev` starts without errors
- [ ] Tailwind custom theme loads correctly
- [ ] Supabase local runs successfully
- [ ] Migrations apply cleanly
- [ ] Sample data is queryable
- [ ] Header and footer render on all pages
- [ ] Git commit: `feat: week 1 foundation — project init, database, layout`

---

## Week 2 — Public Website and Homepage AI Interface

### Goal
Build all public-facing pages and the homepage AI assistant UI.

### Tasks

#### Day 1-2: Homepage
- [ ] **2.1** Hero section
  - Title: "Independent Analysis on Algeria-Europe Energy Relations"
  - Subtitle with platform mission
  - CTA buttons: "Read Latest Analysis" + "Explore Energy Focus"
  - Abstract route illustration (Nigeria → Algeria → Italy/Spain)
- [ ] **2.2** Nigeria-Algeria-Europe Pipeline section
  - Section heading + description
  - 4 feature cards (Gas Infrastructure, Algeria as Energy Hub, Italy & Spain Destinations, European Energy Security)
- [ ] **2.3** Recent Insight and Commentary section
  - Fetch articles from Supabase (limit 3-6)
  - Featured article treatment
  - "View All Analysis" link
- [ ] **2.4** Briefs, Notes, and Reports section
  - Fetch publications from Supabase (limit 3-6)
  - Publication cards with category tags
- [ ] **2.5** About the Analyst preview section
  - Profile image placeholder
  - Short bio excerpt
  - "View Profile" button linking to About page
- [ ] **2.6** Energy Themes section
  - 6 theme cards with arrow links
  - (Non-interactive for Phase 1 — links to analysis page)

#### Day 2-3: Homepage AI Assistant Section
- [ ] **2.7** Create `AIAssistantPanel` component
  - Section title: "Ask About Algeria-Europe Energy"
  - Supporting text explaining context-based Q&A
  - Context input area (textarea with placeholder)
  - Question input (text input with placeholder)
  - Submit button
  - **States:**
    - Empty state with example questions
    - Loading state (spinner + "Analyzing...")
    - Error state (message + retry)
    - Success state (answer panel with context note)
  - Disclaimer: "Answers are based on the content you provide. A full knowledge base is planned for a future phase."
- [ ] **2.8** Frontend AI ask hook
  - `src/hooks/useAiAsk.ts`
  - Manages form state, API call, loading/error/response
  - Calls `POST /api/ai/ask`

#### Day 3-4: Remaining Public Pages
- [ ] **2.9** About / Profile page (`/about`)
  - Mr. Ramdane's profile header
  - Professional background sections
  - Journalism / PhD / Analyst identity
  - Platform vision and mission
  - Placeholder content clearly labeled
- [ ] **2.10** News / Analysis listing page (`/analysis`)
  - Article grid/list layout
  - Article cards with image, title, excerpt, date, category
  - Featured article treatment
  - (Category filter if time permits — not required)
- [ ] **2.11** Article detail page (`/analysis/[slug]`)
  - Title, author, date, category
  - Article body (rendered HTML/markdown)
  - Source/reference link (if available)
  - Featured image (if available)
  - Related articles area (if already supported)
- [ ] **2.12** Research / Publication page (`/research`)
  - Publication listing
  - Publication cards with title, description excerpt, date
  - External source link or file reference

#### Day 4-5: Responsive Polish
- [ ] **2.13** Mobile navigation (hamburger menu)
- [ ] **2.14** Tablet and mobile breakpoint adjustments
- [ ] **2.15** Touch target sizes, readable font scaling
- [ ] **2.16** Image responsiveness

### Week 2 Validation
- [ ] All 5 public pages are navigable
- [ ] Homepage renders all sections from wireframe
- [ ] AI assistant section is visible and styled correctly
- [ ] Article cards display database content
- [ ] Responsive on 320px, 768px, 1440px viewports
- [ ] `npm run build` succeeds
- [ ] Git commit: `feat: week 2 public website and homepage AI UI`

---

## Week 3 — CMS and Working AI Features

### Goal
Make AI functional, build CMS, connect everything.

### Tasks

#### Day 1-2: Secure AI Backend
- [ ] **3.1** Create `POST /api/ai/ask` endpoint
  - Request body: `{ context: string, question: string }`
  - Validation: context and question required, context length limit (~8000 chars)
  - System prompt with grounding rules
  - Call OpenRouter API securely (server-side only)
  - Return: `{ success: true, answer: string }` or error payload
  - Handle AI provider failures gracefully
- [ ] **3.2** Create `POST /api/ai/summarize` endpoint
  - Request body: `{ articleId: string }`
  - Fetch article from Supabase by ID
  - Validation: article exists, has content
  - Send content to AI with summarization prompt
  - Return: `{ success: true, summary: string }` or error
  - Handle article not found, empty content, AI failure
- [ ] **3.3** AI prompt templates
  - `src/lib/ai/prompts.ts`
  - `askPrompt(context, question)` — grounding rules
  - `summarizePrompt(articleContent)` — concise professional summary
- [ ] **3.4** OpenRouter integration
  - `src/lib/ai/openrouter.ts`
  - Secure API key from env var
  - Model selection: cost-effective but capable (e.g., `openai/gpt-4o-mini` or `anthropic/claude-3.5-haiku`)
  - Error handling for rate limits, timeouts

#### Day 2-3: Homepage AI Integration
- [ ] **3.5** Wire `AIAssistantPanel` to `/api/ai/ask`
  - Connect form submission to API
  - Display loading spinner during request
  - Render answer in result container
  - Show error message with retry button
  - Disable submit during request
- [ ] **3.6** Test AI ask cases
  - Valid context + valid question → answer returned
  - Empty context → validation error
  - Empty question → validation error
  - Question not answerable from context → "not found in context" response
  - AI provider failure → graceful error

#### Day 3-4: Article Summarization Integration
- [ ] **3.7** Add "Summarize This Article" to article detail page
  - Button/control below article content
  - On click: call `/api/ai/summarize` with article ID
  - Summary panel expands below button
  - Loading state during generation
  - Error state with retry
  - Close/dismiss summary option
- [ ] **3.8** Test summarization cases
  - Valid article → summary returned
  - Article not found → 404 error
  - Article with no content → error
  - AI provider failure → graceful error

#### Day 4-5: CMS Implementation
- [ ] **3.9** Admin dashboard layout
  - `src/app/admin/layout.tsx` — protected layout with sidebar/nav
  - Auth check: redirect to `/admin/login` if not authenticated
  - Logout functionality
- [ ] **3.10** Admin dashboard home
  - Stats cards: total articles, total publications
  - Quick links to article and publication management
- [ ] **3.11** Article management
  - `src/app/admin/articles/page.tsx` — article listing
  - `src/app/admin/articles/new/page.tsx` — create article form
  - `src/app/admin/articles/[id]/edit/page.tsx` — edit article form
  - Form fields: title, slug, excerpt, content, category, author, published_at, status (draft/published), featured_image_url, source_url
  - Validation: required fields, slug uniqueness, URL format
  - Delete with confirmation dialog
- [ ] **3.12** Publication management
  - `src/app/admin/publications/page.tsx` — publication listing
  - `src/app/admin/publications/new/page.tsx` — create form
  - `src/app/admin/publications/[id]/edit/page.tsx` — edit form
  - Form fields: title, slug, description, publication_date, external_url, file_url
  - Validation and confirmation dialog
- [ ] **3.13** Rich text editor for content
  - Simple textarea for Phase 1 (Markdown support preferred)
  - Or integrate a lightweight editor if shadcn ecosystem has one

### Week 3 Validation
- [ ] Homepage AI assistant returns real answers from OpenRouter
- [ ] Article summarization generates real summaries
- [ ] Admin can log in, create, edit, delete articles
- [ ] Admin can create, edit, delete publications
- [ ] Unauthenticated users cannot access admin routes
- [ ] API returns proper error codes and messages
- [ ] `.env.example` is complete, no secrets committed
- [ ] Git commit: `feat: week 3 CMS and working AI backend`

---

## Week 4 — Polish, Testing, Deployment Readiness, and Handover

### Goal
Ensure quality, document everything, prepare for deployment.

### Tasks

#### Day 1-2: Quality Assurance
- [ ] **4.1** Type checking
  - `npx tsc --noEmit` — fix all TypeScript errors
- [ ] **4.2** Linting
  - Install and configure ESLint if not already present
  - `npm run lint` — fix all issues
- [ ] **4.3** Production build
  - `npm run build` — must succeed with zero errors
  - Review build output for warnings
- [ ] **4.4** Manual route testing
  - [ ] `/` — Homepage loads, all sections visible
  - [ ] `/about` — Profile page loads
  - [ ] `/analysis` — Article listing loads with data
  - [ ] `/analysis/[slug]` — Article detail loads, summarization works
  - [ ] `/research` — Publication listing loads
  - [ ] `/admin/login` — Login page works
  - [ ] `/admin` — Protected, redirects if not logged in
  - [ ] `/admin/articles` — Article CRUD works
  - [ ] `/admin/publications` — Publication CRUD works
- [ ] **4.5** Manual AI UI testing
  - [ ] Homepage AI: empty state → input → submit → loading → answer
  - [ ] Homepage AI: error state (invalid input)
  - [ ] Article summarization: click → loading → summary → retry
- [ ] **4.6** Responsive testing
  - Chrome DevTools: iPhone SE, iPad, Desktop
  - Check navigation, cards, AI panel, article content

#### Day 2-3: Content & UI Polish
- [ ] **4.7** Review all placeholder content
  - Ensure clear `[Placeholder]` labels where real content is missing
  - Write high-quality placeholder biography and mission text
- [ ] **4.8** Add sample content
  - 3-4 realistic sample articles about Algeria-Europe energy
  - 2-3 sample publications
  - Seed script for easy development reset
- [ ] **4.9** Animation and interaction polish
  - Subtle hover states on cards and buttons
  - Smooth transitions for AI panel expand/collapse
  - Loading skeletons if needed
- [ ] **4.10** Error page polish
  - Custom 404 page
  - Error boundary for unexpected errors

#### Day 3-4: Documentation
- [ ] **4.11** Update `README.md`
  - Project overview
  - Tech stack
  - Local setup steps (clone, install, env, Supabase, dev server)
  - Available scripts
- [ ] **4.12** Create `docs/HANDOVER_NOTES.md`
  - What was built
  - How to set up Supabase (local and production)
  - How to configure AI provider (OpenRouter)
  - Admin usage guide
  - Environment variables reference
  - Deployment steps (Vercel)
- [ ] **4.13** Create `docs/NEXT_PHASE_AI_RAG_ROADMAP.md`
  - What Phase 1 AI does (context-based only)
  - What Phase 2+ could add:
    - Trusted source ingestion (gov, news, research)
    - Document indexing and chunking
    - Vector database (pgvector)
    - RAG workflow with source citations
    - Multilingual AI search (AR, EN, IT, ES, FR)
    - Larger Algeria-Europe energy knowledge base
  - Technical architecture for future RAG
  - Estimated scope/timeline considerations
- [ ] **4.14** Update `.env.example` with all required and optional variables

#### Day 4-5: Final Review & Commit
- [ ] **4.15** Final build verification
  - `npm run build` clean
  - No console errors in dev
  - No hydration mismatches
- [ ] **4.16** Security check
  - No API keys in frontend code
  - No secrets in git history
  - Admin routes properly protected
  - RLS policies reviewed
- [ ] **4.17** Final git commit
  - `chore: final review, docs, and deployment readiness`
- [ ] **4.18** Tag release
  - `git tag v1.0.0-phase1`

### Week 4 Validation
- [ ] Build succeeds, no errors, no warnings
- [ ] All public pages render correctly
- [ ] AI features work end-to-end
- [ ] CMS works end-to-end
- [ ] Responsive on all target viewports
- [ ] Documentation is complete and accurate
- [ ] No secrets in repository
- [ ] Git history is clean

---

## Dependency Graph

```
Week 1
├── Project Init ──→ Git Setup ──→ Tailwind Config
├── Supabase Local ──→ Migrations ──→ Seed Data
└── Layout + Components ──→ Header/Footer ──→ Base UI Kit

Week 2
├── Homepage Sections ──→ AI Assistant UI (frontend only)
├── About / Analysis / Article / Research pages
└── Responsive polish

Week 3
├── AI Backend (API routes) ──→ OpenRouter integration
├── Homepage AI ──→ Wire to backend
├── Article Summarization ──→ Wire to backend
└── CMS ──→ Auth ──→ Article CRUD ──→ Publication CRUD

Week 4
├── QA (types, lint, build, manual test)
├── Content polish + sample data
├── Documentation (README, handover, roadmap)
└── Final commit + tag
```

---

## Commit Message Convention

Use conventional commits:

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation
- `style:` — CSS/styling (no logic change)
- `refactor:` — Code restructuring
- `chore:` — Maintenance, setup
- `test:` — Tests

Examples:
- `feat: implement homepage context-based energy AI assistant`
- `feat: add article summarization workflow to article detail`
- `feat: add admin CMS article and publication management`
- `fix: secure AI route validation and error handling`
- `chore: validate build and prepare handover documentation`

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenRouter API costs | Low | Use cost-effective models, limit context length |
| No real client content | Medium | High-quality placeholders with clear labels |
| Scope creep (AI features) | Medium | Stick to context-based only; no RAG |
| Supabase production setup delay | Low | Local Supabase works; document production steps |
| Responsive issues late | Low | Test responsive weekly, not just at end |
| Build failures late | Low | Run build every 2-3 days, not just week 4 |

---

## Notes

- **Do not** implement pgvector, document indexing, or RAG in Phase 1.
- **Do not** add subscription, payment, or user management beyond admin auth.
- **Do not** build automated news crawling or real-time data APIs.
- Keep components reusable — Phase 2 will build on this foundation.
- Prioritize credibility and professionalism over flashy features.
