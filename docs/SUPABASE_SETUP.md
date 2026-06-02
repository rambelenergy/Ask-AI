# Supabase Local Setup Guide — RamBelEnergy.com

**Date:** 2026-05-29  
**Status:** Ready for local or cloud setup

---

## Option 1: Supabase Cloud (Recommended for Production)

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click "New Project"
4. Choose organization, name it `rambelenergy`
5. Select region closest to your users (e.g., `eu-west-3` for Europe)
6. Set database password (save this securely)
7. Wait for project creation (~2 minutes)

### Step 2: Get Connection Details
1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Run Migrations
1. Go to SQL Editor in Supabase Dashboard
2. Open `supabase/migrations/00001_create_articles.sql`
3. Copy and paste contents, then click "Run"
4. Open `supabase/migrations/00002_create_publications.sql`
5. Copy and paste contents, then click "Run"
6. Open `supabase/migrations/00003_seed_data.sql`
7. Copy and paste contents, then click "Run"

### Step 4: Enable Auth
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Go to Authentication → Settings
4. Set Site URL to `http://localhost:3000` (for local dev)
5. Set Additional Redirect URLs to `http://localhost:3000/admin`

### Step 5: Create Admin User
1. Go to Authentication → Users
2. Click "Add User" → "Create New User"
3. Enter admin email and password
4. Confirm the user

### Step 6: Configure Environment
```bash
cp .env.example .env.local
```

Fill in:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
OPENROUTER_API_KEY=sk-or-...
```

### Step 7: Restart Dev Server
```bash
npm run dev
```

---

## Option 2: Supabase Local (Docker Required)

> ⚠️ Docker must be installed and running. Your current environment shows Docker permission issues, so this option requires running on a machine with Docker properly configured.

### Prerequisites
- Docker Desktop or Docker Engine
- Docker Compose
- Supabase CLI (`npm install -g supabase`)

### Step 1: Start Local Supabase
```bash
cd /home/aisyah/Projects/rambelenergy-new
supabase start
```

This will:
- Start PostgreSQL database
- Start Supabase Auth
- Start Supabase Storage
- Start PostgREST API
- Start Realtime

### Step 2: Get Local Credentials
```bash
supabase status
```

Copy the `anon key` and `service_role key` from the output.

### Step 3: Run Migrations
```bash
supabase db reset
```

This applies all migrations in `supabase/migrations/` and seed data.

### Step 4: Configure Environment
```bash
cp .env.example .env.local
```

Fill in local credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (from supabase status)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (from supabase status)
OPENROUTER_API_KEY=sk-or-...
```

### Step 5: Create Admin User
```bash
supabase auth signup --email admin@rambelenergy.com --password yourpassword
```

Or use the Supabase Studio UI at `http://localhost:54323` → Authentication → Users.

### Step 6: Start Dev Server
```bash
npm run dev
```

---

## Database Schema Reference

### articles
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| title | TEXT | NOT NULL |
| slug | TEXT | NOT NULL, UNIQUE |
| excerpt | TEXT | NOT NULL |
| content | TEXT | NOT NULL |
| category | TEXT | NOT NULL |
| author | TEXT | NOT NULL, DEFAULT 'Ramdane Belamri' |
| published_at | TIMESTAMPTZ | |
| status | TEXT | NOT NULL, CHECK (draft/published) |
| featured_image_url | TEXT | |
| source_url | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

### publications
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| title | TEXT | NOT NULL |
| slug | TEXT | NOT NULL, UNIQUE |
| description | TEXT | NOT NULL |
| publication_date | TIMESTAMPTZ | |
| external_url | TEXT | |
| file_url | TEXT | |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() |

---

## RLS Policies

### articles
- **Public read**: Anyone can read published articles
- **Admin full access**: Authenticated users have full CRUD

### publications
- **Public read**: Anyone can read all publications
- **Admin full access**: Authenticated users have full CRUD

---

## Troubleshooting

### "Supabase not configured" message in console
- Check `.env.local` exists and has correct values
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server after changing env vars

### "Failed to fetch articles" in admin
- Verify Supabase is running (cloud: check status page, local: `supabase status`)
- Check RLS policies are applied
- Verify tables exist in Database → Tables

### "Unauthorized" when accessing admin
- Sign in at `/admin/login`
- Check user exists in Authentication → Users
- Verify email is confirmed

### Build fails
```bash
npm run build
```
If TypeScript errors, check that all types match database schema.

---

## Switching from Local to Cloud

When moving from local development to production:

1. Update `.env.local` with cloud credentials
2. Re-run migrations on cloud instance
3. Re-seed data if needed
4. Create admin user on cloud instance
5. Update Vercel environment variables (if deployed)

---

## Backup and Restore

### Local to Cloud
```bash
# Export local data
supabase db dump --data-only > backup.sql

# Import to cloud
# Use Supabase Dashboard SQL Editor or psql
```

---

**Next Steps After Setup:**
1. Test creating an article via admin panel
2. Verify article appears on public analysis page
3. Test AI summarization with real database content
4. Review and adjust RLS policies if needed
