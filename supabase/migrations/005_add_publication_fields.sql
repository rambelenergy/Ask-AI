-- RamBelEnergy CMS — Add publication author, external_url, and file_url fields
-- Migration: 005_add_publication_fields

ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS external_url TEXT;
ALTER TABLE public.publications ADD COLUMN IF NOT EXISTS file_url TEXT;
