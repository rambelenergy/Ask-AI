# RamBelEnergy.com

Professional energy analysis and sustainability intelligence platform focused on Algeria–Europe energy relations.

## Overview

RamBelEnergy is a Next.js application providing:
- Professional public-facing website with institutional design
- News/Analysis articles on Algeria-Europe energy relations
- Research/Publication listings
- Functional AI assistant for context-based Q&A
- Article summarization powered by OpenRouter AI
- Admin CMS for content management (with Supabase integration)

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Backend**: Next.js API Routes (App Router)
- **Database**: Supabase PostgreSQL (ready for integration)
- **Auth**: Supabase Auth
- **AI**: OpenRouter API with `openrouter/owl-alpha` model
- **Deployment**: Vercel (recommended)

## Local Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for production)
- OpenRouter API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rambelenergy-new
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required values:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `OPENROUTER_API_KEY` - Your OpenRouter API key

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
  app/                    # Next.js App Router pages
    (public)/             # Public-facing routes
      page.tsx            # Homepage
      about/              # About/Profile page
      analysis/           # Article listing
        [slug]/           # Article detail
      research/           # Publication listing
      contact/            # Contact page
      energy-focus/       # Focus areas page
    admin/                # Admin CMS
      login/              # Admin login
      layout.tsx          # Protected admin layout
      page.tsx            # Admin dashboard
      articles/           # Article CRUD
      publications/       # Publication CRUD
    api/                  # API routes
      ai/
        ask/              # AI Q&A endpoint
        summarize/        # Article summarization endpoint
      auth/
        signout/          # Sign out endpoint
  components/             # Reusable UI components
    ui/                   # shadcn/ui components
    AIAssistantPanel.tsx  # Homepage AI assistant
    ArticleSummarizer.tsx # Article detail summarization
    Header.tsx            # Navigation header
    Footer.tsx            # Site footer
    ...
  data/                   # Static/demo data
    articles.ts           # Sample articles
    homepage.ts           # Homepage content data
  lib/                    # Utilities
    ai/
      openrouter.ts       # OpenRouter integration
    supabase/
      client.ts           # Browser Supabase client
      server.ts           # Server Supabase client
  types/                  # TypeScript types
    database.ts           # Database entity types
```

## Features

### Public Website
- **Homepage**: Hero section, featured analysis, pipeline focus, AI assistant, energy themes
- **About**: Mr. Ramdane's profile, biography, platform vision
- **Analysis**: Article listing with category filtering
- **Article Detail**: Full article content with AI summarization
- **Research**: Publication listings
- **Contact**: Contact information and areas of interest

### AI Features
- **Homepage AI Assistant**: Context-based Q&A about Algeria-Europe energy
  - Paste article text or provide context
  - Ask questions grounded in the supplied content
  - Professional energy-analysis tone
  - Clear disclaimer about Phase 1 limitations

- **Article Summarization**: One-click AI summary on article detail pages
  - Automatically fetches article content
  - Generates concise professional summary
  - Loading, error, and retry states

### Admin CMS
- Secure login via Supabase Auth
- Dashboard with content statistics
- Article management (list, create, edit)
- Publication management (list, create)
- Protected routes

## AI Configuration

The platform uses OpenRouter for AI features:
- Model: `openrouter/owl-alpha`
- System prompts enforce context-based answers only
- No hallucination of facts not present in supplied content
- Professional energy-analysis tone

## Supabase Setup

1. Create a new Supabase project
2. Run the database migrations (in `/supabase/migrations/`):
   - `00001_create_articles.sql`
   - `00002_create_publications.sql`
3. Enable Email Auth in Authentication settings
4. Copy project URL and anon key to `.env.local`

### Database Schema

**articles table:**
- id, title, slug, excerpt, content, category, author
- published_at, status (draft/published)
- featured_image_url, source_url
- created_at, updated_at

**publications table:**
- id, title, slug, description, publication_date
- external_url, file_url
- created_at, updated_at

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_SUPABASE_URL | Yes | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Yes | Supabase anon key |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Supabase service role key |
| OPENROUTER_API_KEY | Yes | OpenRouter API key |
| ADMIN_EMAIL | No | Initial admin email hint |

## Deployment

### Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Supabase Production

1. Link local Supabase to project:
```bash
supabase link --project-ref <project-ref>
```

2. Push migrations:
```bash
supabase db push
```

## Current Status

**Phase 1 MVP — COMPLETE**

✅ Professional public website (all 5 pages)
✅ Responsive design (desktop, tablet, mobile)
✅ Functional AI assistant on homepage
✅ Article summarization on detail pages
✅ Admin login and dashboard
✅ Article and publication management UI
✅ OpenRouter AI integration with grounding rules
✅ Sample content populated
✅ Build passes successfully

## Known Limitations

- Admin CMS uses local demo data (Supabase integration structure ready)
- Article CRUD saves to console only (database connection needed)
- No image upload in CMS (structure ready for Supabase Storage)
- AI is context-based only (no RAG/vector search in Phase 1)

## Next Phase Roadmap

### Phase 2 — RAG & Knowledge Base
- Trusted source ingestion (government, news, research)
- Document indexing and chunking
- Vector database (pgvector)
- Source-based AI answers with citations
- Multilingual AI search (AR, EN, IT, ES, FR)

### Phase 3 — Advanced Features
- Interactive energy map
- Real-time energy data feeds
- Subscription/membership system
- Advanced analytics dashboard
- Mobile app consideration

## License

Copyright © 2026 RamBelEnergy. All rights reserved.

## Contact

For questions about this project, contact the development team or project owner.
