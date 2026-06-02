-- RamBelEnergy CMS — Add article author and source_url fields
-- Migration: 003_add_article_fields

ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS source_url TEXT;
