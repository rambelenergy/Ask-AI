# Handover Notes — RamBelEnergy.com Phase 1

**Date:** 2026-05-29
**Status:** Phase 1 MVP Complete
**Commit:** development branch

---

## What Was Built

### Public Website
A professional, institutional energy analysis platform with 5 public pages:

1. **Homepage** — Hero section, Nigeria-Algeria-Europe pipeline focus, latest analysis cards, research publications, about analyst preview, AI assistant, energy themes
2. **About** — Ramdane Belamri's full biography, platform vision and mission, long-term AI roadmap
3. **Analysis** — Article listing with category display
4. **Article Detail** — Full article content with metadata and AI summarization
5. **Research** — Publication/brief listings
6. **Contact** — Contact information and areas of interest
7. **Energy Focus** — Thematic focus areas overview

### AI Features (Phase 1 — Context-Based Only)
- **Homepage AI Assistant**: "Ask About Algeria-Europe Energy" 
  - Context textarea + question input
  - All UI states: idle, loading, error, success
  - Example questions for visitors
  - Clear Phase 1 disclaimer
- **Article Summarization**: "Summarize This Article" on article detail pages
  - One-click summary generation
  - Loading, error, retry states
  - Disclaimer about AI-generated content

### Admin CMS
- Secure login page with Supabase Auth integration
- Protected admin layout with sidebar navigation
- Dashboard with article/publication counts
- Article listing with status badges
- Article creation form
- Publication listing
- Publication creation form
- Edit article form structure

### Backend
- `POST /api/ai/ask` — Context-based Q&A with OpenRouter
- `POST /api/ai/summarize` — Article summarization with OpenRouter
- `POST /api/auth/signout` — Secure sign out
- AI prompt grounding rules enforced server-side

---

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.2.6 |
| React | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui | Ready |
| AI Provider | OpenRouter | `openrouter/owl-alpha` |
| Auth | Supabase Auth | Ready |
| Database | Supabase PostgreSQL | Ready |

---

## Local Setup Steps

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd rambelenergy-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`

4. **Development server**
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000

5. **Production build**
   ```bash
   npm run build
   ```

---

## Supabase Setup

### 1. Create Project
- Go to supabase.com
- Create new project
- Note the project URL and anon key

### 2. Enable Auth
- Go to Authentication → Providers
- Enable Email provider
- Configure SMTP if needed for production

### 3. Database Schema

Run these SQL migrations in Supabase SQL Editor:

```sql
-- Articles table
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Ramdane Belamri',
  published_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured_image_url TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Publications table
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  publication_date TIMESTAMP WITH TIME ZONE,
  external_url TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies (basic)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read published articles" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read publications" ON publications
  FOR SELECT USING (true);
```

### 4. Environment Setup
Copy Supabase project URL and keys to `.env.local`

---

## AI Provider Setup (OpenRouter)

1. **Get API Key**
   - Visit https://openrouter.ai
   - Create account
   - Generate API key
   - Copy key to `OPENROUTER_API_KEY` in `.env.local`

2. **Model Used**
   - `openrouter/owl-alpha`
   - Can be changed in `src/lib/ai/openrouter.ts`

3. **Cost Considerations**
   - Context-based Q&A uses ~500-1000 tokens per request
   - Article summarization uses ~1000-2000 tokens per request
   - Monitor usage at openrouter.ai/activity

---

## Admin Usage Guide

### First Login
1. Create admin user in Supabase Auth dashboard
2. Navigate to `/admin/login`
3. Sign in with admin credentials

### Managing Articles
1. Go to `/admin/articles`
2. Click "New Article" to create
3. Fill in all required fields
4. Select status (Draft/Published)
5. Save

### Managing Publications
1. Go to `/admin/publications`
2. Click "New Publication" to create
3. Fill in title, description, date
4. Add external URL or file URL if applicable
5. Save

---

## Deployment Steps (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin development
   ```

2. **Import to Vercel**
   - Go to vercel.com
   - Import GitHub repository
   - Framework preset: Next.js

3. **Environment Variables**
   Add all variables from `.env.local` in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENROUTER_API_KEY`

4. **Deploy**
   - Vercel will build and deploy automatically
   - Preview deployments on pull requests
   - Production deployment on main branch push

---

## Key Files and Their Purposes

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Homepage with all sections |
| `src/app/about/page.tsx` | About/Profile page |
| `src/app/analysis/page.tsx` | Article listing |
| `src/app/analysis/[slug]/page.tsx` | Article detail with summarization |
| `src/app/research/page.tsx` | Publication listing |
| `src/components/AIAssistantPanel.tsx` | Homepage AI assistant UI |
| `src/components/ArticleSummarizer.tsx` | Article summarization UI |
| `src/lib/ai/openrouter.ts` | OpenRouter AI integration |
| `src/app/api/ai/ask/route.ts` | AI Q&A backend |
| `src/app/api/ai/summarize/route.ts` | Article summary backend |
| `src/app/admin/login/page.tsx` | Admin login |
| `src/app/admin/layout.tsx` | Protected admin shell |
| `src/data/articles.ts` | Sample/demo article data |
| `src/data/homepage.ts` | Homepage content data |

---

## Known Limitations

1. **Admin CMS uses demo data**: Article and publication CRUD saves to console, not database. Supabase integration structure is ready.

2. **No image upload**: Featured images and publication files use URLs only. Supabase Storage integration ready.

3. **No real-time sync**: Changes require page refresh. Real-time subscriptions can be added with Supabase.

4. **AI is context-only**: No RAG, no vector search, no document indexing. Answers are based solely on user-provided context.

5. **No email/notification system**: Contact form is display-only. Email integration needed for production.

6. **No analytics**: No visitor tracking or content analytics. Can be added with Vercel Analytics or similar.

---

## Security Notes

- AI API key is server-side only (never exposed to browser)
- Admin routes protected by Supabase Auth
- Input validation on all API endpoints
- No secrets committed to git (see `.gitignore`)
- Environment variables used for all sensitive config

---

## Support and Maintenance

### Regular Tasks
- Monitor OpenRouter API usage and costs
- Review AI response quality and adjust prompts if needed
- Update sample content with real client articles
- Keep dependencies updated (`npm audit`, `npm update`)

### When Supabase is Connected
1. Remove demo data from `src/data/articles.ts`
2. Update admin pages to query Supabase
3. Enable RLS policies
4. Set up production auth
5. Configure storage for images

---

## Git History

- `main` branch: Initial Next.js project setup
- `development` branch: All Phase 1 features
- Clean commit history with conventional commits

---

## Next Steps for Client

1. Review website on localhost or preview deployment
2. Provide real content to replace sample articles
3. Confirm OpenRouter API key and test AI features
4. Set up Supabase production project
5. Deploy to Vercel
6. Plan Phase 2 scope (RAG knowledge base)

---

**End of Phase 1 Handover**
