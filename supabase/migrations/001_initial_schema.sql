-- RamBelEnergy CMS — Initial Schema
-- Migration: 001_initial_schema
-- Target: Supabase PostgreSQL

-- ─────────────────────────────────────────────
-- Trigger function: auto-set updated_at on row update
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────
-- Table: articles
-- ─────────────────────────────────────────────
CREATE TABLE public.articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  body          TEXT,
  body_html     TEXT,
  cover_image_url TEXT,
  category      TEXT,
  source        TEXT,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT articles_status_check CHECK (status IN ('draft', 'published'))
);

CREATE UNIQUE INDEX idx_articles_slug ON public.articles (slug);
CREATE INDEX idx_articles_status ON public.articles (status);
CREATE INDEX idx_articles_published_at ON public.articles (published_at DESC);
CREATE INDEX idx_articles_category ON public.articles (category);
CREATE INDEX idx_articles_featured ON public.articles (is_featured) WHERE is_featured = true;

-- ─────────────────────────────────────────────
-- Table: publications
-- ─────────────────────────────────────────────
CREATE TABLE public.publications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT NOT NULL,
  title         TEXT NOT NULL,
  excerpt       TEXT,
  body          TEXT,
  body_html     TEXT,
  cover_image_url TEXT,
  pub_type      TEXT,
  category      TEXT,
  region        TEXT,
  published_at  TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT publications_status_check CHECK (status IN ('draft', 'published'))
);

CREATE UNIQUE INDEX idx_publications_slug ON public.publications (slug);
CREATE INDEX idx_publications_status ON public.publications (status);
CREATE INDEX idx_publications_published_at ON public.publications (published_at DESC);
CREATE INDEX idx_publications_category ON public.publications (category);
CREATE INDEX idx_publications_pub_type ON public.publications (pub_type);

-- ─────────────────────────────────────────────
-- Table: site_content
-- ─────────────────────────────────────────────
CREATE TABLE public.site_content (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  block_key     TEXT NOT NULL,
  label         TEXT NOT NULL,
  content_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_site_content_block_key ON public.site_content (block_key);

-- ─────────────────────────────────────────────
-- Table: about_sections
-- ─────────────────────────────────────────────
CREATE TABLE public.about_sections (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key   TEXT NOT NULL,
  label         TEXT NOT NULL,
  content_json  JSONB NOT NULL DEFAULT '{}'::jsonb,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_about_sections_section_key ON public.about_sections (section_key);
CREATE INDEX idx_about_sections_sort_order ON public.about_sections (sort_order);

-- ─────────────────────────────────────────────
-- Table: focus_themes
-- ─────────────────────────────────────────────
CREATE TABLE public.focus_themes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon          TEXT NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_focus_themes_sort_order ON public.focus_themes (sort_order);
CREATE INDEX idx_focus_themes_active ON public.focus_themes (is_active);

-- ─────────────────────────────────────────────
-- Triggers: updated_at on all tables
-- ─────────────────────────────────────────────
CREATE TRIGGER set_updated_at_articles
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_publications
  BEFORE UPDATE ON public.publications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_site_content
  BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_about_sections
  BEFORE UPDATE ON public.about_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_updated_at_focus_themes
  BEFORE UPDATE ON public.focus_themes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─────────────────────────────────────────────
-- Row Level Security (RLS) — enabled, policies TBD
-- ─────────────────────────────────────────────
-- RLS is enabled on all tables. Policies should be defined
-- during CMS implementation when Supabase Auth is configured.
--
-- Planned policy pattern:
--   SELECT  — public for published/active rows, authenticated for all
--   INSERT/UPDATE/DELETE — authenticated only (admin role)
-- ─────────────────────────────────────────────

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_themes ENABLE ROW LEVEL SECURITY;

-- Temporary bypass policy for development (REMOVE during CMS setup):
-- CREATE POLICY "dev_bypass_all" ON public.articles FOR ALL USING (true);
-- CREATE POLICY "dev_bypass_all" ON public.publications FOR ALL USING (true);
-- CREATE POLICY "dev_bypass_all" ON public.site_content FOR ALL USING (true);
-- CREATE POLICY "dev_bypass_all" ON public.about_sections FOR ALL USING (true);
-- CREATE POLICY "dev_bypass_all" ON public.focus_themes FOR ALL USING (true);
