-- RamBelEnergy CMS — Row Level Security Policies
-- Migration: 004_rls_policies

-- ─────────────────────────────────────────────
-- articles
-- ─────────────────────────────────────────────

-- Public can read published articles
CREATE POLICY "articles_public_read"
  ON public.articles
  FOR SELECT
  USING (status = 'published');

-- Authenticated users can read all articles (including drafts)
CREATE POLICY "articles_auth_read"
  ON public.articles
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated users can insert
CREATE POLICY "articles_auth_insert"
  ON public.articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "articles_auth_update"
  ON public.articles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "articles_auth_delete"
  ON public.articles
  FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────
-- publications
-- ─────────────────────────────────────────────

CREATE POLICY "publications_public_read"
  ON public.publications
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "publications_auth_read"
  ON public.publications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "publications_auth_insert"
  ON public.publications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "publications_auth_update"
  ON public.publications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "publications_auth_delete"
  ON public.publications
  FOR DELETE
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────
-- site_content
-- ─────────────────────────────────────────────

CREATE POLICY "site_content_public_read"
  ON public.site_content
  FOR SELECT
  USING (true);

CREATE POLICY "site_content_auth_write"
  ON public.site_content
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- about_sections
-- ─────────────────────────────────────────────

CREATE POLICY "about_sections_public_read"
  ON public.about_sections
  FOR SELECT
  USING (true);

CREATE POLICY "about_sections_auth_write"
  ON public.about_sections
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- focus_themes
-- ─────────────────────────────────────────────

CREATE POLICY "focus_themes_public_read"
  ON public.focus_themes
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "focus_themes_auth_write"
  ON public.focus_themes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
